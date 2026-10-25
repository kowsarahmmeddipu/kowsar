/* Toast message and product details page */
var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
var home = $('home-view'), pdpView = $('pdp-view'), pdp = $('pdp');
var curId = null, st = null, toastTimer = null;

function toast(msg) {
  var t = $('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2600);
}

/* product page */
function pdpHTML(p) {
  var d = DETAILS[p.id];
  var care = CARE[d.fabric] || 'Follow the care label inside the garment.';
  var saved = wish.indexOf(p.id) > -1;
  var rel = P.filter(function (x) { return x.id !== p.id && x.cat === p.cat; }).concat(P.filter(function (x) { return x.id !== p.id && x.cat !== p.cat; })).slice(0, 4);
  return '<nav class="crumbs" aria-label="Breadcrumb"><a href="#top">Home</a><span aria-hidden="true">/</span><a href="#products" data-cat="' + p.cat + '">' + CAT_LABEL[p.cat] + '</a><span aria-hidden="true">/</span><span aria-current="page">' + p.name + '</span></nav>' +
  '<div class="pdp">' +
    '<div class="pdp-art">' + (p.tag ? '<span class="tag">' + p.tag + '</span>' : '') +
      '<svg class="garment" id="pdp-garment" viewBox="' + p.vb + '" style="color:' + COLORS[st.color][1] + '" role="img" aria-label="' + p.name + ' in ' + COLORS[st.color][0] + '"><use href="#' + p.sym + '"/></svg></div>' +
    '<div class="pdp-info">' +
      '<h1>' + p.name + '</h1>' +
      '<p class="pdp-price">' + tk(p.price) + '</p>' +
      '<p class="pdp-sub">' + d.desc + '</p>' +
      '<div class="opt"><div class="opt-head"><div>Colour <span id="pdp-color-name">' + COLORS[st.color][0] + '</span></div></div>' +
        '<div class="chip-row" id="pdp-colors">' + p.colors.map(function (c) { return '<button class="pill" type="button" data-color="' + c + '" aria-pressed="' + (c === st.color) + '"><span class="d" style="background:' + COLORS[c][1] + '"></span>' + COLORS[c][0] + '</button>'; }).join('') + '</div></div>' +
      '<div class="opt"><div class="opt-head"><div>Size</div><button class="link-btn" type="button" data-open-size>Size guide</button></div>' +
        '<div class="chip-row" id="pdp-sizes">' + p.sizes.map(function (s) { return '<button class="pill sq" type="button" data-size="' + s + '" aria-pressed="' + (s === st.size) + '">' + s + '</button>'; }).join('') + '</div>' +
        '<p class="pdp-err" id="pdp-err" role="alert"></p></div>' +
      '<div class="buy">' +
        '<div class="qty" role="group" aria-label="Quantity"><button type="button" data-d="-1" aria-label="Decrease quantity">−</button><output id="pdp-qty">1</output><button type="button" data-d="1" aria-label="Increase quantity">+</button></div>' +
        '<button class="btn btn-primary btn-lg" type="button" id="add-bag">Add to bag</button>' +
        '<button class="pill" type="button" id="pdp-heart" aria-pressed="' + saved + '" style="min-height:52px">' + (saved ? 'Saved' : 'Save') + '</button>' +
      '</div>' +
      '<ul class="perks"><li>' + CHECK + 'Ships within 2 working days</li><li>' + CHECK + 'Return or exchange within 7 days</li><li>' + CHECK + 'Cash on delivery, bKash, Nagad and cards</li></ul>' +
      '<div style="margin-top:12px">' +
        '<details class="acc" open><summary>Details</summary><div class="acc-body"><ul>' + d.points.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div></details>' +
        '<details class="acc"><summary>Fabric and care</summary><div class="acc-body"><p><strong>' + d.fabric + '.</strong> ' + care + '</p></div></details>' +
        '<details class="acc"><summary>Delivery and returns</summary><div class="acc-body"><p>Orders ship within 2 working days. Inside Dhaka delivery takes 1 to 3 days, and the rest of Bangladesh 3 to 5 days. Return unworn items with tags within 7 days of delivery.</p></div></details>' +
      '</div>' +
    '</div>' +
  '</div>' +
  '<section class="related" aria-labelledby="rel-title"><h2 class="section-title" id="rel-title">You may also like</h2><div class="cards" id="related">' + rel.map(cardHTML).join('') + '</div></section>';
}
function showPdp(p) {
  st = { id: p.id, color: picked[p.id] || p.colors[0], size: p.sizes.length === 1 ? p.sizes[0] : (profile.size && p.sizes.indexOf(profile.size) > -1 ? profile.size : null), qty: 1 };
  pdp.innerHTML = pdpHTML(p);
  home.hidden = true; pdpView.hidden = false;
  window.scrollTo(0, 0);
}
