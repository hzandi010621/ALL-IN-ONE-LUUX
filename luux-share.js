// 공유: 휴대폰은 기본 공유 창, PC는 링크 복사 후 "링크 복사됨" 안내
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
  clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove('show'),1800);
}
async function copy(text){
  try{await navigator.clipboard.writeText(text);return true}catch(e){}
  const t=document.createElement('textarea');t.value=text;t.setAttribute('readonly','');t.style.cssText='position:fixed;opacity:0';
  (document.querySelector('dialog[open]')||document.body).append(t);t.select();
  let ok=false;try{ok=document.execCommand('copy')}catch(e){}t.remove();return ok;
}
window.luuxShare=async function({title,url}){
  const mobile=matchMedia('(pointer:coarse)').matches;
  if(mobile&&navigator.share){
    try{await navigator.share({title,url});return}catch(e){if(e.name==='AbortError')return}
  }
  showToast(await copy(url)?'링크 복사됨':'링크를 복사하지 못했습니다');
};
})();
