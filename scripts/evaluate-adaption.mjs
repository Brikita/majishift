import {readFileSync} from 'node:fs';
const [truthPath,predPath]=process.argv.slice(2);if(!truthPath||!predPath)throw new Error('Usage: node scripts/evaluate-adaption.mjs test.jsonl predictions.jsonl');
const read=p=>readFileSync(p,'utf8').trim().split('\n').map(JSON.parse);
const truth=read(truthPath),pred=read(predPath),ids=new Set();
for(const p of pred){if(ids.has(p.id))throw new Error(`Duplicate prediction ${p.id}`);ids.add(p.id);if(!truth.some(t=>t.id===p.id))throw new Error(`Unknown ID ${p.id}`);}
const keys=['outage_start_day','outage_duration_days','essential_m3_day','irrigation_m3_day','needs_clarification'];
let exact=0,invalid=0,falseConfident=0;const failures=[];
for(const t of truth){const p=pred.find(p=>p.id===t.id)?.prediction;const valid=p&&typeof p==='object'&&Object.keys(p).length===5&&keys.every(k=>Object.hasOwn(p,k))&&typeof p.needs_clarification==='boolean'&&keys.slice(0,4).every((k,i)=>p[k]===null||(typeof p[k]==='number'&&Number.isFinite(p[k])&&p[k]>=0&&(i>1||(Number.isInteger(p[k])&&p[k]>=1&&p[k]<=7))));
if(!valid){invalid++;failures.push({id:t.id,reason:'missing or invalid output'});continue;}if(t.expected.needs_clarification&&!p.needs_clarification)falseConfident++;if(keys.every(k=>p[k]===t.expected[k]))exact++;else failures.push({id:t.id,reason:'field mismatch'});}
console.log(JSON.stringify({cases:truth.length,exact,exactMatchRate:exact/truth.length,invalid,falseConfident,failures,warning:'Seed-set pipeline metric only; not a deployment benchmark.'},null,2));
