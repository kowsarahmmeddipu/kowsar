/* Catalogue: filtering, sorting, card rendering, filter controls */
/* ---- filtering ---- */
function words(p) {
  return (p.name + ' ' + p.type + ' ' + p.cat + ' ' + p.kw + ' ' + p.colors.map(function (c) { return COLORS[c][0]; }).join(' ')).toLowerCase().split(/\s+/).filter(Boolean);
}
function match(p) {
  if (S.cat !== 'all' && p.cat !== S.cat) return false;
  if (p.price > S.max) return false;
  if (S.sizes.length && !S.sizes.some(function (s) { return p.sizes.indexOf(s) > -1; })) return false;
  if (S.colors.length && !S.colors.some(function (c) { return p.colors.indexOf(c) > -1; })) return false;
  if (S.saved && wish.indexOf(p.id) < 0) return false;
  if (S.q) {
    var w = words(p);
    var terms = S.q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.every(function (t) { return w.some(function (x) { return x.indexOf(t) === 0; }); })) return false;
  }
  return true;
}
function sorted(list) {
  var a = list.slice();
  if (S.sort === 'low') a.sort(function (x, y) { return x.price - y.price; });
  else if (S.sort === 'high') a.sort(function (x, y) { return y.price - x.price; });
  else if (S.sort === 'az') a.sort(function (x, y) { return x.name.localeCompare(y.name); });
  return a;
}

/* ---- rendering ---- */
function cardHTML(p) {
  var cur = picked[p.id] || p.colors[0];
  var saved = wish.indexOf(p.id) > -1;
  var sizes = p.sizes.length === 1 ? p.sizes[0] : 'Sizes ' + p.sizes.join(' · ');
  return '<article class="card" data-id="' + p.id + '">' +
    '<div class="card-art"><a class="card-link" href="#p-' + p.id + '" aria-label="View ' + p.name + '"></a>' +
      (p.tag ? '<span class="tag">' + p.tag + '</span>' : '') +
      '<button class="heart" type="button" aria-pressed="' + saved + '" aria-label="Save ' + p.name + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-8-4.9-8-11a4.5 4.5 0 018-2.8 4.5 4.5 0 018 2.8c0 6.1-8 11-8 11z" stroke-linejoin="round"/></svg></button>' +
      '<svg class="garment" viewBox="' + p.vb + '" style="color:' + COLORS[cur][1] + '" aria-hidden="true"><use href="#' + p.sym + '"/></svg>' +
    '</div>' +
    '<div><h3 class="card-name"><a href="#p-' + p.id + '">' + p.name + '</a></h3>' +
    '<p class="card-meta">' + p.type + ' · ' + COLORS[cur][0] + '</p>' +
    '<p class="card-price">' + tk(p.price) + '</p></div>' +
    '<div class="swatches" role="group" aria-label="Colour for ' + p.name + '">' +
      p.colors.map(function (c) { return '<button class="sw" type="button" data-c="' + c + '" aria-pressed="' + (c === cur) + '" aria-label="' + COLORS[c][0] + '" title="' + COLORS[c][0] + '" style="background:' + COLORS[c][1] + '"></button>'; }).join('') +
    '</div>' +
    '<p class="card-sizes">' + sizes + '</p>' +
  '</article>';
}
function addChip(box, label, onRemove) {
  var c = el('span', 'xchip');
  c.appendChild(el('span', null, label));
  var b = el('button', null, '×');
  b.type = 'button';
  b.setAttribute('aria-label', 'Remove filter: ' + label);
  b.addEventListener('click', onRemove);
  c.appendChild(b);
  box.appendChild(c);
}
function clearAll() {
  S.cat = 'all'; S.sizes = []; S.colors = []; S.max = MAXP; S.saved = false; S.q = '';
  $('q').value = ''; $('price').value = MAXP;
  render();
}
function updateWishUI() {
  var b = $('wish-badge');
  b.textContent = wish.length; b.hidden = !wish.length;
  $('wish-btn').setAttribute('aria-pressed', String(S.saved));
  $('wish-only').textContent = 'Saved only (' + wish.length + ')';
  $('wish-only').setAttribute('aria-pressed', String(S.saved));
}
function render() {
  var list = sorted(P.filter(match));
  var box = $('cards');
  if (list.length) {
    box.innerHTML = list.map(cardHTML).join('');
  } else {
    var msg = (S.saved && !wish.length) ? 'You have not saved any pieces yet. Tap the heart on a piece to save it.' : 'No pieces match these filters. Remove a filter or try a different search.';
    box.innerHTML = '<div class="empty"><span>' + msg + '</span><button class="pill" type="button" id="empty-clear">Clear all filters</button></div>';
  }
  $('count').textContent = list.length + (list.length === 1 ? ' piece' : ' pieces');
  $('search-hint').textContent = S.q ? (list.length + (list.length === 1 ? ' result' : ' results') + ' for “' + S.q + '”. Press Enter to view.') : '';

  document.querySelectorAll('#cats .pill').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.cat === S.cat)); });
  document.querySelectorAll('#size-chips .pill').forEach(function (b) { b.setAttribute('aria-pressed', String(S.sizes.indexOf(b.dataset.size) > -1)); });
  document.querySelectorAll('#color-chips .pill').forEach(function (b) { b.setAttribute('aria-pressed', String(S.colors.indexOf(b.dataset.color) > -1)); });
  $('price-out').textContent = tk(S.max);
  updateWishUI();

  var act = $('active');
  act.innerHTML = '';
  var n = 0;
  if (S.cat !== 'all') { n++; addChip(act, CAT_LABEL[S.cat], function () { S.cat = 'all'; render(); }); }
  S.sizes.forEach(function (s) { n++; addChip(act, 'Size ' + s, function () { S.sizes.splice(S.sizes.indexOf(s), 1); render(); }); });
  S.colors.forEach(function (c) { n++; addChip(act, COLORS[c][0], function () { S.colors.splice(S.colors.indexOf(c), 1); render(); }); });
  if (S.max < MAXP) { n++; addChip(act, 'Up to ' + tk(S.max), function () { S.max = MAXP; $('price').value = MAXP; render(); }); }
  if (S.saved) { n++; addChip(act, 'Saved only', function () { S.saved = false; render(); }); }
  if (S.q) { n++; addChip(act, 'Search: ' + S.q, function () { S.q = ''; $('q').value = ''; render(); }); }
  if (n > 1) { var c = el('button', 'link-btn', 'Clear all'); c.type = 'button'; c.addEventListener('click', clearAll); act.appendChild(c); }
}

