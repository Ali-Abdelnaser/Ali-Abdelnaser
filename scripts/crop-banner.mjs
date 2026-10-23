import fs from 'node:fs';
import zlib from 'node:zlib';
const source='assets/ChatGPT Image Oct 19, 2026, 03_26_25 AM-2.png';
const destination='assets/hero-public.png';
const png=fs.readFileSync(source);
const sig=Buffer.from([137,80,78,71,13,10,26,10]);
if (!png.subarray(0,8).equals(sig)) throw Error('Not a PNG');
let off=8, ihdr=null, idats=[], chunks=[];
while(off<png.length){
 const len=png.readUInt32BE(off);
 const kind=png.toString('ascii',off+4,off+8);
 const data=png.subarray(off+8,off+8+len);
 if(kind==='IHDR') ihdr=Buffer.from(data);
 else if(kind==='IDAT') idats.push(data);
 else if(kind!=='IEND') chunks.push({kind,data:Buffer.from(data)});
 off+=len+12;
 if(kind==='IEND')break;
}
if(!ihdr)throw Error('Missing IHDR');
const width=ihdr.readUInt32BE(0),height=ihdr.readUInt32BE(4),depth=ihdr[8],color=ihdr[9],interlace=ihdr[12];
const channels={0:1,2:3,3:1,4:2,6:4}[color];
if (!channels || interlace!==0) throw Error('Unsupported PNG mode');
const stride=Math.ceil(width*channels*depth/8)+1;
const raw=zlib.inflateSync(Buffer.concat(idats));
if(raw.length!==stride*height)throw Error('Unexpected PNG scanline size');
const crop=Math.floor(height*0.78);
const output=raw.subarray(0,stride*crop);
const newIhdr=Buffer.from(ihdr); newIhdr.writeUInt32BE(crop,4);
const crcTable=new Uint32Array(256);
for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=(c&1)?(0xedb88320^(c>>>1)):(c>>>1);crcTable[n]=c>>>0}
function crc32(b){let c=0xffffffff;for(let i=0;i<b.length;i++)c=crcTable[(c^b[i])&255]^(c>>>8);return (c^0xffffffff)>>>0}
function chunk(type,data){const name=Buffer.from(type,'ascii');const length=Buffer.alloc(4);length.writeUInt32BE(data.length);const crc=Buffer.alloc(4);crc.writeUInt32BE(crc32(Buffer.concat([name,data])));return Buffer.concat([length,name,data,crc]);}
const before=chunks.filter(c=>c.kind==='PLTE'||c.kind==='tRNS'||c.kind==='iCCP'||c.kind==='sRGB'||c.kind==='gAMA'||c.kind==='cHRM'||c.kind==='pHYs');
const result=Buffer.concat([sig,chunk('IHDR',newIhdr),...before.map(c=>chunk(c.kind,c.data)),chunk('IDAT',zlib.deflateSync(output,{level:9})),chunk('IEND',Buffer.alloc(0))]);
fs.writeFileSync(destination,result);
console.log(JSON.stringify({source,destination,width,oldHeight:height,croppedHeight:crop,size:result.length}));
