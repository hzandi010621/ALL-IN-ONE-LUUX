(() => {
  const detail = document.getElementById('detail');
  const trigger = document.getElementById('openFullscreen');
  if (!detail || !trigger) return;
  const style = document.createElement('style');
  style.textContent = `
.fullscreen-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
#openFullscreen{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:38px;padding:0 16px;border:1px solid #ddd;border-radius:2px;background:#fff;color:#171717;font:600 12px Arial,'Apple SD Gothic Neo',sans-serif;white-space:nowrap;cursor:pointer}
#openFullscreen svg{width:16px;height:16px;flex:none}#openFullscreen:hover{background:#f3f4ee}
#luuxFullscreen{position:fixed;inset:0;margin:0;padding:0;width:100vw;max-width:100vw;height:100dvh;max-height:100dvh;border:0;border-radius:0;background:#0d0d0d;color:#fff;overflow:hidden}
#luuxFullscreen::backdrop{background:#0d0d0d}
#luuxFullscreen .fs-image{position:absolute;inset:56px 72px 64px;width:calc(100% - 144px);height:calc(100% - 120px);object-fit:contain;touch-action:pan-y}
#luuxFullscreen button{position:absolute;display:grid;place-items:center;border:0;background:#0d0d0d99;color:#fff;cursor:pointer;width:48px;height:48px;font:28px Arial,sans-serif;border-radius:50%}
#luuxFullscreen .fs-close{right:16px;top:12px;font-size:24px}
#luuxFullscreen .fs-prev{left:12px;top:calc(50% - 24px)}#luuxFullscreen .fs-next{right:12px;top:calc(50% - 24px)}
#luuxFullscreen .fs-count{position:absolute;left:72px;right:72px;bottom:22px;text-align:center;color:#bbb;font:13px Arial,sans-serif;font-variant-numeric:tabular-nums}
#luuxFullscreen :focus-visible,#openFullscreen:focus-visible{outline:2px solid #999;outline-offset:3px}
@media(max-width:700px){#detail .downloads{flex-wrap:wrap}#detail .downloads #openFullscreen{flex:1;height:44px}#openFullscreen{height:44px;padding:0 12px}.fullscreen-actions{justify-content:flex-end}#luuxFullscreen .fs-image{inset:60px 8px 60px;width:calc(100% - 16px);height:calc(100% - 120px)}#luuxFullscreen .fs-prev{left:8px}#luuxFullscreen .fs-next{right:8px}#luuxFullscreen button{width:44px;height:44px}#luuxFullscreen .fs-count{bottom:calc(20px + env(safe-area-inset-bottom))}}
`;
  document.head.append(style);
  const full = document.createElement('dialog');
  full.id = 'luuxFullscreen';
  full.setAttribute('aria-label','자료 전체화면');
  full.innerHTML = '<img class="fs-image" alt=""><button class="fs-close" type="button" aria-label="전체화면 닫기">×</button><button class="fs-prev" type="button" aria-label="이전 장">←</button><button class="fs-next" type="button" aria-label="다음 장">→</button><div class="fs-count" aria-live="polite"></div>';
  document.body.append(full);
  const image = full.querySelector('img');
  const video = document.createElement('iframe');
  video.className='fs-image';video.title='송출 영상 전체화면';video.allow='autoplay; fullscreen';video.allowFullscreen=true;video.style.border='0';video.hidden=true;full.append(video);
  const nativeFull=document.createElement('video');nativeFull.className='fs-image';nativeFull.controls=true;nativeFull.playsInline=true;nativeFull.preload='metadata';nativeFull.hidden=true;full.append(nativeFull);
  // 영상 함수(mediaFor·stopVideo)는 포트폴리오에만 있다. 성과 보고처럼 사진만 있는 페이지에서도 동작하게 한다
  const mediaItems=()=>typeof mediaFor==='function'?mediaFor(active):active.images;
  const stopDetailVideo=()=>{if(typeof stopVideo==='function')stopVideo()};
  function stopFullVideo(){video.src='about:blank';nativeFull.pause();nativeFull.removeAttribute('src');nativeFull.load();nativeFull.hidden=true;}
  function sync() {
    const current=mediaItems()[index];
    stopFullVideo();video.hidden=true;image.hidden=current.type==='video';
    if(current.type==='video'){if(/\.mp4(?:$|[?#])/i.test(current.src)){nativeFull.src=current.src;nativeFull.poster=current.poster||active.images[0].src;nativeFull.hidden=false;}else{video.hidden=false;video.src=current.src;}}
    const photo = document.getElementById('photo');
    image.src = photo.src;
    image.alt = photo.alt;
    full.querySelector('.fs-count').textContent = document.getElementById('position').textContent;
  }
  function step(delta) { move(delta); stopDetailVideo(); sync(); }
  function close() { stopFullVideo();if (full.open) full.close(); }
  trigger.addEventListener('click', () => {
    stopDetailVideo();sync(); full.showModal();
    full.querySelector('.fs-close').focus();
  });
  full.querySelector('.fs-close').onclick = close;
  full.querySelector('.fs-prev').onclick = () => step(-1);
  full.querySelector('.fs-next').onclick = () => step(1);
  full.addEventListener('cancel', event => { event.preventDefault(); close(); });
  full.addEventListener('close', () => { stopFullVideo();if(detail.open){showPhoto();trigger.focus();} });
  detail.addEventListener('close', close);
  full.addEventListener('keydown', event => {if(event.target.tagName==='VIDEO'){event.stopPropagation();return;}
    if (['ArrowRight','ArrowDown','PageDown',' '].includes(event.key)) { event.preventDefault(); step(1); }
    else if (['ArrowLeft','ArrowUp','PageUp'].includes(event.key)) { event.preventDefault(); step(-1); }
    event.stopPropagation();
  });
  let start = null;
  image.addEventListener('touchstart', event => { const t=event.touches[0];start={x:t.clientX,y:t.clientY}; },{passive:true});
  image.addEventListener('touchend', event => {
    if(!start)return; const t=event.changedTouches[0],dx=t.clientX-start.x,dy=t.clientY-start.y;start=null;
    if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy))step(dx<0?1:-1);
  },{passive:true});
  image.addEventListener('touchcancel',()=>{start=null;},{passive:true});
})();
