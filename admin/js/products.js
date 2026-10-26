/* Products: list, add, edit, hide, delete, import and export */
var pq = '', pcat = 'all';
function thumb(p) { return '<div class="thumb"><svg viewBox="' + esc(p.vb) + '" style="color:' + esc(COLORS[p.colors[0]][1]) + '" aria-hidden="true"><use href="#' + esc(p.sym) + '"/></svg></div>'; }

function products() {
  var list = loadProducts();
  $('view').innerHTML =
    '<div class="top"><div><h1>Products</h1><span class="muted">' + list.length + ' items' + (usingSamples() ? ' · sample catalogue' : '') + '</span></div>' +
      '<div class="acts"><button class="btn ghost sm" data-act="export" type="button">Export</button><button class="btn ghost sm" data-act="import" type="button">Import</button><button class="btn" data-act="add" type="button">Add product</button></div></div>' +
    '<div class="toolbar"><input id="pq" type="search" placeholder="Search products" aria-label="Search products" value="' + esc(pq) + '"><select id="pcat" aria-label="Category"><option value="all">All categories</option>' +
      Object.keys(CAT_LABEL).map(function (k) { return '<option value="' + k + '"' + (pcat === k ? ' selected' : '') + '>' + CAT_LABEL[k] + '</option>'; }).join('') + '</select></div>' +
    '<div id="ptable"></div><input id="pfile" type="file" accept="application/json,.json" hidden>';
  $('pq').addEventListener('input', function () { pq = this.value; drawProducts(); });
  $('pcat').addEventListener('change', function () { pcat = this.value; drawProducts(); });
  $('pfile').addEventListener('change', importProducts);
  drawProducts();
}
function drawProducts() {
  var list = loadProducts().filter(function (p) {
    return (pcat === 'all' || p.cat === pcat) && (!pq || (p.name + ' ' + p.type + ' ' + p.id + ' ' + p.kw).toLowerCase().indexOf(pq.toLowerCase()) > -1);
  });
  if (!list.length) { $('ptable').innerHTML = '<div class="tablewrap"><div class="empty">No products match. Change the search or add a product.</div></div>'; return; }
  $('ptable').innerHTML = '<div class="tablewrap"><table><thead><tr><th>Product</th><th>Category</th><th class="num">Price</th><th>Colours</th><th>Sizes</th><th>Status</th><th></th></tr></thead><tbody>' +
    list.map(function (p) {
      return '<tr><td><div class="prodcell">' + thumb(p) + '<span><b>' + esc(p.name) + '</b><span class="muted">' + esc(p.type || '') + (p.tag ? ' · ' + esc(p.tag) : '') + '</span></span></div></td>' +
        '<td>' + esc(CAT_LABEL[p.cat]) + '</td><td class="num">' + esc(money(p.price)) + '</td>' +
        '<td>' + p.colors.map(function (c) { return '<span class="dot" title="' + esc(COLORS[c][0]) + '" style="background:' + esc(COLORS[c][1]) + '"></span>'; }).join(' ') + '</td>' +
        '<td class="muted">' + esc(p.sizes.join(' ')) + '</td>' +
        '<td><span class="badge ' + (p.hidden ? 'b-Hidden' : 'b-Live') + '">' + (p.hidden ? 'Hidden' : 'Live') + '</span></td>' +
        '<td><div class="rowacts"><button class="btn ghost sm" data-act="edit" data-id="' + esc(p.id) + '" type="button">Edit</button><button class="btn ghost sm" data-act="toggle" data-id="' + esc(p.id) + '" type="button">' + (p.hidden ? 'Show' : 'Hide') + '</button><button class="btn danger sm" data-act="del" data-id="' + esc(p.id) + '" type="button">Delete</button></div></td></tr>';
    }).join('') + '</tbody></table></div>';
}

