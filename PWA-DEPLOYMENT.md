# LUUX installed web app releases

Publish the following together in every production deployment:

1. Set a new unique `version` in `luux-release.json`.
2. Set the same `meta[name="luux-build"]` value in all six HTML pages.
3. Bump local JavaScript and stylesheet query versions in those pages to that release.
4. Include all changed assets in the same commit. Verify GitHub Pages deployment and live bytes.

`luux-app-update.js` reads the published release manifest with `cache: no-store` and a unique query at initial page load, foreground return, BFCache restore and network reconnection. A new release reloads the current page with a fresh cache key. Matching releases do not reload. Offline/network errors retain the current page; a session guard prevents repeated refresh loops.

The existing app must load this updater once before it can receive future automatic checks. Existing older documents can remain in the normal GitHub Pages browser cache for up to 10 minutes. No service worker or offline document store is installed.
