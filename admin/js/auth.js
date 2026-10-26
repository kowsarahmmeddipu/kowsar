/* Demo PIN lock. It only hides the panel on this device; it is not real security. */
function hashPin(pin) {
  var data = new TextEncoder().encode('kowsar-admin:' + pin);
  if (window.crypto && crypto.subtle) {
    return crypto.subtle.digest('SHA-256', data).then(function (b) { return Array.prototype.map.call(new Uint8Array(b), function (x) { return ('0' + x.toString(16)).slice(-2); }).join(''); });
  }
  var h = 5381; for (var i = 0; i < data.length; i++) h = ((h << 5) + h + data[i]) | 0;
  return Promise.resolve('x' + h);
}
var fails = 0, lockedUntil = 0;
function isOpen() { try { return sessionStorage.getItem(K.session) === '1'; } catch (e) { return false; } }
function setOpen(v) { try { if (v) sessionStorage.setItem(K.session, '1'); else sessionStorage.removeItem(K.session); } catch (e) {} }

function showLock() {
  var has = !!lsGet(K.pin, null);
  $('app').hidden = true; $('lock').hidden = false;
  $('lock-form').innerHTML =
    '<h1>' + (has ? 'Admin sign in' : 'Create your PIN') + '</h1>' +
    '<p class="muted" style="margin:6px 0 18px">' + (has ? 'Enter your PIN to open the boss panel.' : 'Choose a PIN of at least 4 characters. You will use it to open this panel on this device.') + '</p>' +
    '<label class="field"><span>PIN</span><input id="pin1" type="password" autocomplete="' + (has ? 'current-password' : 'new-password') + '" required></label>' +
    (has ? '' : '<label class="field"><span>Repeat PIN</span><input id="pin2" type="password" autocomplete="new-password" required></label>') +
    '<p class="err" id="lock-err" role="alert"></p>' +
    '<button class="btn" style="width:100%" type="submit">' + (has ? 'Open panel' : 'Save PIN and open') + '</button>' +
    '<p class="note">Demo lock: it keeps casual visitors out but is not secure. Anyone with access to this browser, or who knows how to read its storage, can get past it. Real sign-in needs a server.</p>';
  $('pin1').focus();
}
$('lock-form').addEventListener('submit', function (e) {
  e.preventDefault();
  var err = $('lock-err'), pin = $('pin1').value, has = !!lsGet(K.pin, null);
  if (Date.now() < lockedUntil) { err.textContent = 'Too many tries. Wait ' + Math.ceil((lockedUntil - Date.now()) / 1000) + ' seconds.'; return; }
  if (!has) {
    if (pin.length < 4) { err.textContent = 'Use at least 4 characters.'; return; }
    if (pin !== $('pin2').value) { err.textContent = 'The two PINs do not match.'; return; }
    hashPin(pin).then(function (h) { lsSet(K.pin, h); setOpen(true); enter(); });
  } else {
    hashPin(pin).then(function (h) {
      if (h === lsGet(K.pin, '')) { fails = 0; setOpen(true); enter(); }
      else { fails++; if (fails >= 5) { lockedUntil = Date.now() + 30000; fails = 0; err.textContent = 'Too many tries. Wait 30 seconds.'; } else err.textContent = 'That PIN is not right.'; $('pin1').value = ''; $('pin1').focus(); }
    });
  }
});
function lockNow() { setOpen(false); location.hash = ''; showLock(); }
