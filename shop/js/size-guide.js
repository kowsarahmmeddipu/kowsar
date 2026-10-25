/* Size guide modal */
/* ---- size guide ---- */
var SG = {
  women: { label: 'Women', cols: ['Size', 'Bust', 'Waist', 'Hips'], rows: [['XS', 81, 63, 89], ['S', 86, 68, 94], ['M', 91, 73, 99], ['L', 97, 79, 105], ['XL', 104, 86, 112]],
    tips: ['Bust: measure around the fullest part, keeping the tape level.', 'Waist: measure around your natural waistline.', 'Hips: measure around the fullest part of your hips.'] },
  men: { label: 'Men', cols: ['Size', 'Chest', 'Waist', 'Hips'], rows: [['S', 91, 76, 94], ['M', 97, 82, 100], ['L', 104, 89, 106], ['XL', 112, 97, 113], ['XXL', 119, 104, 119]],
    tips: ['Chest: measure around the fullest part, under the arms.', 'Waist: measure around your natural waistline.', 'Hips: measure around the fullest part of your hips.'] },
  foot: { label: 'Footwear', cols: ['EU size', 'Foot length'], rows: [['40', 25.0], ['41', 25.7], ['42', 26.3], ['43', 27.0]],
    tips: ['Stand on a sheet of paper against a wall.', 'Mark the tip of your longest toe.', 'Measure from the wall to the mark, and compare with the chart.'] }
};
var sgTab = 'women', sgUnit = 'cm';
var modal = $('size-modal'), lastFocus = null;
var tabsBox = $('sg-tabs');
Object.keys(SG).forEach(function (k) { var b = el('button', 'pill', SG[k].label); b.type = 'button'; b.dataset.tab = k; tabsBox.appendChild(b); });
function conv(v) {
  var x = sgUnit === 'cm' ? v : Math.round(v / 2.54 * 10) / 10;
  return sgTab === 'foot' ? x.toFixed(1) : String(x);
}
function drawSize() {
  var d = SG[sgTab];
  var html = '<thead><tr>' + d.cols.map(function (c, i) { return '<th scope="col">' + c + (i ? ' (' + sgUnit + ')' : '') + '</th>'; }).join('') + '</tr></thead><tbody>' +
    d.rows.map(function (r) { return '<tr>' + r.map(function (v, i) { return i ? '<td>' + conv(v) + '</td>' : '<th scope="row">' + v + '</th>'; }).join('') + '</tr>'; }).join('') + '</tbody>';
  $('size-table').innerHTML = html;
  $('size-tips').innerHTML = d.tips.map(function (t) { return '<li>' + t + '</li>'; }).join('');
  tabsBox.querySelectorAll('.pill').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.tab === sgTab)); });
  $('sg-units').querySelectorAll('.pill').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.unit === sgUnit)); });
}
tabsBox.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; sgTab = b.dataset.tab; drawSize(); });
$('sg-units').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; sgUnit = b.dataset.unit; drawSize(); });
function openSize() {
  lastFocus = document.activeElement; drawSize();
  modal.hidden = false; document.body.style.overflow = 'hidden';
  modal.querySelector('[data-close].icon-btn').focus();
}
function closeSize() {
  modal.hidden = true; document.body.style.overflow = '';
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}
modal.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) closeSize(); });
