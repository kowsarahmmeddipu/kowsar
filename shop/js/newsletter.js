/* Newsletter form */
(function () {
  var form = document.getElementById('news-form');
  var input = document.getElementById('news-email');
  var msg = document.getElementById('news-msg');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    msg.hidden = !ok;
    if (!ok) { msg.hidden = false; msg.textContent = 'Enter a valid email address.'; }
    else { msg.textContent = 'Thanks. You are on the list.'; input.value = ''; }
  });
})();
