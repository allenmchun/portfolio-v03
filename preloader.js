(function () {
  var el = document.getElementById("preloader");
  if (!el) return;
  if (document.documentElement.classList.contains("skip-preloader")) {
    el.remove();
    return;
  }
  var started = Date.now();
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var minimum = reduce ? 0 : 1500;

  function hide() {
    var wait = Math.max(0, minimum - (Date.now() - started));
    window.setTimeout(function () {
      el.classList.add("is-done");
      window.setTimeout(function () {
        el.remove();
      }, 400);
    }, wait);
  }

  if (document.readyState === "complete") hide();
  else window.addEventListener("load", hide);
})();
