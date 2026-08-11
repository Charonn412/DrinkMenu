// The Red Dose: trigger the raspberry diffusion once the cocktail
// is well into view, and only replay it if the guest scrolls away
// and returns after a real pause — not on every small scroll jitter.
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var target = document.querySelector('.cocktail--red-dose');

  if (!target || reduceMotion || !('IntersectionObserver' in window)) {
    return;
  }

  var REPLAY_COOLDOWN_MS = 20000;
  var hasPlayed = false;
  var lastExitTime = 0;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var now = Date.now();
          if (!hasPlayed || now - lastExitTime > REPLAY_COOLDOWN_MS) {
            target.classList.remove('is-blooming');
            void target.offsetWidth; // restart the CSS animation
            target.classList.add('is-blooming');
            hasPlayed = true;
          }
        } else {
          lastExitTime = Date.now();
        }
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(target);
})();

// Ambient light: nudge the whole blurred-light layer very
// slightly as the guest scrolls, on top of each blob's own
// autonomous drift. Gives an immediate, obvious "yes, this is
// alive" cue without turning into aggressive parallax — the
// shift is small, capped, and rAF-throttled off a passive
// scroll listener.
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var layer = document.querySelector('.ambient-light');

  if (!layer || reduceMotion) {
    return;
  }

  var MAX_SHIFT_PX = 70;
  var SHIFT_RATIO = 0.06;
  var ticking = false;

  function applyShift() {
    var shift = Math.min(window.scrollY * SHIFT_RATIO, MAX_SHIFT_PX);
    layer.style.setProperty('--scroll-shift', shift + 'px');
    ticking = false;
  }

  window.addEventListener(
    'scroll',
    function () {
      if (!ticking) {
        window.requestAnimationFrame(applyShift);
        ticking = true;
      }
    },
    { passive: true }
  );

  applyShift();
})();
