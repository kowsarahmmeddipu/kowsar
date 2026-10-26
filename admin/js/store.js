/* Storage and shared helpers. Everything is saved in this browser only (localStorage). */
var K = { prod: 'kowsar-admin-products', ord: 'kowsar-admin-orders', pin: 'kowsar-admin-pin', session: 'kowsar-admin-session' };
var STATUSES = ['New', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
var SHAPES = { shirt: ['Shirt or top', '0 0 220 260'], coat: ['Coat or jacket', '0 0 220 340'], dress: ['Dress', '0 0 200 320'], trouser: ['Trousers', '0 0 160 300'], bag: ['Bag', '0 0 220 220'], cap: ['Cap', '0 0 240 140'], shoe: ['Shoes', '0 0 260 140'] };

function $(id) { return document.getElementById(id); }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function clean(s, n) { return String(s == null ? '' : s).replace(/[<>"&`]/g, '').replace(/'/g, '’').trim().slice(0, n || 120); }
function money(n) { return '৳' + Math.round(+n || 0).toLocaleString('en-US'); }
function fmtDate(t) { try { return new Date(t).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } }
function lsGet(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50) || 'item'; }

/* products */
function cleanProduct(o) {
  if (!o || typeof o !== 'object') return null;
  var price = Math.round(+o.price);
  var id = typeof o.id === 'string' && /^[a-z0-9-]{1,60}$/.test(o.id) ? o.id : '';
  var colors = Array.isArray(o.colors) ? o.colors.filter(function (c) { return COLORS[c]; }) : [];
  var sizes = Array.isArray(o.sizes) ? SIZE_ORDER.filter(function (z) { return o.sizes.indexOf(z) > -1; }) : [];
  if (!id || !clean(o.name) || !(price > 0) || !CAT_LABEL[o.cat] || !SHAPES[o.sym] || !colors.length || !sizes.length) return null;
  return { id: id, name: clean(o.name, 60), cat: o.cat, type: clean(o.type, 30), price: price, sym: o.sym, vb: SHAPES[o.sym][1], colors: colors, sizes: sizes, tag: clean(o.tag, 14), kw: clean(o.kw, 120), desc: clean(o.desc, 400), fabric: clean(o.fabric, 40), points: (Array.isArray(o.points) ? o.points : []).map(function (x) { return clean(x, 80); }).filter(Boolean).slice(0, 5), hidden: !!o.hidden };
}
function sampleProducts() {
  return P.map(function (p) {
    var d = DETAILS[p.id] || {};
    return { id: p.id, name: p.name, cat: p.cat, type: p.type, price: p.price, sym: p.sym, vb: p.vb, colors: p.colors.slice(), sizes: p.sizes.slice(), tag: p.tag || '', kw: p.kw || '', desc: d.desc || '', fabric: d.fabric || '', points: (d.points || []).slice(), hidden: false };
  });
}
function usingSamples() { return !Array.isArray(lsGet(K.prod, null)); }
function loadProducts() {
  var a = lsGet(K.prod, null);
  if (!Array.isArray(a)) return sampleProducts();
  return a.map(cleanProduct).filter(Boolean);
}
function saveProducts(a) { return lsSet(K.prod, a); }
function productName(id) { var l = loadProducts().filter(function (p) { return p.id === id; })[0]; return l ? l.name : id; }

/* orders: the shop writes a copy of every order here, with customer details */
function loadOrders() {
  var a = lsGet(K.ord, []); if (!Array.isArray(a)) a = [];
  var seen = {}; a.forEach(function (o) { if (o && o.ref) seen[o.ref] = 1; });
  var legacy = lsGet('kowsar-orders', []), added = false;
  if (Array.isArray(legacy)) legacy.forEach(function (o) {
    if (o && typeof o.ref === 'string' && Array.isArray(o.items) && !seen[o.ref]) { a.push({ ref: o.ref, date: o.date, items: o.items, sub: o.total, fee: 0, total: o.total, pay: o.pay, area: o.area, status: 'New', cust: {} }); added = true; }
  });
  a = a.filter(function (o) { return o && typeof o.ref === 'string' && Array.isArray(o.items); });
  a.sort(function (x, y) { return (y.date || 0) - (x.date || 0); });
  if (added) lsSet(K.ord, a);
  return a;
}
function saveOrders(a) { return lsSet(K.ord, a); }

function download(name, text, type) {
  var b = new Blob([text], { type: type || 'text/plain' }), u = URL.createObjectURL(b), a = document.createElement('a');
  a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 500);
}

/* toast and dialogs */
var toastTimer = null;
function toast(msg) { var t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2600); }
var lastFocus = null;
function openDialog(html) {
  lastFocus = document.activeElement;
  var box = $('dialog'); box.innerHTML = html; $('scrim').hidden = false; document.body.style.overflow = 'hidden';
  var f = box.querySelector('input:not([type=hidden]),select,textarea,button'); if (f) f.focus();
  return box;
}
function closeDialog() { $('scrim').hidden = true; $('dialog').innerHTML = ''; document.body.style.overflow = ''; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
function confirmDialog(title, msg, okLabel, fn) {
  var box = openDialog('<h2>' + esc(title) + '</h2><p class="muted">' + esc(msg) + '</p><div class="foot"><button class="btn ghost" type="button" data-close>Cancel</button><button class="btn danger" type="button" id="ok-go">' + esc(okLabel) + '</button></div>');
  $('ok-go').addEventListener('click', function () { closeDialog(); fn(); });
}
document.addEventListener('click', function (e) { if (e.target.closest('[data-close]') || e.target === $('scrim')) closeDialog(); });
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !$('scrim').hidden) { closeDialog(); return; }
  if (e.key === 'Tab' && !$('scrim').hidden) {
    var f = $('dialog').querySelectorAll('button,input,select,textarea,a[href]'); if (!f.length) return;
    var a = f[0], z = f[f.length - 1];
    if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
  }
});
