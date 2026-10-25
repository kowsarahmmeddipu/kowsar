/* Start-up */
window.addEventListener('hashchange', route);
document.addEventListener('click', function (e) { if (e.target.closest('a[href^="#"]')) setTimeout(route, 0); });
route();

render();
