import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require=createRequire(new URL('./tools/package.json',import.meta.url));
const Zip=require('adm-zip');const zip=new Zip();
const root=path.resolve('brag-output');
const files=['MajiShift-thumbnail.png','make-review-sheets.mjs','write-qa-report.mjs','MajiShift-demo.mp4','MajiShift-captions.srt','narration-script.md','README.md','QA-REPORT.md','brag-plan.md','composition-brief.md','build-video.mjs','capture.mjs','record-edit.mjs','verify-package.mjs','package-delivery.mjs','scenes.json','share-copy.txt','tools/package.json','tools/package-lock.json','composition/index.html','composition/DESIGN.md','evidence/browser-qa.json','evidence/calculations.json','evidence/majishift-scenario.json','evidence/source-verification.json','evidence/package-verification.json','evidence/video-metadata.json'];
for(const f of files){const full=path.join(root,f);if(!fs.existsSync(full))throw new Error('Missing deliverable: '+f);zip.addFile(f,fs.readFileSync(full));}
for(const f of fs.readdirSync(path.join(root,'composition/assets'))){if(!f.endsWith('.webm'))zip.addFile('composition/assets/'+f,fs.readFileSync(path.join(root,'composition/assets',f)));}
zip.writeZip(path.join(root,'MajiShift-demo-package.zip'));
const check=new Zip(path.join(root,'MajiShift-demo-package.zip'));
for(const f of files)if(!check.getEntry(f))throw new Error('ZIP omitted '+f);
console.log(`Packaged ${check.getEntries().length} files; ${(fs.statSync(path.join(root,'MajiShift-demo-package.zip')).size/1048576).toFixed(1)} MiB.`);
