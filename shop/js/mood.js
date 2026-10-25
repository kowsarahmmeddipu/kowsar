/* Mood switch (light and dark) */
/* mood switch: circular reveal from the button, with a colour-fade fallback */
(function () {
  var root = document.documentElement;
  var btn = document.getElementById('mood');
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  function current() {
    var t = root.getAttribute('data-theme');
    return t === 'dark' ? 'dark' : 'light';
  }
  function paint() {
    var m = current();
    btn.setAttribute('data-mode', m);
    btn.setAttribute('aria-label', m === 'dark' ? 'Switch to light mood' : 'Switch to dark mood');
  }
  function apply(next) {
    root.setAttribute('data-theme', next);
    paint();
    try { localStorage.setItem('noor-mood', next); } catch (e) {}
  }
  try {
    var saved = localStorage.getItem('noor-mood');
    if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);
  } catch (e) {}
  paint();
  if (mq.addEventListener) mq.addEventListener('change', paint);

  btn.addEventListener('click', function () {
    var next = current() === 'dark' ? 'light' : 'dark';
    if (reduce.matches) { apply(next); return; }
    var r = btn.getBoundingClientRect();
    var x = r.left + r.width / 2, y = r.top + r.height / 2;
    var radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    if (document.startViewTransition) {
      var vt = document.startViewTransition(function () { apply(next); });
      vt.ready.then(function () {
        root.animate(
          { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + radius + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: 750, easing: 'cubic-bezier(.65,0,.25,1)', pseudoElement: '::view-transition-new(root)' }
        );
      }).catch(function () {});
    } else {
      root.classList.add('mood-fade');
      apply(next);
      setTimeout(function () { root.classList.remove('mood-fade'); }, 700);
    }
  });
})();
