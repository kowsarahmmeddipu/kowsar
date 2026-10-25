/* Sticky header and icon grouping */
/* sticky header: add a hairline and compact padding once the page scrolls */
(function () {
  var header = document.getElementById('site-header');
  /* group the utility icons: search, account, saved, bag, then the mood switch */
  var iconBox = header.querySelector('.icons');
  iconBox.insertBefore(document.getElementById('search-btn'), iconBox.firstChild);
  iconBox.appendChild(document.getElementById('mood'));
  var ticking = false;
  function update() { header.classList.toggle('scrolled', window.scrollY > 8); ticking = false; }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();
