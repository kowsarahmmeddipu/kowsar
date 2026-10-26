/* Start-up, navigation and event wiring */
var ROUTES = { dashboard: ['Dashboard', dashboard], products: ['Products', products], orders: ['Orders', orders], settings: ['Settings', settings] };
function route() {
  if (!isOpen()) return;
  var h = (location.hash || '#dashboard').slice(1); if (!ROUTES[h]) h = 'dashboard';
  Array.prototype.forEach.call(document.querySelectorAll('[data-nav]'), function (a) { if (a.dataset.nav === h) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  document.title = ROUTES[h][0] + ' | KOWSAR Admin';
  ROUTES[h][1](); window.scrollTo(0, 0);
}
function enter() { $('lock').hidden = true; $('app').hidden = false; if (!location.hash) location.hash = '#dashboard'; route(); }
window.addEventListener('hashchange', route);
document.addEventListener('click', function (e) {
  var b = e.target.closest('[data-act]'); if (!b) return;
  var act = b.dataset.act, id = b.dataset.id, ref = b.dataset.ref;
  if (act === 'lock') { e.preventDefault(); lockNow(); }
  else if (['add', 'edit', 'toggle', 'del', 'export', 'import'].indexOf(act) > -1) productAction(act, id);
  else if (['csv', 'view', 'delorder'].indexOf(act) > -1) orderAction(act, ref);
  else if (['backup', 'restore', 'reset-products', 'reset-orders'].indexOf(act) > -1) settingsAction(act);
});
document.addEventListener('change', function (e) { if (e.target.classList && e.target.classList.contains('st')) setStatus(e.target.dataset.ref, e.target.value); });
if (isOpen()) enter(); else showLock();
