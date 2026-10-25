/* Header: search bar, menu and wishlist panels */
/* ---- header: search, menu, wishlist ---- */
var searchbar = $('searchbar'), menu = $('menu'), q = $('q');
function setPanel(which) {
  searchbar.hidden = which !== 'search';
  menu.hidden = which !== 'menu';
  $('search-btn').setAttribute('aria-expanded', String(which === 'search'));
  $('menu-btn').setAttribute('aria-expanded', String(which === 'menu'));
  if (which === 'search') q.focus();
}
$('search-btn').addEventListener('click', function () { setPanel(searchbar.hidden ? 'search' : null); });
$('menu-btn').addEventListener('click', function () { setPanel(menu.hidden ? 'menu' : null); });
$('search-close').addEventListener('click', function () { setPanel(null); $('search-btn').focus(); });
q.addEventListener('input', function () { S.q = q.value.trim(); render(); });
$('search-form').addEventListener('submit', function (e) { e.preventDefault(); setPanel(null); scrollToShop(); });
$('wish-btn').addEventListener('click', function () { S.saved = !S.saved; render(); if (S.saved) scrollToShop(); });
