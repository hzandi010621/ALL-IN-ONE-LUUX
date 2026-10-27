/* Consistent vector controls, independent of font metrics and iOS button defaults. */
(() => {
  const icons = {
    prev:'M19 12H5m6-6-6 6 6 6',
    next:'M5 12h14m-6-6 6 6-6 6',
    up:'M12 19V5m-6 6 6-6 6 6',
    close:'m6 6 12 12M18 6 6 18'
  };
  const groups = [
    ['#showPrev,#luuxFullscreen .fs-prev,.viewer #prev','prev'],
    ['#showNext,#luuxFullscreen .fs-next,.viewer #next','next'],
    ['#showClose,#luuxFullscreen .fs-close,#detail .detail-head button[aria-label*="닫기"]','close'],
    ['footer a[aria-label="맨 위로"]','up']
  ];
  for (const [selector, name] of groups) document.querySelectorAll(selector).forEach(button => {
    button.classList.add('luux-vector-control');
    if (button.closest('#show,#luuxFullscreen')) button.classList.add('luux-control-dark');
    button.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${icons[name]}"/></svg>`;
  });
  const style = document.createElement('style');
  style.textContent = `
html body .luux-vector-control{
 appearance:none!important;-webkit-appearance:none!important;
 display:grid!important;place-items:center!important;
 width:44px!important;height:44px!important;min-width:44px!important;min-height:44px!important;
 max-width:44px!important;max-height:44px!important;aspect-ratio:1!important;
 padding:0!important;margin:0!important;box-sizing:border-box!important;flex:none!important;
 border:1px solid rgba(0,0,0,.10)!important;border-radius:50%!important;
 background:rgba(255,255,255,.94)!important;color:#171717!important;
 opacity:1!important;font-size:0!important;line-height:1!important;
 cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent;
 box-shadow:0 2px 8px #0000000a;
}
html body .luux-vector-control svg{display:block;width:20px;height:20px;pointer-events:none;flex:none}
html body .luux-control-dark{background:rgba(20,20,20,.66)!important;color:#fff!important;border-color:rgba(255,255,255,.22)!important;box-shadow:none}
html body #show .show-prev,html body #show .show-next,
html body #luuxFullscreen .fs-prev,html body #luuxFullscreen .fs-next,
html body .viewer #prev,html body .viewer #next{top:50%!important;transform:translateY(-50%)!important}
html body #show .show-prev,html body #luuxFullscreen .fs-prev{left:max(12px,env(safe-area-inset-left))!important}
html body #show .show-next,html body #luuxFullscreen .fs-next{right:max(12px,env(safe-area-inset-right))!important}
html body .luux-vector-control:focus:not(:focus-visible){outline:none!important}
html body .luux-vector-control:focus-visible{outline:2px solid #00b2ac!important;outline-offset:3px!important}
@media(hover:hover){html body .luux-vector-control:hover{background:#eee!important}html body .luux-control-dark:hover{background:#333!important}}
html body .luux-vector-control:active{opacity:.75!important}
`;
  document.head.append(style);
})();
