/* Image-only gestures: pinch to zoom, pan while zoomed, swipe at fit size. */
(() => {
  function attach(root, image, previous, next) {
    if (!root || !image) return;
    let scale = 1, x = 0, y = 0, gesture = null, last = null, swipable = false;
    image.style.touchAction = 'none';
    image.style.transformOrigin = '50% 50%';
    image.draggable = false;
    function paint() {
      const w = image.clientWidth, h = image.clientHeight;
      const ratio = Math.min(w / (image.naturalWidth || w), h / (image.naturalHeight || h));
      const maxX = Math.max(0, ((image.naturalWidth || w) * ratio * scale - w) / 2);
      const maxY = Math.max(0, ((image.naturalHeight || h) * ratio * scale - h) / 2);
      x = Math.max(-maxX, Math.min(maxX, x));
      y = Math.max(-maxY, Math.min(maxY, y));
      image.style.transform = `translate(${x}px,${y}px) scale(${scale})`;
    }
    function reset() { scale = 1; x = y = 0; gesture = last = null; swipable = false; paint(); }
    function center(touches) {
      const r = root.getBoundingClientRect();
      return {x: (touches[0].clientX + touches[1].clientX) / 2 - r.left - r.width / 2,
              y: (touches[0].clientY + touches[1].clientY) / 2 - r.top - r.height / 2};
    }
    function distance(t) { return Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY); }
    function begin(t) {
      if (t.length >= 2) {
        gesture = {distance: Math.max(1, distance(t)), scale, x, y, center: center(t)};
        swipable = false;
      } else { gesture = null; last = {x:t[0].clientX, y:t[0].clientY}; }
    }
    let start = null, active = false;
    const options = {capture:true, passive:false};
    root.addEventListener('touchstart', e => {
      if (!active && e.target !== image) return;
      active = true; e.preventDefault(); e.stopImmediatePropagation();
      if (!start) { start = {x:e.touches[0].clientX,y:e.touches[0].clientY}; swipable = scale === 1 && e.touches.length === 1; }
      begin(e.touches);
    }, options);
    root.addEventListener('touchmove', e => {
      if (!active) return;
      e.preventDefault(); e.stopImmediatePropagation();
      if (e.touches.length >= 2) {
        if (!gesture) begin(e.touches);
        const c = center(e.touches);
        scale = Math.max(1, Math.min(5, gesture.scale * distance(e.touches) / gesture.distance));
        const ratio = scale / gesture.scale;
        x = c.x - (gesture.center.x - gesture.x) * ratio;
        y = c.y - (gesture.center.y - gesture.y) * ratio;
      } else if (last && scale > 1) {
        x += e.touches[0].clientX - last.x; y += e.touches[0].clientY - last.y;
        last = {x:e.touches[0].clientX,y:e.touches[0].clientY};
      }
      paint();
    }, options);
    root.addEventListener('touchend', e => {
      if (!active) return;
      e.preventDefault(); e.stopImmediatePropagation();
      if (e.touches.length) { begin(e.touches); return; }
      const t = e.changedTouches[0];
      const dx = t.clientX - start.x, dy = t.clientY - start.y;
      const swipe = swipable && Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy);
      active = false; start = last = gesture = null; swipable = false;
      if (swipe) (dx < 0 ? next : previous)?.click();
    }, options);
    root.addEventListener('touchcancel', e => {
      if (!active) return;
      e.stopImmediatePropagation(); active = false; start = null; reset();
    }, options);
    image.addEventListener('click', e => { if (scale > 1) { e.preventDefault(); e.stopImmediatePropagation(); } }, true);
    image.addEventListener('load', reset);
    new MutationObserver(() => { active = false; start = null; reset(); }).observe(image, {attributes:true, attributeFilter:['src','hidden']});
    new MutationObserver(() => { active = false; start = null; reset(); }).observe(root, {attributes:true, attributeFilter:['open','class']});
    window.addEventListener('resize', reset);
    window.addEventListener('orientationchange', reset);
  }
  attach(document.getElementById('show'), document.getElementById('showImg'), document.getElementById('showPrev'), document.getElementById('showNext'));
  const full = document.getElementById('luuxFullscreen');
  attach(full, full?.querySelector('img'), full?.querySelector('.fs-prev'), full?.querySelector('.fs-next'));
})();
