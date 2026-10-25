/* Hash router: home, product, checkout and account views */
function route() {
  var h = location.hash;
  var m = /^#p-([a-z0-9-]+)$/.exec(h);
  var p = m ? byId(m[1]) : null;
  if (p) {
    if (view !== 'pdp' || curId !== p.id) { curId = p.id; view = 'pdp'; coView.hidden = true; acctView.hidden = true; showPdp(p); }
    return;
  }
  if (h === '#checkout') { if (view !== 'checkout') { view = 'checkout'; showCheckout(); } return; }
  var am = /^#account(?:-([a-z]+))?$/.exec(h);
  if (am) {
    var tab = ACCT_TABS.indexOf(am[1]) > -1 ? am[1] : 'profile';
    if (view !== 'account' || acctTab !== tab) { view = 'account'; acctTab = tab; showAccount(); }
    return;
  }
  if (view !== 'home') {
    view = 'home'; curId = null; st = null;
    pdpView.hidden = true; coView.hidden = true; acctView.hidden = true; home.hidden = false;
    var t = null;
    try { t = h.length > 1 ? document.querySelector(h) : null; } catch (e) {}
    if (t) t.scrollIntoView(); else window.scrollTo(0, 0);
    render();
  }
}
pdp.addEventListener('click', function (e) {
  if (!st) return;
  var p = byId(st.id);
  var cb = e.target.closest('#pdp-colors button');
  if (cb) {
    st.color = cb.dataset.color; picked[p.id] = st.color;
    $('pdp-garment').style.color = COLORS[st.color][1];
    $('pdp-garment').setAttribute('aria-label', p.name + ' in ' + COLORS[st.color][0]);
    $('pdp-color-name').textContent = COLORS[st.color][0];
    document.querySelectorAll('#pdp-colors button').forEach(function (b) { b.setAttribute('aria-pressed', String(b === cb)); });
    return;
  }
  var sb = e.target.closest('#pdp-sizes button');
  if (sb) {
    st.size = sb.dataset.size; $('pdp-err').textContent = '';
    document.querySelectorAll('#pdp-sizes button').forEach(function (b) { b.setAttribute('aria-pressed', String(b === sb)); });
    return;
  }
  var qb = e.target.closest('.qty button');
  if (qb) { st.qty = Math.min(10, Math.max(1, st.qty + (+qb.dataset.d))); $('pdp-qty').textContent = st.qty; return; }
  if (e.target.closest('#add-bag')) {
    if (!st.size) { $('pdp-err').textContent = 'Choose a size to continue.'; var f = document.querySelector('#pdp-sizes button'); if (f) f.focus(); return; }
    addToBag(p.id, st.color, st.size, st.qty);
    toast(p.name + ' added to your bag');
    return;
  }
  var hb = e.target.closest('#pdp-heart');
  if (hb) {
    toggleIn(wish, p.id); persist();
    var on = wish.indexOf(p.id) > -1;
    hb.setAttribute('aria-pressed', String(on)); hb.textContent = on ? 'Saved' : 'Save';
    updateWishUI();
  }
});
pdp.addEventListener('click', function (e) { if (e.target.closest('#related')) cardClick(e); });
