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
