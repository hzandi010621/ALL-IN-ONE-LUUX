projects.sort((a,b)=>b.date.localeCompare(a.date)||a.row-b.row);
const grid=document.querySelector('#grid'),industry=document.querySelector('#industry'),dialog=document.querySelector('#detail');
[...new Set(projects.map(p=>p.industry))].forEach(value=>industry.add(new Option(value,value)));
function render(){const list=projects.filter(p=>(!industry.value||p.industry===industry.value));grid.replaceChildren();document.querySelector('#count').textContent=String(list.length).padStart(2,'0')+' REPORT';document.querySelector('#empty').hidden=!!list.length;list.forEach(p=>{const button=document.createElement('button');button.className='card';button.setAttribute('aria-label',p.title+' '+p.date+' 상세 보기');button.innerHTML=`<span class="picture"><img loading="lazy" src="${p.images[0].src}" alt="${p.title} 보고서 표지"></span><span class="caption"><h2>${p.title}</h2><time>${p.date}</time></span><p class="tags">${p.industry}</p>`;button.onclick=()=>openProject(p);grid.append(button)});}
industry.onchange=render;document.querySelector('#reset').onclick=()=>{industry.value='';render()};document.querySelectorAll('[data-cols]').forEach(b=>b.onclick=()=>{grid.classList.toggle('cols4',b.dataset.cols==='4');document.querySelectorAll('[data-cols]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)))});
let active,index=0;function openProject(p){active=p;index=0;history.replaceState(null,'','#'+slugFor(p));document.querySelector('#title').textContent=p.title;document.querySelector('#meta').textContent=`${p.industry} / ${p.date}`;fillReport(p);document.querySelector('#thumbs').replaceChildren();p.images.forEach((im,i)=>{const b=document.createElement('button');b.setAttribute('aria-label',`사진 ${i+1}`);b.innerHTML=`<img src="${im.src}" alt="">`;b.onclick=()=>{index=i;showPhoto()};document.querySelector('#thumbs').append(b)});showPhoto();dialog.showModal();document.body.style.overflow='hidden'}function showPhoto(){const im=active.images[index];document.querySelector('#photo').src=im.src;document.querySelector('#photo').alt=active.title+' 사진 '+(index+1);document.querySelector('#position').textContent=`${String(index+1).padStart(2,'0')} / ${String(active.images.length).padStart(2,'0')}`;document.querySelectorAll('#thumbs button').forEach((b,i)=>{b.classList.toggle('active',i===index);b.setAttribute('aria-pressed',String(i===index))})}function move(n){index=(index+n+active.images.length)%active.images.length;showPhoto()}document.querySelector('#prev').onclick=()=>move(-1);document.querySelector('#next').onclick=()=>move(1);document.querySelector('#close').onclick=()=>dialog.close();dialog.onclose=()=>{document.body.style.overflow='';history.replaceState(null,'',location.pathname+location.search)};dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight')move(1);if(e.key==='ArrowLeft')move(-1)});dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});render();

document.querySelectorAll("[data-page]").forEach(b=>b.onclick=()=>{index=Number(b.dataset.page);showPhoto()});
// 보고서마다 다른 성과 수치·다운로드·대시보드·목차 위치
function fillReport(p){const d=document.getElementById('detail');
if(p.facts)d.querySelector('.facts').innerHTML=p.facts.map(f=>`<div><small>${f.label}</small><strong>${f.value}${f.unit?`<span>${f.unit}</span>`:''}</strong><span>${f.desc}</span></div>`).join('');
const dash=d.querySelector('.analysis-link');if(p.dashboard){dash.href=p.dashboard;dash.hidden=false}else dash.hidden=true;
if(p.chapters)d.querySelectorAll('.report-toolbar nav [data-page]').forEach((b,i)=>{if(p.chapters[i]!=null)b.dataset.page=p.chapters[i]})}

// 보고서별 주소: reports.html#고려대학교 로 들어오면 해당 보고서 상세를 바로 연다
function slugFor(p){const base=t=>t.replace(/[\s()·\/,&]+/g,'-').replace(/^-+|-+$/g,''),s=base(p.title);
return projects.filter(q=>base(q.title)===s).length>1?s+'-'+p.date.slice(2).replace('.',''):s}
function openFromHash(){const h=decodeURIComponent(location.hash.slice(1));if(!h)return;const p=projects.find(q=>slugFor(q)===h);if(p&&!(dialog.open&&active===p))openProject(p)}
openFromHash();addEventListener('hashchange',openFromHash);
document.querySelector('#shareCase')?.addEventListener('click',()=>{if(active)luuxShare({title:`LUUX 성과 보고서 · ${active.title}`,url:luuxShareUrl('#'+slugFor(active))})});
// 공유받은 링크에서는 상세를 닫을 수 없다(X·Esc·바깥 클릭)
if(window.luuxShared){dialog.addEventListener('cancel',e=>e.preventDefault());dialog.close=()=>{}}
// 다운로드: 이 보고서의 PDF·PPTX를 ZIP 하나로 저장
(()=>{const btn=document.querySelector('#download'),label=document.querySelector('#downloadLabel');if(!btn)return;let busy=false;
btn.addEventListener('click',async e=>{e.preventDefault();if(busy||!active)return;busy=true;btn.setAttribute('aria-busy','true');
const p=active,list=[p.pdf,p.pptx].filter(Boolean);let done=0;label.textContent=`준비 중 0/${list.length}`;
try{const files=await Promise.all(list.map(async src=>{const r=await fetch(src);if(!r.ok)throw new Error(src);const data=new Uint8Array(await r.arrayBuffer());
label.textContent=`준비 중 ${++done}/${list.length}`;return{name:`${p.title}_성과보고서.${src.split('.').pop()}`,data}}));
const a=document.createElement('a');a.href=URL.createObjectURL(luuxZip(files));a.download=`LUUX_${p.title}_성과보고서.zip`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),60000);
label.textContent='다운로드'}catch(err){label.textContent='다시 시도해주세요'}finally{busy=false;btn.removeAttribute('aria-busy')}})})();
