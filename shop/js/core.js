/* Shared helpers and state: DOM helpers, filters state, wishlist storage, price format */
function $(id) { return document.getElementById(id); }
function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
var S = { cat: 'all', sizes: [], colors: [], max: MAXP, sort: 'featured', saved: false, q: '' };
var picked = {};
var wish = [];
try { var raw = JSON.parse(localStorage.getItem('kowsar-wish') || '[]'); if (Array.isArray(raw)) wish = raw; } catch (e) {}
function persist() { try { localStorage.setItem('kowsar-wish', JSON.stringify(wish)); } catch (e) {} }
function tk(n) { return '৳' + n.toLocaleString('en-US'); }
function byId(id) { return P.filter(function (p) { return p.id === id; })[0]; }
function scrollToShop() { if ($('home-view').hidden) { location.hash = '#products'; return; } $('products').scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' }); }