function productForm(p) {
  var isNew = !p;
  p = p || { name: '', cat: 'women', type: '', price: '', sym: 'dress', colors: [], sizes: [], tag: '', kw: '', desc: '', fabric: '', points: [], hidden: false };
  var box = openDialog(
    '<h2>' + (isNew ? 'Add product' : 'Edit product') + '</h2><form id="pform" novalidate>' +
    '<label class="field"><span>Name</span><input id="f-name" type="text" maxlength="60" value="' + esc(p.name) + '" required></label>' +
    '<div class="two"><label class="field"><span>Category</span><select id="f-cat">' + Object.keys(CAT_LABEL).map(function (k) { return '<option value="' + k + '"' + (p.cat === k ? ' selected' : '') + '>' + CAT_LABEL[k] + '</option>'; }).join('') + '</select></label>' +
    '<label class="field"><span>Type</span><input id="f-type" type="text" maxlength="30" placeholder="Shirt, Dress, Bag" value="' + esc(p.type) + '"></label></div>' +
    '<div class="two"><label class="field"><span>Price (৳)</span><input id="f-price" type="number" min="1" step="1" inputmode="numeric" value="' + esc(p.price) + '" required></label>' +
    '<label class="field"><span>Shape shown in the shop</span><select id="f-sym">' + Object.keys(SHAPES).map(function (k) { return '<option value="' + k + '"' + (p.sym === k ? ' selected' : '') + '>' + SHAPES[k][0] + '</option>'; }).join('') + '</select></label></div>' +
    '<fieldset class="field"><legend>Colours</legend><div class="chips">' + Object.keys(COLORS).map(function (c) { return '<label class="chip"><input type="checkbox" name="f-color" value="' + c + '"' + (p.colors.indexOf(c) > -1 ? ' checked' : '') + '><span><i class="dot" style="background:' + COLORS[c][1] + '"></i>' + COLORS[c][0] + '</span></label>'; }).join('') + '</div></fieldset>' +
    '<fieldset class="field"><legend>Sizes</legend><div class="chips">' + SIZE_ORDER.map(function (z) { return '<label class="chip"><input type="checkbox" name="f-size" value="' + esc(z) + '"' + (p.sizes.indexOf(z) > -1 ? ' checked' : '') + '><span>' + esc(z) + '</span></label>'; }).join('') + '</div></fieldset>' +
    '<div class="two"><label class="field"><span>Label (optional)</span><input id="f-tag" type="text" maxlength="14" placeholder="New, Limited, Sale" value="' + esc(p.tag) + '"></label>' +
    '<label class="field"><span>Fabric</span><input id="f-fabric" type="text" maxlength="40" placeholder="Linen, Cotton twill" value="' + esc(p.fabric) + '"></label></div>' +
    '<label class="field"><span>Description</span><textarea id="f-desc" maxlength="400">' + esc(p.desc) + '</textarea></label>' +
    '<label class="field"><span>Key points (one per line, up to 5)</span><textarea id="f-points">' + esc((p.points || []).join('\n')) + '</textarea></label>' +
    '<label class="field"><span>Search words (optional)</span><input id="f-kw" type="text" maxlength="120" placeholder="party occasion cotton" value="' + esc(p.kw) + '"></label>' +
    '<label class="chip" style="margin-bottom:6px"><input id="f-hidden" type="checkbox"' + (p.hidden ? ' checked' : '') + '><span>Hide from the shop</span></label>' +
    '<p class="err" id="f-err" role="alert"></p>' +
    '<div class="foot"><button class="btn ghost" type="button" data-close>Cancel</button><button class="btn" type="submit">' + (isNew ? 'Add product' : 'Save changes') + '</button></div></form>');
  $('pform').addEventListener('submit', function (e) {
    e.preventDefault();
    var all = loadProducts();
    var vals = function (n) { return Array.prototype.map.call(box.querySelectorAll('input[name=' + n + ']:checked'), function (x) { return x.value; }); };
    var name = clean($('f-name').value, 60), price = Math.round(+$('f-price').value), err = $('f-err');
    if (!name) { err.textContent = 'Enter a product name.'; $('f-name').focus(); return; }
    if (!(price > 0)) { err.textContent = 'Enter a price above zero.'; $('f-price').focus(); return; }
    if (!vals('f-color').length) { err.textContent = 'Choose at least one colour.'; return; }
    if (!vals('f-size').length) { err.textContent = 'Choose at least one size.'; return; }
    var id = p.id;
    if (isNew) { var base = slug(name), n = 2; id = base; while (all.some(function (x) { return x.id === id; })) id = base + '-' + (n++); }
    var item = cleanProduct({ id: id, name: name, cat: $('f-cat').value, type: $('f-type').value, price: price, sym: $('f-sym').value, colors: vals('f-color'), sizes: vals('f-size'), tag: $('f-tag').value, kw: $('f-kw').value, desc: $('f-desc').value, fabric: $('f-fabric').value, points: $('f-points').value.split('\n'), hidden: $('f-hidden').checked });
    if (!item) { err.textContent = 'Some details are not valid. Check the form.'; return; }
    if (isNew) all.unshift(item); else all = all.map(function (x) { return x.id === id ? item : x; });
    if (!saveProducts(all)) { err.textContent = 'Could not save. Browser storage may be full or blocked.'; return; }
    closeDialog(); products(); toast(isNew ? 'Product added' : 'Changes saved');
  });
}

function importProducts() {
  var f = this.files && this.files[0]; this.value = '';
  if (!f) return;
  if (f.size > 1e6) { toast('That file is too large'); return; }
  var r = new FileReader();
  r.onload = function () {
    try {
      var a = JSON.parse(r.result); if (!Array.isArray(a)) throw 0;
      var ok = a.map(cleanProduct).filter(Boolean), seen = {};
      ok = ok.filter(function (p) { if (seen[p.id]) return false; seen[p.id] = 1; return true; });
      if (!ok.length) { toast('No valid products found in that file'); return; }
      confirmDialog('Replace catalogue?', ok.length + ' valid products found (' + (a.length - ok.length) + ' skipped). This replaces your current product list.', 'Replace', function () { saveProducts(ok); products(); toast('Catalogue imported'); });
    } catch (e) { toast('That is not a valid products file'); }
  };
  r.readAsText(f);
}

function productAction(act, id) {
  var all = loadProducts();
  if (act === 'add') productForm(null);
  else if (act === 'edit') productForm(all.filter(function (p) { return p.id === id; })[0]);
  else if (act === 'toggle') { all.forEach(function (p) { if (p.id === id) p.hidden = !p.hidden; }); saveProducts(all); drawProducts(); toast('Updated'); }
  else if (act === 'del') {
    var p = all.filter(function (x) { return x.id === id; })[0]; if (!p) return;
    confirmDialog('Delete ' + p.name + '?', 'It disappears from the shop. Past orders keep the product code. This cannot be undone. You can hide it instead.', 'Delete', function () {
      if (all.length <= 1) { toast('Keep at least one product'); return; }
      saveProducts(all.filter(function (x) { return x.id !== id; })); products(); toast('Product deleted');
    });
  }
  else if (act === 'export') download('kowsar-products.json', JSON.stringify(all, null, 2), 'application/json');
  else if (act === 'import') $('pfile').click();
}
