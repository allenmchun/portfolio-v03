(function () {
  var root = document.documentElement;
  var key = "portfolio-theme";

  function dark() {
    return root.classList.contains("site-dark");
  }

  function sync(button) {
    var isDark = dark();
    button.setAttribute("aria-pressed", isDark ? "false" : "true");
    button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy") ? resolve() : reject(new Error("copy failed"));
      } catch (error) {
        reject(error);
      } finally {
        area.remove();
      }
    });
  }

  document.querySelectorAll("[data-email]").forEach(function (button) {
    button.addEventListener("click", function () {
      var email = button.getAttribute("data-email");
      copyText(email).then(function () {
        button.setAttribute("data-copied", "true");
        button.setAttribute("aria-label", "Email copied");
        window.clearTimeout(button.copyTimer);
        button.copyTimer = window.setTimeout(function () {
          button.removeAttribute("data-copied");
          button.setAttribute("aria-label", "Copy email");
        }, 1600);
      });
    });
  });

  document.querySelectorAll(".theme-toggle").forEach(function (button) {
    sync(button);
    button.addEventListener("click", function () {
      root.classList.toggle("site-dark");
      try {
        localStorage.setItem(key, dark() ? "dark" : "light");
      } catch (e) {}
      sync(button);
    });
  });
})();
