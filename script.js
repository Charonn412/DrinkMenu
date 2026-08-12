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
