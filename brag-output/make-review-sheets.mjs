import fs from 'node:fs';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
const require=createRequire(new URL('./tools/package.json',import.meta.url));
const sharp=require('sharp'),ffmpeg=require('ffmpeg-static');
const scenes=JSON.parse(fs.readFileSync('brag-output/scenes.json','utf8'));
for(let batch=0;batch<2;batch++){
 const composites=[];
 for(let k=0;k<12;k++){
  const i=batch*12+k;if(i>=scenes.length)break;
  const label=Buffer.from(`<svg width="640" height="32"><rect width="640" height="32" fill="#071d27"/><text x="12" y="23" fill="white" font-family="Arial" font-size="18">${i+1}. ${(scenes[i].start+scenes[i].end)/2}s</text></svg>`);
  composites.push({input:label,left:(k%3)*640,top:Math.floor(k/3)*392});
  composites.push({input:await sharp(`brag-output/final-frames/scene-${String(i+1).padStart(2,'0')}.png`).resize(640,360).toBuffer(),left:(k%3)*640,top:Math.floor(k/3)*392+32});
 }
 await sharp({create:{width:1920,height:1568,channels:3,background:'#071d27'}}).composite(composites).jpeg({quality:90}).toFile(`brag-output/final-frames/contact-${batch+1}.jpg`);
}
const times=[156,158.5,161,164,167];const composites=[];
for(let i=0;i<times.length;i++){
 const p=`brag-output/final-frames/interaction-${i}.png`;
 const r=spawnSync(ffmpeg,['-v','error','-y','-ss',String(times[i]),'-i','brag-output/MajiShift-demo.mp4','-frames:v','1',p],{encoding:'utf8'});if(r.status)throw new Error(r.stderr);
 composites.push({input:await sharp(p).resize(640,360).toBuffer(),left:(i%3)*640,top:Math.floor(i/3)*360});
}
await sharp({create:{width:1920,height:720,channels:3,background:'#071d27'}}).composite(composites).jpeg({quality:90}).toFile('brag-output/final-frames/interaction-sheet.jpg');
fs.copyFileSync('brag-output/final-frames/scene-01.png','brag-output/MajiShift-thumbnail.png');
console.log('Created final-video review sheets and thumbnail.');
