/* Dashboard */
function dashboard() {
  var orders = loadOrders(), prods = loadProducts();
  var live = orders.filter(function (o) { return o.status !== 'Cancelled'; });
  var revenue = live.reduce(function (n, o) { return n + (+o.total || 0); }, 0);
  var fresh = orders.filter(function (o) { return o.status === 'New'; }).length;
  var visible = prods.filter(function (p) { return !p.hidden; }).length;

  /* last 7 days revenue */
  var days = [], i;
  for (i = 6; i >= 0; i--) { var d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - i); days.push({ t: d.getTime(), label: d.toLocaleDateString('en-GB', { weekday: 'short' }), v: 0 }); }
  live.forEach(function (o) { var t = new Date(o.date || 0); t.setHours(0, 0, 0, 0); days.forEach(function (x) { if (x.t === t.getTime()) x.v += +o.total || 0; }); });
  var max = Math.max.apply(null, days.map(function (x) { return x.v; })) || 1;
  var bars = days.map(function (x, k) {
    var h = Math.round(x.v / max * 120), bx = 20 + k * 96;
    return '<rect x="' + bx + '" y="' + (140 - h) + '" width="56" height="' + Math.max(h, x.v ? 2 : 0) + '" rx="6" fill="#0b0b0b"/>' +
      '<text x="' + (bx + 28) + '" y="160" text-anchor="middle">' + esc(x.label) + '</text>' +
      (x.v ? '<text x="' + (bx + 28) + '" y="' + (134 - h) + '" text-anchor="middle">' + esc(money(x.v)) + '</text>' : '');
  }).join('');

  /* top products by quantity */
  var qty = {};
  live.forEach(function (o) { o.items.forEach(function (it) { qty[it.id] = (qty[it.id] || 0) + (+it.qty || 0); }); });
  var top = Object.keys(qty).sort(function (a, b) { return qty[b] - qty[a]; }).slice(0, 5);

  var recent = orders.slice(0, 5).map(function (o) {
    return '<li><span><b>' + esc(o.ref) + '</b><br><span class="muted">' + esc((o.cust && o.cust.name) || 'Customer') + ' · ' + esc(fmtDate(o.date)) + '</span></span><span style="text-align:right">' + esc(money(o.total)) + '<br><span class="badge b-' + esc(o.status) + '">' + esc(o.status) + '</span></span></li>';
  }).join('');

  $('view').innerHTML =
    '<div class="top"><h1>Dashboard</h1><div class="acts"><a class="btn ghost" href="/shop" target="_blank" rel="noopener">View shop</a></div></div>' +
    '<div class="tiles">' +
      '<div class="tile"><div class="k">Orders</div><div class="v">' + orders.length + '</div></div>' +
      '<div class="tile"><div class="k">New, to confirm</div><div class="v">' + fresh + '</div></div>' +
      '<div class="tile"><div class="k">Revenue (not cancelled)</div><div class="v">' + esc(money(revenue)) + '</div></div>' +
      '<div class="tile"><div class="k">Products live</div><div class="v">' + visible + '<span class="muted" style="font-size:16px"> / ' + prods.length + '</span></div></div>' +
    '</div>' +
    '<div class="grid2">' +
      '<div class="panel"><h2>Revenue, last 7 days</h2><svg class="bars" viewBox="0 0 700 170" role="img" aria-label="Revenue per day for the last 7 days">' + bars + '</svg></div>' +
      '<div class="panel"><h2>Top products</h2>' + (top.length ? '<ul class="list">' + top.map(function (id) { return '<li><span>' + esc(productName(id)) + '</span><b>' + qty[id] + ' sold</b></li>'; }).join('') + '</ul>' : '<p class="muted">No sales yet.</p>') + '</div>' +
    '</div>' +
    '<div class="panel"><h2>Recent orders</h2>' + (recent ? '<ul class="list">' + recent + '</ul><p style="margin:14px 0 0"><a href="#orders">See all orders</a></p>' : '<p class="muted">No orders yet. Place a test order in the <a href="/shop" target="_blank" rel="noopener">shop</a> using this same browser and it will appear here.</p>') + '</div>';
}
