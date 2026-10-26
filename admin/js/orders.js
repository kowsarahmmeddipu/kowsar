/* Orders */
var oq = '', ost = 'all';
function orders() {
  $('view').innerHTML =
    '<div class="top"><div><h1>Orders</h1><span class="muted">From the shop in this browser</span></div><div class="acts"><button class="btn ghost sm" data-act="csv" type="button">Export CSV</button></div></div>' +
    '<div class="toolbar"><input id="oq" type="search" placeholder="Search order number, name or phone" aria-label="Search orders" value="' + esc(oq) + '"><select id="ost" aria-label="Status"><option value="all">All statuses</option>' +
      STATUSES.map(function (s) { return '<option' + (ost === s ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select></div><div id="otable"></div>';
  $('oq').addEventListener('input', function () { oq = this.value; drawOrders(); });
  $('ost').addEventListener('change', function () { ost = this.value; drawOrders(); });
  drawOrders();
}
function filteredOrders() {
  return loadOrders().filter(function (o) {
    var c = o.cust || {}, hay = (o.ref + ' ' + (c.name || '') + ' ' + (c.phone || '')).toLowerCase();
    return (ost === 'all' || o.status === ost) && (!oq || hay.indexOf(oq.toLowerCase()) > -1);
  });
}
function drawOrders() {
  var list = filteredOrders();
  if (!list.length) { $('otable').innerHTML = '<div class="tablewrap"><div class="empty">' + (loadOrders().length ? 'No orders match.' : 'No orders yet. Place a test order in the <a href="/shop" target="_blank" rel="noopener">shop</a> using this same browser and it will appear here.') + '</div></div>'; return; }
  $('otable').innerHTML = '<div class="tablewrap"><table><thead><tr><th>Order</th><th>Date</th><th>Customer</th><th class="num">Items</th><th class="num">Total</th><th>Payment</th><th>Status</th><th></th></tr></thead><tbody>' +
    list.map(function (o) {
      var c = o.cust || {}, n = o.items.reduce(function (s, i) { return s + (+i.qty || 0); }, 0);
      return '<tr><td><b>' + esc(o.ref) + '</b></td><td class="muted">' + esc(fmtDate(o.date)) + '</td><td>' + esc(c.name || 'Not recorded') + '<br><span class="muted">' + esc(c.phone || '') + '</span></td><td class="num">' + n + '</td><td class="num">' + esc(money(o.total)) + '</td><td>' + esc(o.pay || '') + '</td>' +
        '<td><select class="st" data-ref="' + esc(o.ref) + '" aria-label="Status of ' + esc(o.ref) + '">' + STATUSES.map(function (s) { return '<option' + (o.status === s ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select></td>' +
        '<td><button class="btn ghost sm" data-act="view" data-ref="' + esc(o.ref) + '" type="button">Details</button></td></tr>';
    }).join('') + '</tbody></table></div>';
}
function setStatus(ref, status) {
  if (STATUSES.indexOf(status) < 0) return;
  var all = loadOrders(); all.forEach(function (o) { if (o.ref === ref) o.status = status; });
  saveOrders(all); toast(ref + ' is now ' + status);
}
function orderDetails(ref) {
  var o = loadOrders().filter(function (x) { return x.ref === ref; })[0]; if (!o) return;
  var c = o.cust || {};
  openDialog('<h2>Order ' + esc(o.ref) + '</h2>' +
    '<dl class="kv"><dt>Placed</dt><dd>' + esc(fmtDate(o.date)) + '</dd><dt>Status</dt><dd><span class="badge b-' + esc(o.status) + '">' + esc(o.status) + '</span></dd>' +
    '<dt>Customer</dt><dd>' + esc(c.name || 'Not recorded') + '</dd><dt>Phone</dt><dd>' + esc(c.phone || '-') + '</dd><dt>Email</dt><dd>' + esc(c.email || '-') + '</dd>' +
    '<dt>Address</dt><dd>' + esc(c.address || '-') + '</dd><dt>Delivery area</dt><dd>' + (o.area === 'dhaka' ? 'Inside Dhaka' : o.area === 'outside' ? 'Outside Dhaka' : '-') + '</dd><dt>Payment</dt><dd>' + esc(o.pay || '-') + '</dd></dl>' +
    '<div class="tablewrap" style="margin-bottom:12px"><table style="min-width:0"><thead><tr><th>Item</th><th>Colour</th><th>Size</th><th class="num">Qty</th></tr></thead><tbody>' +
    o.items.map(function (i) { return '<tr><td>' + esc(productName(i.id)) + '</td><td>' + esc(COLORS[i.color] ? COLORS[i.color][0] : i.color) + '</td><td>' + esc(i.size) + '</td><td class="num">' + (+i.qty || 0) + '</td></tr>'; }).join('') + '</tbody></table></div>' +
    '<dl class="kv"><dt>Subtotal</dt><dd>' + esc(money(o.sub != null ? o.sub : o.total)) + '</dd><dt>Delivery</dt><dd>' + esc(money(o.fee || 0)) + '</dd><dt><b>Total</b></dt><dd><b>' + esc(money(o.total)) + '</b></dd></dl>' +
    '<div class="foot"><button class="btn danger" data-act="delorder" data-ref="' + esc(o.ref) + '" type="button">Delete order</button><button class="btn" data-close type="button">Close</button></div>');
}
function csvCell(v) { v = String(v == null ? '' : v); if (/^[=+\-@\t\r]/.test(v)) v = "'" + v; return '"' + v.replace(/"/g, '""') + '"'; }
function exportCsv() {
  var rows = [['Order', 'Date', 'Customer', 'Phone', 'Email', 'Address', 'Area', 'Payment', 'Items', 'Total', 'Status']];
  filteredOrders().forEach(function (o) {
    var c = o.cust || {};
    rows.push([o.ref, new Date(o.date).toISOString(), c.name, c.phone, c.email, c.address, o.area, o.pay, o.items.map(function (i) { return productName(i.id) + ' ' + i.color + ' ' + i.size + ' x' + i.qty; }).join('; '), o.total, o.status]);
  });
  download('kowsar-orders.csv', '﻿' + rows.map(function (r) { return r.map(csvCell).join(','); }).join('\r\n'), 'text/csv');
}
function orderAction(act, ref) {
  if (act === 'csv') exportCsv();
  else if (act === 'view') orderDetails(ref);
  else if (act === 'delorder') { closeDialog(); confirmDialog('Delete order ' + ref + '?', 'This removes it from the panel. It cannot be undone.', 'Delete', function () { saveOrders(loadOrders().filter(function (o) { return o.ref !== ref; })); orders(); toast('Order deleted'); }); }
}
