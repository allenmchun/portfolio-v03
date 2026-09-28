(function () {
  var STAGGER = 0.025;
  var DURATION = 0.6;

  function shuffle(length) {
    var order = [];
    var i;
    for (i = 0; i < length; i++) order.push(i);
    for (i = length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var swap = order[i];
      order[i] = order[j];
      order[j] = swap;
    }
    return order;
  }

  function build(link) {
    var label = link.textContent.trim();
    link.textContent = "";

    var readable = document.createElement("span");
    readable.className = "sr-only";
    readable.textContent = label;

    var swap = document.createElement("span");
    swap.className = "swap";
    swap.setAttribute("aria-hidden", "true");

    Array.from(label).forEach(function (letter) {
      var char = document.createElement("span");
      char.className = "swap-char";
      var front = document.createElement("span");
      front.className = "swap-front";
      front.textContent = letter;
      var back = document.createElement("span");
      back.className = "swap-back";
      back.textContent = letter;
      char.append(front, back);
      swap.append(char);
    });

    link.append(readable, swap);

    var pending = null;

    function play() {
      if (pending) return pending;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return Promise.resolve();
      }
      var chars = Array.from(swap.children);
      if (!chars.length) return Promise.resolve();
      pending = new Promise(function (resolve) {
        link.dataset.busy = "1";
        var order = shuffle(chars.length);
        chars.forEach(function (char, index) {
          var delay = order.indexOf(index) * STAGGER;
          char.querySelector(".swap-front").style.transitionDelay = delay + "s";
          char.querySelector(".swap-back").style.transitionDelay = delay + "s";
          char.classList.add("is-on");
        });
        window.setTimeout(function () {
          chars.forEach(function (char) {
            var front = char.querySelector(".swap-front");
            var back = char.querySelector(".swap-back");
            front.style.transition = "none";
            back.style.transition = "none";
            char.classList.remove("is-on");
          });
          swap.getBoundingClientRect();
          chars.forEach(function (char) {
            var front = char.querySelector(".swap-front");
            var back = char.querySelector(".swap-back");
            front.style.transition = "";
            back.style.transition = "";
            front.style.transitionDelay = "";
            back.style.transitionDelay = "";
          });
          link.dataset.busy = "";
          pending = null;
          resolve();
        }, ((chars.length - 1) * STAGGER + DURATION) * 1000 + 40);
      });
      return pending;
    }

    function hasHover() {
      return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    }

    link.addEventListener("mouseenter", function () {
      if (hasHover()) play();
    });
  }

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".site-nav a, [data-swap]").forEach(build);
  }
})();
