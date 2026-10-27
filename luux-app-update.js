/* On every deployment, update luux-release.json and the matching page build tags/asset versions together. */
(() => {
  const build = document.querySelector('meta[name="luux-build"]')?.content;
  if (!build) return;
  const base = new URL('./', location.href);
  const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  // Keep navigation inside the installed app and use this release's HTML cache keys.
  document.querySelectorAll('a[href]').forEach(a => {
    const url = new URL(a.href);
    if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) return;
    if (url.pathname.endsWith('.html') || url.pathname === base.pathname) {
      if (url.pathname !== location.pathname || !url.hash) {
        url.searchParams.set('v', build); a.href = url.href;
      }
      if (standalone) a.removeAttribute('target');
    }
  });
  let busy = false, lastCheck = 0;
  async function check() {
    if (busy || document.visibilityState === 'hidden' || !navigator.onLine || Date.now() - lastCheck < 15000) return;
    busy = true; lastCheck = Date.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    try {
      const url = new URL('luux-release.json', base);
      url.searchParams.set('check', String(Date.now()));
      const response = await fetch(url, {cache:'no-store', signal:controller.signal});
      if (!response.ok) return;
      const {version} = await response.json();
      if (typeof version !== 'string' || !/^[a-zA-Z0-9._-]{1,64}$/.test(version) || version === build) return;
      // Avoid a reload loop if a CDN briefly serves HTML from the prior release.
      const key = 'luux-update:' + location.pathname + ':' + version;
      try {
        const prior = Number(sessionStorage.getItem(key) || 0);
        if (Date.now() - prior < 60000) return;
        sessionStorage.setItem(key, String(Date.now()));
      } catch (_) {}
      const next = new URL(location.href);
      next.searchParams.set('v', version);
      next.searchParams.set('_refresh', String(Date.now()));
      location.replace(next.href);
    } catch (_) {
      // Keep the current page usable on network failure.
    } finally { clearTimeout(timer); busy = false; }
  }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') check(); });
  window.addEventListener('pageshow', check);
  window.addEventListener('online', () => { lastCheck = 0; check(); });
  check();
})();
