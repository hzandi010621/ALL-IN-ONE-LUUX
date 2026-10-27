// 공유: 링크를 복사하고(휴대폰은 기본 공유 창도 띄움) 화면 아래에 "링크가 복사되었습니다" 안내
(()=>{
const style=document.createElement('style');
style.textContent='.luux-toast{position:fixed;left:50%;bottom:calc(32px + env(safe-area-inset-bottom,0px));transform:translate(-50%,8px);z-index:2147483647;padding:10px 16px;border-radius:2px;background:#171717;color:#fff;font:600 12px/1.4 Arial,"Apple SD Gothic Neo",sans-serif;letter-spacing:.02em;opacity:0;pointer-events:none;transition:opacity .2s,transform .2s}.luux-toast.luux-toast-on{opacity:1;transform:translate(-50%,0)}';
// 전체화면·다운로드·공유 버튼은 가장 넓은 버튼에 맞춰 같은 크기로 보인다
style.textContent+='.fullscreen-actions,.viewer-tools,#detail .downloads{display:inline-grid!important;grid-auto-flow:column;grid-auto-columns:1fr;align-items:stretch}.fullscreen-actions>*,.viewer-tools>*,#detail .downloads>*{justify-content:center;margin:0}@media(max-width:700px){#detail .downloads{display:grid!important;width:100%}.fullscreen-actions>.dl-btn{height:44px}}';
document.head.append(style);
let toast,timer;
function showToast(text){
  // 상세 dialog가 열려 있으면 그 위에 보이도록 dialog 안에 둔다
  const host=document.querySelector('dialog[open]')||document.body;
  if(!toast)toast=document.createElement('div'),toast.className='luux-toast',toast.setAttribute('role','status');
  if(toast.parentNode!==host)host.append(toast);
  toast.textContent=text;requestAnimationFrame(()=>toast.classList.add('luux-toast-on'));
  clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove('luux-toast-on'),2200);
}
async function copy(text){
  try{await navigator.clipboard.writeText(text);return true}catch(e){}
  const t=document.createElement('textarea');t.value=text;t.setAttribute('readonly','');t.style.cssText='position:fixed;opacity:0';
  (document.querySelector('dialog[open]')||document.body).append(t);t.select();
  let ok=false;try{ok=document.execCommand('copy')}catch(e){}t.remove();return ok;
}
// 공유받은 링크(?r=영문·숫자 6자)로 들어온 탭은 그 페이지에 묶어 둔다.
// 주소에서 r을 지우거나 다른 허브 주소를 입력해도, 같은 탭에서는 처음 받은 페이지로 돌아간다.
const LOCK_KEY='luux-share-lock';
const token=new URLSearchParams(location.search).get('r');
let locked=null;try{locked=sessionStorage.getItem(LOCK_KEY)}catch(e){}
// 이전에 보낸 ?share=1 링크도 계속 잠긴 상태로 열리게 둔다
if(token&&/^[a-z0-9]{6}$/.test(token)||new URLSearchParams(location.search).has('share')){locked=location.href;try{sessionStorage.setItem(LOCK_KEY,locked)}catch(e){}}
const samePlace=u=>{const a=new URL(u);return a.pathname===location.pathname&&decodeURIComponent(a.hash)===decodeURIComponent(location.hash)};
if(locked&&!samePlace(locked)){location.replace(locked)}
window.luuxShared=!!locked;
if(luuxShared){
  style.textContent+='.luux-shared header a.home,.luux-shared header a.nav,.luux-shared #close{display:none!important}.luux-shared header a{pointer-events:none;cursor:default}';
  document.documentElement.classList.add('luux-shared');
  const lock=()=>document.querySelectorAll('header a[href]').forEach(a=>{a.removeAttribute('href');a.setAttribute('aria-disabled','true');a.tabIndex=-1});
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',lock):lock();
  history.pushState(null,'',location.href);
  addEventListener('popstate',()=>history.pushState(null,'',location.href));
  addEventListener('hashchange',()=>{if(!samePlace(locked))location.replace(locked)});
}
// 공유할 링크: 받은 사람도 같은 잠금 상태로 열리도록 r 값을 붙인다
window.luuxShareUrl=(hash='')=>location.origin+location.pathname+'?r='+Math.random().toString(36).slice(2,8).padEnd(6,'0')+hash;
window.luuxShare=async function({title,url}){
  // 복사는 누른 순간 바로 시작하고, 휴대폰은 이어서 기본 공유 창을 띄운다. 끝나면 아래에 복사 안내를 보여준다
  const copying=copy(url);
  if(matchMedia('(pointer:coarse)').matches&&navigator.share){try{await navigator.share({title,url})}catch(e){}}
  showToast(await copying?'링크가 복사되었습니다':'링크를 복사하지 못했습니다');
};
})();
