/* Account: guest profile, addresses, orders (stored on this device) */
/* ---- account (guest profile stored on this device) ---- */
function lsGet(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
var profile = lsGet('kowsar-profile', {});
if (!profile || typeof profile !== 'object' || Array.isArray(profile)) profile = {};
var addrs = lsGet('kowsar-addrs', []);
if (!Array.isArray(addrs)) addrs = [];
addrs = addrs.filter(function (a) { return a && typeof a.text === 'string' && typeof a.label === 'string' && SHIP[a.area]; }).slice(0, 3);
var orders = lsGet('kowsar-orders', []);
if (!Array.isArray(orders)) orders = [];
orders = orders.filter(function (o) { return o && typeof o.ref === 'string' && Array.isArray(o.items); }).slice(0, 20);
var acctView = $('account-view'), acct = $('acct'), acctTab = 'profile';
var ACCT_TABS = ['profile', 'addresses', 'orders', 'saved'];
var ACCT_LABEL = { profile: 'Profile', addresses: 'Addresses', orders: 'Orders', saved: 'Saved' };
var USER_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c.8-4 4-6 7.5-6s6.7 2 7.5 6"/></svg>';
function initials(n) { var w = n.trim().split(/\s+/).filter(Boolean); return w.length ? (w[0].charAt(0) + (w.length > 1 ? w[w.length - 1].charAt(0) : '')).toUpperCase() : ''; }
function prefillCo() {
  if (profile.name) $('co-name').value = profile.name;
  if (profile.phone) $('co-phone').value = profile.phone;
  if (profile.email) $('co-email').value = profile.email;
  if (addrs[0]) { $('co-address').value = addrs[0].text; coState.area = addrs[0].area; $('co-area').value = addrs[0].area; }
}
function acctShell(inner) {
  var ini = initials(profile.name || '');
  var nav = ACCT_TABS.map(function (t) {
    var n = t === 'orders' ? orders.length : (t === 'saved' ? wish.length : 0);
    return '<a href="#account' + (t === 'profile' ? '' : '-' + t) + '"' + (t === acctTab ? ' aria-current="page"' : '') + '><span>' + ACCT_LABEL[t] + '</span>' + (n ? '<span class="count-chip">' + n + '</span>' : '') + '</a>';
  }).join('');
  return '<nav class="crumbs" aria-label="Breadcrumb"><a href="#top">Home</a><span aria-hidden="true">/</span><span aria-current="page">My account</span></nav>' +
    '<div class="acct-head"><div class="avatar" aria-hidden="true">' + (ini ? esc(ini) : USER_SVG) + '</div><div><h1 class="co-title" style="margin:0">' + (profile.name ? esc(profile.name) : 'My account') + '</h1><p class="pdp-sub" style="margin:2px 0 0">Guest profile, saved on this device</p></div></div>' +
    '<div class="acct"><nav class="acct-nav" aria-label="Account sections">' + nav + '</nav><section class="acct-panel" aria-label="' + ACCT_LABEL[acctTab] + '">' + inner + '</section></div>';
}
function sizeOpts() {
  return '<option value="">No preference</option>' + ['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(function (s) { return '<option value="' + s + '"' + (profile.size === s ? ' selected' : '') + '>' + s + '</option>'; }).join('');
}
function profilePanel() {
  return '<div class="card-box"><h2>Your details</h2><form id="acct-form" class="co-form" style="gap:14px" novalidate>' +
    '<div class="row2">' + field('ac-name', 'Full name', 'text', 'name') + field('ac-phone', 'Mobile number', 'tel', 'tel', '01XXXXXXXXX') + '</div>' +
    field('ac-email', 'Email', 'email', 'email') +
    '<div class="field"><label for="ac-size">Default clothing size</label><select id="ac-size">' + sizeOpts() + '</select></div>' +
    '<div class="form-actions"><button class="btn btn-primary" type="submit">Save changes</button><p class="ok-msg" id="acct-msg" role="status"></p></div></form></div>' +
    '<div class="card-box"><h2>Sign in</h2><p class="muted-p">Passwords and order history that follow you across devices need a store backend. Until one is connected, your details stay in this browser only.</p></div>' +
    '<div class="card-box"><h2>Your data</h2><p class="muted-p">Your profile, addresses, orders, saved items and bag are stored only in this browser. Switching device or clearing site data removes them.</p><div class="form-actions" id="clear-box"><button class="pill danger-btn" type="button" id="clear-ask">Clear my data on this device</button></div></div>';
}
function addrPanel() {
  var list = addrs.length ? addrs.map(function (a, i) {
    return '<div class="card-box addr"><div><strong>' + esc(a.label) + '</strong>' + (i === 0 ? ' <span class="pay-badge">Default</span>' : '') +
      '<p class="muted-p" style="margin:6px 0 0;white-space:pre-line">' + esc(a.text) + '</p><p class="muted-p" style="margin:2px 0 0">' + SHIP[a.area][0] + '</p></div>' +
      '<div class="form-actions">' + (i ? '<button class="pill" type="button" data-act="default" data-i="' + i + '">Make default</button>' : '') + '<button class="pill" type="button" data-act="remove" data-i="' + i + '">Remove</button></div></div>';
  }).join('') : '<div class="empty"><span>No saved addresses yet.</span></div>';
  var form = addrs.length >= 3 ? '<p class="muted-p">You can save up to 3 addresses. Remove one to add another.</p>' :
    '<div class="card-box"><h2>Add an address</h2><form id="addr-form" class="co-form" style="gap:14px" novalidate>' + field('ad-label', 'Label', 'text', 'off', 'Home, Work') +
    '<div class="field"><label for="ad-area">Delivery area</label><select id="ad-area">' + Object.keys(SHIP).map(function (k) { return '<option value="' + k + '">' + SHIP[k][0] + '</option>'; }).join('') + '</select></div>' +
    '<div class="field"><label for="ad-text">Full address</label><textarea id="ad-text" aria-describedby="err-ad-text"></textarea><p class="err" id="err-ad-text"></p></div>' +
    '<div class="form-actions"><button class="btn btn-primary" type="submit">Save address</button></div></form></div>';
  return '<h2>Addresses</h2>' + list + form;
}
function ordersPanel() {
  if (!orders.length) return '<h2>Orders</h2><div class="empty"><span>No orders yet. Orders placed on this device will show up here.</span><a class="btn btn-primary" href="#products" data-cat="all">Start shopping</a></div>';
  return '<h2>Orders</h2>' + orders.map(function (o, i) {
    var d = new Date(o.date);
    var when = isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ' · ';
    var lines = o.items.filter(function (it) { return byId(it.id) && COLORS[it.color]; }).map(function (it) {
      var p = byId(it.id);
      return '<div class="sum-line"><span>' + p.name + ' · ' + COLORS[it.color][0] + ' · ' + esc(it.size) + ' × ' + (+it.qty || 1) + '</span><span>' + tk(p.price * (+it.qty || 1)) + '</span></div>';
    }).join('');
    return '<div class="card-box"><div class="order-top"><div><strong>' + esc(o.ref) + '</strong><div class="bag-meta" style="margin:0">' + when + esc(o.pay || '') + '</div></div><span class="pay-badge">Demo order</span></div>' + lines +
      '<div class="sum-line total"><span>Total</span><span>' + tk(+o.total || 0) + '</span></div><div class="form-actions"><button class="pill" type="button" data-act="again" data-i="' + i + '">Buy again</button></div></div>';
  }).join('');
}
function savedPanel() {
  var list = P.filter(function (p) { return wish.indexOf(p.id) > -1; });
  if (!list.length) return '<h2>Saved items</h2><div class="empty"><span>You have not saved any pieces yet. Tap the heart on a piece to save it.</span><a class="btn btn-primary" href="#products" data-cat="all">Browse pieces</a></div>';
  return '<h2>Saved items</h2><div class="cards" id="acct-saved">' + list.map(cardHTML).join('') + '</div>';
}
function renderAccount() {
  var inner = acctTab === 'addresses' ? addrPanel() : acctTab === 'orders' ? ordersPanel() : acctTab === 'saved' ? savedPanel() : profilePanel();
  acct.innerHTML = acctShell(inner);
  if (acctTab === 'profile') {
    $('ac-name').value = profile.name || ''; $('ac-phone').value = profile.phone || ''; $('ac-email').value = profile.email || '';
  }
}
function showAccount() {
  home.hidden = true; pdpView.hidden = true; coView.hidden = true; acctView.hidden = false;
  renderAccount(); window.scrollTo(0, 0);
}
acct.addEventListener('submit', function (e) {
  e.preventDefault();
  if (e.target.id === 'acct-form') {
    var name = $('ac-name').value.trim(), phone = $('ac-phone').value.trim(), email = $('ac-email').value.trim();
    var bad = [];
    var chk = function (id, ok, msg) { setErr(id, ok ? '' : msg); if (!ok) bad.push(id); };
    chk('ac-name', name.length >= 2, 'Enter your full name.');
    chk('ac-phone', !phone || PHONE.test(phone.replace(/[\s-]/g, '')), 'Enter a valid mobile number, like 01712345678.');
    chk('ac-email', !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), 'Enter a valid email address.');
    if (bad.length) { $(bad[0]).focus(); return; }
    profile = { name: name, phone: phone, email: email, size: $('ac-size').value };
    lsSet('kowsar-profile', profile);
    renderAccount(); $('acct-msg').textContent = 'Saved on this device.';
  } else if (e.target.id === 'addr-form') {
    var text = $('ad-text').value.trim();
    if (text.length < 8) { setErr('ad-text', 'Enter your full delivery address.'); $('ad-text').focus(); return; }
    addrs.push({ label: ($('ad-label').value.trim() || 'Home').slice(0, 30), area: $('ad-area').value, text: text });
    lsSet('kowsar-addrs', addrs); renderAccount();
  }
});
acct.addEventListener('input', function (e) {
  if (e.target.getAttribute && e.target.getAttribute('aria-invalid') === 'true') setErr(e.target.id, '');
});
acct.addEventListener('click', function (e) {
  if (e.target.closest('#acct-saved')) { cardClick(e); if (e.target.closest('.heart')) renderAccount(); return; }
  var b = e.target.closest('[data-act]');
  if (b) {
    var i = +b.dataset.i, act = b.dataset.act;
    if (act === 'default' && addrs[i]) { addrs.unshift(addrs.splice(i, 1)[0]); lsSet('kowsar-addrs', addrs); renderAccount(); }
    else if (act === 'remove' && addrs[i]) { addrs.splice(i, 1); lsSet('kowsar-addrs', addrs); renderAccount(); }
    else if (act === 'again' && orders[i]) {
      orders[i].items.forEach(function (it) { if (byId(it.id) && COLORS[it.color] && typeof it.size === 'string') addToBag(it.id, it.color, it.size, Math.min(10, +it.qty || 1)); });
      toast('Items added to your bag');
    }
    return;
  }
  if (e.target.closest('#clear-ask')) {
    $('clear-box').innerHTML = '<p class="muted-p" style="flex-basis:100%">This removes your profile, addresses, orders, saved items and bag from this browser.</p><button class="pill danger-btn" type="button" id="clear-yes">Yes, clear everything</button><button class="pill" type="button" id="clear-no">Cancel</button>';
    $('clear-yes').focus(); return;
  }
  if (e.target.closest('#clear-no')) { renderAccount(); return; }
  if (e.target.closest('#clear-yes')) {
    ['kowsar-profile', 'kowsar-addrs', 'kowsar-orders', 'kowsar-wish', 'kowsar-bag'].forEach(function (k) { try { localStorage.removeItem(k); } catch (er) {} });
    profile = {}; addrs = []; orders = []; wish = []; bag = []; picked = {};
    updateBagUI(); updateWishUI(); render(); renderAccount(); toast('Your data was cleared from this device');
  }
});
