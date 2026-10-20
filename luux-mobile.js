// 포트폴리오·리포트 상세: 사진을 옆으로 밀어 넘기기
(() => {
  const viewer = document.querySelector('#detail .viewer');
  if (!viewer) return;
  let x = null, y = null;
  viewer.addEventListener('touchstart', e => { x = e.touches[0].clientX; y = e.touches[0].clientY; }, {passive: true});
  viewer.addEventListener('touchend', e => {
    if (x === null) return;
    const dx = e.changedTouches[0].clientX - x, dy = e.changedTouches[0].clientY - y;
    x = y = null;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    document.querySelector(dx < 0 ? '#next' : '#prev').click();
  });
})();
