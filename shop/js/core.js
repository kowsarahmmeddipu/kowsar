/* Shared helpers and state: DOM helpers, filters state, wishlist storage, price format */
function $(id) { return document.getElementById(id); }
function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
/* Catalogue managed in the admin panel (/admin). Stored in this browser only; without it the sample products above are used. */
(function () {
  var SHAPES = { shirt: '0 0 220 260', coat: '0 0 220 340', dress: '0 0 200 320', trouser: '0 0 160 300', bag: '0 0 220 220', cap: '0 0 240 140', shoe: '0 0 260 140' };
  function clean(s, n) { return String(s == null ? '' : s).replace(/[<>"&`]/g, '').replace(/'/g, '’').trim().slice(0, n || 120); }
  try {
    var a = JSON.parse(localStorage.getItem('kowsar-admin-products'));
    if (!Array.isArray(a)) return;
    var seen = {}, list = [];
    a.forEach(function (o) {
      if (!o || o.hidden || typeof o.id !== 'string' || !/^[a-z0-9-]{1,60}$/.test(o.id) || seen[o.id]) return;
      var price = Math.round(+o.price);
      var colors = Array.isArray(o.colors) ? o.colors.filter(function (c) { return COLORS[c]; }) : [];
      var sizes = Array.isArray(o.sizes) ? o.sizes.filter(function (z) { return SIZE_ORDER.indexOf(z) > -1; }) : [];
      if (!clean(o.name) || !(price > 0) || !CAT_LABEL[o.cat] || !SHAPES[o.sym] || !colors.length || !sizes.length) return;
      seen[o.id] = 1;
      list.push({ id: o.id, name: clean(o.name, 60), cat: o.cat, type: clean(o.type, 30) || CAT_LABEL[o.cat], price: price, sym: o.sym, vb: SHAPES[o.sym], colors: colors, sizes: sizes, tag: clean(o.tag, 14), kw: clean(o.kw, 120) });
      DETAILS[o.id] = {
        desc: clean(o.desc, 400) || 'A KOWSAR everyday piece.',
        fabric: clean(o.fabric, 40) || 'Mixed fabric',
        points: (Array.isArray(o.points) ? o.points : []).map(function (x) { return clean(x, 80); }).filter(Boolean).slice(0, 5)
      };
      if (!DETAILS[o.id].points.length) DETAILS[o.id].points = ['Everyday fit'];
    });
    if (!list.length) return;
    P = list;
    var top = Math.max.apply(null, list.map(function (p) { return p.price; }));
    MAXP = Math.max(6000, Math.ceil(top / 500) * 500);
    var r = document.getElementById('price'); if (r) { r.max = MAXP; r.value = MAXP; }
  } catch (e) {}
})();
var S = { cat: 'all', sizes: [], colors: [], max: MAXP, sort: 'featured', saved: false, q: '' };
var picked = {};
var wish = [];
try { var raw = JSON.parse(localStorage.getItem('kowsar-wish') || '[]'); if (Array.isArray(raw)) wish = raw; } catch (e) {}
function persist() { try { localStorage.setItem('kowsar-wish', JSON.stringify(wish)); } catch (e) {} }
function tk(n) { return '৳' + n.toLocaleString('en-US'); }
function byId(id) { return P.filter(function (p) { return p.id === id; })[0]; }
function scrollToShop() { if ($('home-view').hidden) { location.hash = '#products'; return; } $('products').scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' }); }
