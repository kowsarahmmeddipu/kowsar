/* Shopping bag */
/* bag */
var bag = [];
try {
  var rawBag = JSON.parse(localStorage.getItem('kowsar-bag') || '[]');
  if (Array.isArray(rawBag)) bag = rawBag.filter(function (i) { return i && byId(i.id) && COLORS[i.color] && typeof i.size === 'string' && i.qty > 0; });
} catch (e) {}
function saveBag() { try { localStorage.setItem('kowsar-bag', JSON.stringify(bag)); } catch (e) {} }
var bagBtn = $('bag-btn'), bagModal = $('bag-modal'), bagFocus = null;
var bagBadge = el('span', 'badge'); bagBadge.id = 'bag-badge'; bagBadge.hidden = true; bagBtn.appendChild(bagBadge);
function bagCount() { return bag.reduce(function (n, i) { return n + i.qty; }, 0); }
function updateBagUI() { var n = bagCount(); bagBadge.textContent = n; bagBadge.hidden = !n; bagBtn.setAttribute('aria-label', n ? 'Open bag, ' + n + (n === 1 ? ' item' : ' items') : 'Open bag'); }
function addToBag(id, color, size, qty) {
  var hit = bag.filter(function (i) { return i.id === id && i.color === color && i.size === size; })[0];
  if (hit) hit.qty = Math.min(10, hit.qty + qty); else bag.push({ id: id, color: color, size: size, qty: qty });
  saveBag(); updateBagUI();
}
function renderBag() {
  var body = $('bag-body');
  if (!bag.length) {
    body.innerHTML = '<div class="empty"><span>Your bag is empty.</span><button class="pill" type="button" data-close>Continue shopping</button></div>';
    return;
  }
  var total = 0;
  var rows = bag.map(function (it, i) {
    var p = byId(it.id); total += p.price * it.qty;
    return '<div class="bag-item" data-i="' + i + '">' +
      '<div class="bag-thumb"><svg viewBox="' + p.vb + '" style="color:' + COLORS[it.color][1] + '" aria-hidden="true"><use href="#' + p.sym + '"/></svg></div>' +
      '<div><strong>' + p.name + '</strong><div class="bag-meta">' + COLORS[it.color][0] + ' · ' + it.size + '</div>' +
      '<div class="qty sm"><button type="button" data-act="dec" aria-label="Decrease quantity">−</button><output>' + it.qty + '</output><button type="button" data-act="inc" aria-label="Increase quantity">+</button></div></div>' +
      '<div class="bag-right"><span>' + tk(p.price * it.qty) + '</span><button class="link-btn" type="button" data-act="rm" aria-label="Remove ' + p.name + '">Remove</button></div></div>';
  }).join('');
  body.innerHTML = rows +
    '<div class="bag-total"><span>Subtotal</span><span>' + tk(total) + '</span></div>' +
    '<p class="bag-note">Delivery is calculated at checkout.</p>' +
    '<button class="btn btn-primary btn-lg" type="button" id="checkout" style="width:100%;margin-top:14px">Checkout</button>';
}
function openBag() {
  bagFocus = document.activeElement; setPanel(null); renderBag();
  bagModal.hidden = false; document.body.style.overflow = 'hidden';
  bagModal.querySelector('[data-close].icon-btn').focus();
}
function closeBag() {
  bagModal.hidden = true; document.body.style.overflow = '';
  if (bagFocus && bagFocus.focus) bagFocus.focus();
}
bagBtn.addEventListener('click', openBag);
bagModal.addEventListener('click', function (e) {
  if (e.target.closest('[data-close]')) { closeBag(); return; }
  if (e.target.closest('#checkout')) { closeBag(); location.hash = '#checkout'; return; }
  var b = e.target.closest('[data-act]');
  if (!b) return;
  var row = b.closest('.bag-item'); var i = +row.dataset.i; var it = bag[i];
  if (!it) return;
  if (b.dataset.act === 'inc') it.qty = Math.min(10, it.qty + 1);
  else if (b.dataset.act === 'dec') it.qty = Math.max(1, it.qty - 1);
  else bag.splice(i, 1);
  saveBag(); updateBagUI(); renderBag();
});
updateBagUI();
