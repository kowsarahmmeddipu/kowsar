/* Global click and keyboard handlers */
/* ---- global handlers ---- */
document.addEventListener('click', function (e) {
  var open = e.target.closest('[data-open-size]');
  if (open) { e.preventDefault(); setPanel(null); openSize(); return; }
  var a = e.target.closest('a[data-cat]');
  if (a) { S.cat = a.dataset.cat; S.q = a.dataset.q || ''; $('q').value = S.q; render(); }
  if (e.target.closest('#menu a')) setPanel(null);
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    if (!modal.hidden) { closeSize(); return; }
    if (!bagModal.hidden) { closeBag(); return; }
    if (!searchbar.hidden || !menu.hidden) { var b = !menu.hidden ? $('menu-btn') : $('search-btn'); setPanel(null); b.focus(); }
    return;
  }
  var dlg = !modal.hidden ? modal : (!bagModal.hidden ? bagModal : null);
  if (e.key === 'Tab' && dlg) {
    var f = dlg.querySelectorAll('button, [href], input, select');
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});
