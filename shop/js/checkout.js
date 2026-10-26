/* Checkout (demo: nothing is sent or charged) */
/* ---- checkout (demo: nothing is sent or charged) ---- */
var SHIP = { dhaka: ['Inside Dhaka', 80], outside: ['Outside Dhaka', 130] };
var FREE_OVER = 5000;
var MERCHANT = { bkash: '01XXX-XXXXXX', nagad: '01XXX-XXXXXX' };
var PAY = [
  { id: 'cod', label: 'Cash on delivery', note: 'Pay in cash when your order arrives.' },
  { id: 'bkash', label: 'bKash', note: 'Send money, then enter the transaction ID.' },
  { id: 'nagad', label: 'Nagad', note: 'Send money, then enter the transaction ID.' },
  { id: 'card', label: 'Card', note: 'Visa, Mastercard and more on a secure payment page.', disabled: true, badge: 'Needs gateway' }
];
var coView = $('checkout-view'), coBox = $('co'), view = 'home';
var coState = { area: 'dhaka', pay: 'cod' };
function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function subtotal() { return bag.reduce(function (n, i) { return n + byId(i.id).price * i.qty; }, 0); }
function shipFee() { return subtotal() >= FREE_OVER ? 0 : SHIP[coState.area][1]; }
function crumbsHTML() { return '<nav class="crumbs" aria-label="Breadcrumb"><a href="#top">Home</a><span aria-hidden="true">/</span><span aria-current="page">Checkout</span></nav>'; }
function sumHTML() {
  var sub = subtotal(), fee = shipFee();
  var items = bag.map(function (it) {
    var p = byId(it.id);
    return '<div class="sum-item"><div class="bag-thumb"><svg viewBox="' + p.vb + '" style="color:' + COLORS[it.color][1] + '" aria-hidden="true"><use href="#' + p.sym + '"/></svg></div>' +
      '<div><strong>' + p.name + '</strong><div class="bag-meta" style="margin:0">' + COLORS[it.color][0] + ' · ' + it.size + ' · Qty ' + it.qty + '</div></div><span>' + tk(p.price * it.qty) + '</span></div>';
  }).join('');
  var hint = sub < FREE_OVER ? '<p class="bag-note" style="margin:0">Add ' + tk(FREE_OVER - sub) + ' more for free delivery.</p>' : '';
  return '<h2>Order summary</h2>' + items +
    '<div class="sum-line"><span>Subtotal</span><span>' + tk(sub) + '</span></div>' +
    '<div class="sum-line"><span>Delivery · ' + SHIP[coState.area][0] + '</span><span>' + (fee ? tk(fee) : 'Free') + '</span></div>' + hint +
    '<div class="sum-line total"><span>Total</span><span>' + tk(sub + fee) + '</span></div>' +
    '<button class="btn btn-primary btn-lg" type="submit" form="co-form" style="width:100%;flex:none">Place order</button>' +
    '<p class="bag-note" style="margin:0;text-align:center">Demo only. Nothing is sent or charged.</p>';
}
function renderSum() {
  var s = $('co-sum'); if (s) s.innerHTML = sumHTML();
  var a = $('pay-amt'); if (a) a.textContent = tk(subtotal() + shipFee());
}
function field(id, label, type, ac, ph) {
  return '<div class="field"><label for="' + id + '">' + label + '</label><input id="' + id + '" type="' + type + '" autocomplete="' + ac + '"' + (ph ? ' placeholder="' + ph + '"' : '') + ' aria-describedby="err-' + id + '"><p class="err" id="err-' + id + '"></p></div>';
}
function payOpt(o) {
  return '<label class="pay-opt"><input type="radio" name="pay" value="' + o.id + '"' + (o.id === coState.pay ? ' checked' : '') + (o.disabled ? ' disabled' : '') + '>' +
    '<span><strong>' + o.label + '</strong><span class="note">' + o.note + '</span></span>' + (o.badge ? '<span class="pay-badge">' + o.badge + '</span>' : '') + '</label>';
}
function formHTML() {
  return '<form class="co-form" id="co-form" novalidate>' +
    '<fieldset><legend>Contact</legend><div class="row2">' + field('co-name', 'Full name', 'text', 'name') + field('co-phone', 'Mobile number', 'tel', 'tel', '01XXXXXXXXX') + '</div>' + field('co-email', 'Email (optional)', 'email', 'email') + '<label class="check"><input type="checkbox" id="co-save" checked> Save these details on this device for next time</label></fieldset>' +
    '<fieldset><legend>Delivery</legend>' +
      '<div class="field"><label for="co-area">Delivery area</label><select id="co-area">' + Object.keys(SHIP).map(function (k) { return '<option value="' + k + '"' + (k === coState.area ? ' selected' : '') + '>' + SHIP[k][0] + ' · ' + tk(SHIP[k][1]) + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><label for="co-address">Full address</label><textarea id="co-address" autocomplete="street-address" aria-describedby="err-co-address"></textarea><p class="err" id="err-co-address"></p></div>' +
    '</fieldset>' +
    '<fieldset><legend>Payment</legend><div class="pay-list">' + PAY.map(payOpt).join('') + '</div>' +
      '<div class="pay-extra" id="pay-manual" hidden><p id="pay-manual-text"></p>' + field('co-trx', 'Transaction ID', 'text', 'off') + field('co-sender', 'Number you paid from', 'tel', 'tel', '01XXXXXXXXX') + '</div>' +
    '</fieldset></form>';
}
function syncPay() {
  var manual = coState.pay === 'bkash' || coState.pay === 'nagad';
  $('pay-manual').hidden = !manual;
  if (manual) {
    var o = PAY.filter(function (x) { return x.id === coState.pay; })[0];
    $('pay-manual-text').innerHTML = 'Send <strong id="pay-amt"></strong> to the ' + o.label + ' number <strong>' + MERCHANT[coState.pay] + '</strong>, then enter the transaction ID from your confirmation message.';
    renderSum();
  } else { setErr('co-trx', ''); setErr('co-sender', ''); }
}
function renderCheckout() {
  if (!bag.length) {
    coBox.innerHTML = crumbsHTML() + '<div class="empty"><span>Your bag is empty.</span><a class="btn btn-primary" href="#products" data-cat="all">Continue shopping</a></div>';
    return;
  }
  coBox.innerHTML = crumbsHTML() + '<h1 class="co-title">Checkout</h1>' +
    '<div class="demo-banner" role="note"><strong>Demo checkout.</strong> Orders are not sent and nothing is charged until a payment provider is connected.</div>' +
    '<div class="co">' + formHTML() + '<aside class="co-sum" id="co-sum" aria-label="Order summary"></aside></div>';
  prefillCo(); renderSum(); syncPay();
}
function showCheckout() {
  home.hidden = true; pdpView.hidden = true; acctView.hidden = true; coView.hidden = false;
  renderCheckout(); window.scrollTo(0, 0);
}
function setErr(id, msg) {
  var i = $(id), e = $('err-' + id);
  if (!i || !e) return;
  e.textContent = msg || ''; i.setAttribute('aria-invalid', msg ? 'true' : 'false');
}
var PHONE = /^(\+?88)?01[3-9]\d{8}$/;
function validateCo() {
  var bad = [];
  function chk(id, ok, msg) { setErr(id, ok ? '' : msg); if (!ok) bad.push(id); }
  var email = $('co-email').value.trim();
  chk('co-name', $('co-name').value.trim().length >= 2, 'Enter your full name.');
  chk('co-phone', PHONE.test($('co-phone').value.replace(/[\s-]/g, '')), 'Enter a valid mobile number, like 01712345678.');
  chk('co-email', !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), 'Enter a valid email address or leave it empty.');
  chk('co-address', $('co-address').value.trim().length >= 8, 'Enter your full delivery address.');
  if (coState.pay === 'bkash' || coState.pay === 'nagad') {
    chk('co-trx', /^[A-Za-z0-9]{6,20}$/.test($('co-trx').value.trim()), 'Enter the transaction ID from your payment message.');
    chk('co-sender', PHONE.test($('co-sender').value.replace(/[\s-]/g, '')), 'Enter the number you paid from.');
  }
  return bad;
}
function placeOrder() {
  var sub = subtotal(), fee = shipFee();
  var ref = 'KWS-' + (100000 + Math.floor(Math.random() * 900000));
  var pay = PAY.filter(function (x) { return x.id === coState.pay; })[0].label;
  var name = $('co-name').value.trim();
  var phoneV = $('co-phone').value.trim(), emailV = $('co-email').value.trim(), addrV = $('co-address').value.trim();
  orders.unshift({ ref: ref, date: Date.now(), items: bag.map(function (i) { return { id: i.id, color: i.color, size: i.size, qty: i.qty }; }), total: sub + fee, pay: pay, area: coState.area });
  orders = orders.slice(0, 20); lsSet('kowsar-orders', orders);
  /* copy for the admin panel (/admin): keeps customer details and has no 20-order limit; same browser only */
  try {
    var adminOrders = JSON.parse(localStorage.getItem('kowsar-admin-orders') || '[]'); if (!Array.isArray(adminOrders)) adminOrders = [];
    adminOrders.unshift({ ref: ref, date: Date.now(), items: orders[0].items, sub: sub, fee: fee, total: sub + fee, pay: pay, area: coState.area, status: 'New', cust: { name: name, phone: phoneV, email: emailV, address: addrV } });
    localStorage.setItem('kowsar-admin-orders', JSON.stringify(adminOrders.slice(0, 500)));
  } catch (er) {}
  if ($('co-save').checked) {
    profile = { name: name, phone: phoneV, email: emailV, size: profile.size || '' }; lsSet('kowsar-profile', profile);
    if (!addrs.length) { addrs.push({ label: 'Home', area: coState.area, text: addrV }); lsSet('kowsar-addrs', addrs); }
  }
  var lines = bag.map(function (it) {
    var p = byId(it.id);
    return '<div class="sum-line"><span>' + p.name + ' · ' + COLORS[it.color][0] + ' · ' + it.size + ' × ' + it.qty + '</span><span>' + tk(p.price * it.qty) + '</span></div>';
  }).join('');
  coBox.innerHTML = crumbsHTML() +
    '<div class="co-done"><div class="done-mark">' + CHECK + '</div><h1 class="co-title">Order received</h1>' +
    '<p class="pdp-sub">Thank you, ' + esc(name) + '. Your reference is <strong>' + ref + '</strong>.</p>' +
    '<div class="demo-banner" role="note" style="text-align:left;margin:0"><strong>This was a demo.</strong> Nothing was sent to the shop and nothing was charged.</div>' +
    '<div class="co-sum"><h2>Summary</h2>' + lines +
      '<div class="sum-line"><span>Delivery · ' + SHIP[coState.area][0] + '</span><span>' + (fee ? tk(fee) : 'Free') + '</span></div>' +
      '<div class="sum-line"><span>Payment</span><span>' + pay + '</span></div>' +
      '<div class="sum-line total"><span>Total</span><span>' + tk(sub + fee) + '</span></div></div>' +
    '<a class="btn btn-primary btn-lg" style="flex:none;width:100%" href="#products" data-cat="all">Continue shopping</a></div>';
  bag = []; saveBag(); updateBagUI(); window.scrollTo(0, 0);
}
coBox.addEventListener('change', function (e) {
  if (e.target.name === 'pay') { coState.pay = e.target.value; syncPay(); }
  else if (e.target.id === 'co-area') { coState.area = e.target.value; renderSum(); }
});
coBox.addEventListener('input', function (e) {
  if (e.target.getAttribute && e.target.getAttribute('aria-invalid') === 'true') setErr(e.target.id, '');
});
coBox.addEventListener('submit', function (e) {
  e.preventDefault();
  if (e.target.id !== 'co-form') return;
  var bad = validateCo();
  if (bad.length) { $(bad[0]).focus(); return; }
  placeOrder();
});
