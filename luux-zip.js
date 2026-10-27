// ZIP 작성기(무압축 STORE, UTF-8 파일명): 포트폴리오·성과 보고 다운로드에서 같이 쓴다
(()=>{
const crcTable=new Uint32Array(256).map((_,n)=>{let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;return c>>>0});
const crc32=b=>{let c=0xFFFFFFFF;for(let i=0;i<b.length;i++)c=crcTable[(c^b[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0};
window.luuxZip=function(files){const enc=new TextEncoder(),parts=[],central=[],d=new Date(),time=d.getHours()<<11|d.getMinutes()<<5|d.getSeconds()>>1,date=(d.getFullYear()-1980)<<9|(d.getMonth()+1)<<5|d.getDate();let offset=0;
for(const f of files){const name=enc.encode(f.name),crc=crc32(f.data),size=f.data.length;
const h=new DataView(new ArrayBuffer(30));h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x0800,true);h.setUint16(10,time,true);h.setUint16(12,date,true);h.setUint32(14,crc,true);h.setUint32(18,size,true);h.setUint32(22,size,true);h.setUint16(26,name.length,true);
parts.push(h,name,f.data);
const c=new DataView(new ArrayBuffer(46));c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x0800,true);c.setUint16(12,time,true);c.setUint16(14,date,true);c.setUint32(16,crc,true);c.setUint32(20,size,true);c.setUint32(24,size,true);c.setUint16(28,name.length,true);c.setUint32(42,offset,true);
central.push(c,name);offset+=30+name.length+size}
const cdSize=central.reduce((n,p)=>n+p.byteLength,0),e=new DataView(new ArrayBuffer(22));e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,cdSize,true);e.setUint32(16,offset,true);
return new Blob([...parts,...central,e],{type:'application/zip'})}
})();
