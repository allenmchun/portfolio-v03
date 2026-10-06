(function () {
  var heading = document.querySelector(".intro-name");
  if (!heading) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var label = heading.textContent.trim();
  var readable = document.createElement("span");
  readable.className = "sr-only";
  readable.textContent = label;
  heading.textContent = "";
  heading.appendChild(readable);

  var letters = [];
  var words = label.split(" ");
  words.forEach(function (word, wordIndex) {
    var wordEl = document.createElement("span");
    wordEl.className = "intro-word";
    word.split("").forEach(function (char) {
      var letter = document.createElement("span");
      letter.className = "intro-letter";
      letter.setAttribute("aria-hidden", "true");
      letter.textContent = char;
      wordEl.appendChild(letter);
      letters.push(letter);
    });
    heading.appendChild(wordEl);
    if (wordIndex < words.length - 1) {
      var space = document.createElement("span");
      space.className = "intro-word";
      space.setAttribute("aria-hidden", "true");
      space.innerHTML = "&nbsp;";
      heading.appendChild(space);
    }
  });

  var mouse = { x: -9999, y: -9999 };
  function place(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  }
  function away() {
    mouse.x = -9999;
    mouse.y = -9999;
  }
  window.addEventListener("pointermove", function (event) {
    if (event.pointerType === "touch") return;
    place(event);
  });
  heading.addEventListener("pointerdown", function (event) {
    if (event.pointerType !== "touch") return;
    place(event);
  });
  heading.addEventListener("pointermove", function (event) {
    if (event.pointerType !== "touch") return;
    place(event);
  });
  window.addEventListener("pointerup", function (event) {
    if (event.pointerType === "touch") away();
  });
  window.addEventListener("pointercancel", function (event) {
    if (event.pointerType === "touch") away();
  });

  var radius = 100;
  var from = [64, 191, 148];

  function falloff(distance) {
    return Math.exp(-Math.pow(distance / (radius / 2), 2) / 2);
  }

  function target() {
    return document.documentElement.classList.contains("site-dark")
      ? [250, 0, 63]
      : [4, 55, 242];
  }

  function frame() {
    var to = target();
    letters.forEach(function (letter) {
      var rect = letter.getBoundingClientRect();
      var distance = Math.hypot(
        mouse.x - (rect.left + rect.width / 2),
        mouse.y - (rect.top + rect.height / 2)
      );
      var proximity = falloff(distance);
      var red = Math.round(from[0] + (to[0] - from[0]) * proximity);
      var green = Math.round(from[1] + (to[1] - from[1]) * proximity);
      var blue = Math.round(from[2] + (to[2] - from[2]) * proximity);
      letter.style.transform = "scale(" + (1 + 0.4 * proximity) + ")";
      letter.style.color = "rgb(" + red + "," + green + "," + blue + ")";
    });
    window.requestAnimationFrame(frame);
  }

  window.requestAnimationFrame(frame);
})();
