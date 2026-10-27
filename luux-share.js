// 공유: 링크를 복사하고(휴대폰은 기본 공유 창도 띄움) 화면 아래에 "링크가 복사되었습니다" 안내
(()=>{
const style=document.createElement('style');
style.textContent='.luux-toast{position:fixed;left:50%;bottom:calc(32px + env(safe-area-inset-bottom,0px));transform:translate(-50%,8px);z-index:2147483647;padding:10px 16px;border-radius:2px;background:#171717;color:#fff;font:600 12px/1.4 Arial,"Apple SD Gothic Neo",sans-serif;letter-spacing:.02em;opacity:0;pointer-events:none;transition:opacity .2s,transform .2s}.luux-toast.show{opacity:1;transform:translate(-50%,0)}';
document.head.append(style);
let toast,timer;
function showToast(text){
  // 상세 dialog가 열려 있으면 그 위에 보이도록 dialog 안에 둔다
  const host=document.querySelector('dialog[open]')||document.body;
  if(!toast)toast=document.createElement('div'),toast.className='luux-toast',toast.setAttribute('role','status');
  if(toast.parentNode!==host)host.append(toast);
  toast.textContent=text;requestAnimationFrame(()=>toast.classList.add('show'));
  clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove('show'),2200);
}
async function copy(text){
  try{await navigator.clipboard.writeText(text);return true}catch(e){}
  const t=document.createElement('textarea');t.value=text;t.setAttribute('readonly','');t.style.cssText='position:fixed;opacity:0';
  (document.querySelector('dialog[open]')||document.body).append(t);t.select();
  let ok=false;try{ok=document.execCommand('copy')}catch(e){}t.remove();return ok;
}
// 공유받은 링크(?share=1)로 들어오면 이 페이지 밖으로 나가는 길을 막는다: 홈·로고 링크, 뒤로가기
window.luuxShared=new URLSearchParams(location.search).has('share');
if(luuxShared){
  style.textContent+='.luux-shared header a.home,.luux-shared header a.nav,.luux-shared #close{display:none!important}.luux-shared header a{pointer-events:none;cursor:default}';
  document.documentElement.classList.add('luux-shared');
  const lock=()=>document.querySelectorAll('header a[href]').forEach(a=>{a.removeAttribute('href');a.setAttribute('aria-disabled','true');a.tabIndex=-1});
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',lock):lock();
  history.pushState(null,'',location.href);
  addEventListener('popstate',()=>history.pushState(null,'',location.href));
}
// 공유할 링크: 받은 사람도 같은 잠금 모드로 열리도록 share=1을 붙인다
window.luuxShareUrl=(hash='')=>location.origin+location.pathname+'?share=1'+hash;
window.luuxShare=async function({title,url}){
  // 복사는 누른 순간 바로 시작하고, 휴대폰은 이어서 기본 공유 창을 띄운다. 끝나면 아래에 복사 안내를 보여준다
  const copying=copy(url);
  if(matchMedia('(pointer:coarse)').matches&&navigator.share){try{await navigator.share({title,url})}catch(e){}}
  showToast(await copying?'링크가 복사되었습니다':'링크를 복사하지 못했습니다');
};
})();
