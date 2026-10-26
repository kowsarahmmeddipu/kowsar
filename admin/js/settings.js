/* Settings */
function settings() {
  $('view').innerHTML =
    '<div class="top"><h1>Settings</h1></div>' +
    '<div class="panel" style="margin-bottom:14px"><h2>Change PIN</h2><form id="pinform" style="max-width:340px"><label class="field"><span>Current PIN</span><input id="s-old" type="password" autocomplete="current-password"></label><label class="field"><span>New PIN (4 or more characters)</span><input id="s-new" type="password" autocomplete="new-password"></label><p class="err" id="s-err" role="alert"></p><button class="btn" type="submit">Update PIN</button></form></div>' +
    '<div class="panel" style="margin-bottom:14px"><h2>Backup</h2><p class="muted" style="margin-top:0">Products and orders live only in this browser. Download a backup now and then.</p><div class="rowacts"><button class="btn ghost" data-act="backup" type="button">Download backup</button><button class="btn ghost" data-act="restore" type="button">Restore backup</button></div><input id="bfile" type="file" accept="application/json,.json" hidden></div>' +
    '<div class="panel" style="margin-bottom:14px"><h2>Reset</h2><div class="rowacts"><button class="btn danger" data-act="reset-products" type="button">Back to sample products</button><button class="btn danger" data-act="reset-orders" type="button">Delete all orders</button></div></div>' +
    '<div class="panel"><h2>What this panel can and cannot do</h2><ul style="margin:0;padding-left:20px"><li>Product changes show in the shop on this same browser and device.</li><li>Orders from other customers’ phones never reach this panel, because the shop has no server yet.</li><li>The PIN is a demo lock, not real security.</li><li>For real orders from many customers, the next step is a backend such as Supabase, or a platform such as Shopify.</li></ul></div>';
  $('pinform').addEventListener('submit', function (e) {
    e.preventDefault();
    var err = $('s-err'), nw = $('s-new').value;
    if (nw.length < 4) { err.textContent = 'Use at least 4 characters.'; return; }
    hashPin($('s-old').value).then(function (h) {
      if (h !== lsGet(K.pin, '')) { err.textContent = 'Current PIN is not right.'; return; }
      return hashPin(nw).then(function (n) { lsSet(K.pin, n); $('pinform').reset(); err.textContent = ''; toast('PIN updated'); });
    });
  });
  $('bfile').addEventListener('change', function () {
    var f = this.files && this.files[0]; this.value = ''; if (!f) return;
    if (f.size > 3e6) { toast('That file is too large'); return; }
    var r = new FileReader();
    r.onload = function () {
      try {
        var b = JSON.parse(r.result), prods = (Array.isArray(b.products) ? b.products : []).map(cleanProduct).filter(Boolean), ords = Array.isArray(b.orders) ? b.orders.filter(function (o) { return o && typeof o.ref === 'string' && Array.isArray(o.items); }) : [];
        if (!prods.length && !ords.length) { toast('No data found in that file'); return; }
        confirmDialog('Restore backup?', prods.length + ' products and ' + ords.length + ' orders will replace what is here now.', 'Restore', function () { if (prods.length) saveProducts(prods); saveOrders(ords); toast('Backup restored'); });
      } catch (er) { toast('That is not a valid backup'); }
    };
    r.readAsText(f);
  });
}
function settingsAction(act) {
  if (act === 'backup') download('kowsar-backup.json', JSON.stringify({ products: loadProducts(), orders: loadOrders(), saved: new Date().toISOString() }, null, 2), 'application/json');
  else if (act === 'restore') $('bfile').click();
  else if (act === 'reset-products') confirmDialog('Back to sample products?', 'Your product list is replaced by the 13 sample products.', 'Reset', function () { try { localStorage.removeItem(K.prod); } catch (e) {} toast('Sample products restored'); });
  else if (act === 'reset-orders') confirmDialog('Delete all orders?', 'Every order in this panel is removed. This cannot be undone.', 'Delete all', function () { saveOrders([]); try { localStorage.removeItem('kowsar-orders'); } catch (e) {} toast('All orders deleted'); });
}
