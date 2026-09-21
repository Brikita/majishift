import fs from 'node:fs';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import crypto from 'node:crypto';
const require=createRequire(new URL('./tools/package.json',import.meta.url));
const ffmpeg=require('ffmpeg-static'),ffprobe=require('ffprobe-static').path;
const scenes=JSON.parse(fs.readFileSync('brag-output/scenes.json','utf8'));
const calculations=JSON.parse(fs.readFileSync('brag-output/evidence/calculations.json','utf8'));
const exported=JSON.parse(fs.readFileSync('brag-output/evidence/majishift-scenario.json','utf8'));
assert.equal(scenes[0].start,0);assert.equal(scenes.at(-1).end,240);
scenes.forEach((s,i)=>{assert.ok(s.end>s.start);if(i)assert.equal(s.start,scenes[i-1].end);assert.ok((s.end-s.start)>=s.caption.split(/\s+/).length*0.3);});
const srt=fs.readFileSync('brag-output/MajiShift-captions.srt','utf8');
const script=fs.readFileSync('brag-output/narration-script.md','utf8');
for(const s of scenes){assert.ok(srt.includes(s.caption));assert.ok(script.includes(s.caption));}
assert.equal(exported.config.initial,8000);assert.deepEqual(exported.plan,calculations.editedResult.plan);
assert.equal(calculations.defaultResult.plan.filter(d=>d.end<5000).length,0);
assert.equal(calculations.defaultResult.baseline.filter(d=>d.end<5000).length,5);
assert.equal(calculations.defaultResult.pumped,7875);
assert.equal(calculations.defaultResult.plan[0].hours,4.5);
assert.equal(exported.plan[0].hours,8.5);
const unique=new Map();
for(const name of ['conduit-official-1.csv','conduit-official-2.csv','conduit-official-3.csv']){
 const lines=fs.readFileSync('data/'+name,'utf8').split(/\r?\n/).filter(l=>l&&!l.startsWith('#'));
 const columns=lines.shift().split(',');
 for(const line of lines){const row=line.split(',');unique.set(row[0],Object.fromEntries(columns.map((c,i)=>[c,row[i]])));}
}
const weatherAudit=calculations.weather.map(d=>{
 const rows=[...unique.values()].filter(r=>r.Time.startsWith(d.date)).sort((a,b)=>a.Time.localeCompare(b.Time));
 const ts=rows.map(r=>Number(r['SHT Temperature']));
 assert.equal(rows.length,d.samples);assert.equal(Math.min(...ts),d.temperatureMinC);assert.equal(Math.max(...ts),d.temperatureMaxC);
 assert.ok(Math.abs(ts.reduce((a,b)=>a+b,0)/ts.length-d.temperatureMeanC)<0.0051);
 const last=rows.at(-1);assert.equal((Number(last['Rain Gauge 1 Total Today'])+Number(last['Rain Gauge 2 Total Today']))/2,d.rainMm);
 return {date:d.date,samples:rows.length,temperatureAndRainMatch:true};
});
const video='brag-output/MajiShift-demo.mp4';
if(process.argv.includes('--source-only')) {
 fs.writeFileSync('brag-output/evidence/source-verification.json',JSON.stringify({weatherAudit,captionCount:scenes.length,captionAndNarrationMatch:true,exportMatchesCalculation:true},null,2));
 console.log('Source records, exported results, captions and script verified.');
 process.exit(0);
}
const probe=spawnSync(ffprobe,['-v','error','-show_streams','-show_format','-of','json',video],{encoding:'utf8'});
assert.equal(probe.status,0,probe.stderr);const metadata=JSON.parse(probe.stdout);
const v=metadata.streams.find(s=>s.codec_type==='video');assert.equal(v.width,1920);assert.equal(v.height,1080);
assert.equal(v.codec_name,'h264');assert.equal(v.r_frame_rate,'24/1');assert.equal(Number(v.nb_frames),5760);
assert.ok(Math.abs(Number(metadata.format.duration)-240)<0.1);assert.equal(metadata.streams.filter(s=>s.codec_type==='audio').length,0);
const decode=spawnSync(ffmpeg,['-v','error','-i',video,'-f','null','-'],{encoding:'utf8',timeout:180000});assert.equal(decode.status,0,decode.stderr);
fs.mkdirSync('brag-output/final-frames',{recursive:true});
for(let i=0;i<scenes.length;i++){
 const s=scenes[i],time=(s.start+s.end)/2;
 const r=spawnSync(ffmpeg,['-v','error','-y','-ss',String(time),'-i',video,'-frames:v','1',`brag-output/final-frames/scene-${String(i+1).padStart(2,'0')}.png`],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);
}
const report={verifiedAt:new Date().toISOString(),duration:Number(metadata.format.duration),width:v.width,height:v.height,codec:v.codec_name,frameRate:v.r_frame_rate,audioStreams:0,decodeErrors:decode.stderr,sceneCount:scenes.length,captionAndNarrationMatch:true,captionReadingTimeFloor:'0.3 seconds per word or more',actualExportMatchesEditedCalculation:true,weatherAudit,sha256:crypto.createHash('sha256').update(fs.readFileSync(video)).digest('hex'),submissionFinishingSteps:['Add real team clips in the 8–22-second opening slot.','Clarify silent-audio acceptance or add narration before submission.'],visualReview:'Review final-frames contact sheets separately; this report does not substitute for visual inspection.'};
fs.writeFileSync('brag-output/evidence/package-verification.json',JSON.stringify(report,null,2));
fs.writeFileSync('brag-output/evidence/video-metadata.json',JSON.stringify(metadata,null,2));
console.log(JSON.stringify(report,null,2));