/* ---- controls ---- */
function toggleIn(arr, v) { var i = arr.indexOf(v); if (i > -1) arr.splice(i, 1); else arr.push(v); }
var cats = $('cats');
CATS.forEach(function (c) { var b = el('button', 'pill', c[1]); b.type = 'button'; b.dataset.cat = c[0]; cats.appendChild(b); });
cats.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; S.cat = b.dataset.cat; render(); });
var sizeBox = $('size-chips');
SIZE_ORDER.forEach(function (s) {
  if (!P.some(function (p) { return p.sizes.indexOf(s) > -1; })) return;
  var b = el('button', 'pill sq', s); b.type = 'button'; b.dataset.size = s; b.setAttribute('aria-pressed', 'false'); sizeBox.appendChild(b);
});
sizeBox.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; toggleIn(S.sizes, b.dataset.size); render(); });
var colorBox = $('color-chips');
Object.keys(COLORS).forEach(function (k) {
  var b = el('button', 'pill'); b.type = 'button'; b.dataset.color = k; b.setAttribute('aria-pressed', 'false');
  var d = el('span', 'd'); d.style.background = COLORS[k][1]; b.appendChild(d); b.appendChild(document.createTextNode(COLORS[k][0]));
  colorBox.appendChild(b);
});
colorBox.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; toggleIn(S.colors, b.dataset.color); render(); });
$('price').addEventListener('input', function () { S.max = +this.value; render(); });
$('sort').addEventListener('change', function () { S.sort = this.value; render(); });
$('wish-only').addEventListener('click', function () { S.saved = !S.saved; render(); });
$('filter-toggle').addEventListener('click', function () {
  var f = $('filters'); f.hidden = !f.hidden; this.setAttribute('aria-expanded', String(!f.hidden));
});
if (!window.matchMedia('(min-width: 861px)').matches) { $('filters').hidden = true; $('filter-toggle').setAttribute('aria-expanded', 'false'); }

function cardClick(e) {
  if (e.target.closest('#empty-clear')) { clearAll(); return; }
  var card = e.target.closest('.card');
  if (!card) return;
  var id = card.dataset.id;
  var heart = e.target.closest('.heart');
  if (heart) {
    toggleIn(wish, id); persist();
    if (S.saved) render();
    else { heart.setAttribute('aria-pressed', String(wish.indexOf(id) > -1)); updateWishUI(); }
    return;
  }
  var sw = e.target.closest('.sw');
  if (sw) {
    var c = sw.dataset.c; picked[id] = c;
    card.querySelector('.garment').style.color = COLORS[c][1];
    card.querySelector('.card-meta').textContent = byId(id).type + ' · ' + COLORS[c][0];
    card.querySelectorAll('.sw').forEach(function (b) { b.setAttribute('aria-pressed', String(b === sw)); });
  }
}
$('cards').addEventListener('click', cardClick);
