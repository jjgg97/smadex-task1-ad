(() => {
  const track = document.getElementById('track');
  const dots = Array.from(document.querySelectorAll('.dot'));
  let index = 0;
  const total = dots.length;
  let timer = null;
  const INTERVAL = 3000;

  function go(i) {
    index = (i + total) % total;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, n) => d.classList.toggle('is-active', n === index));
  }

  function start() {
    stop();
    timer = setInterval(() => go(index + 1), INTERVAL);
  }
  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { go(i); start(); });
  });

  // Touch / drag swipe
  let startX = 0, currentX = 0, dragging = false;
  track.addEventListener('touchstart', (e) => {
    if (!e.touches[0]) return;
    startX = e.touches[0].clientX;
    dragging = true;
    stop();
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!dragging || !e.touches[0]) return;
    currentX = e.touches[0].clientX;
    const dx = currentX - startX;
    track.style.transition = 'none';
    track.style.transform = `translateX(calc(-${index*100}% + ${dx}px))`;
  }, { passive: true });

  function endSwipe(dx) {
    track.style.transition = '';
    const threshold = 50; // px
    if (dx > threshold) go(index - 1);
    else if (dx < -threshold) go(index + 1);
    else go(index);
    start();
  }
  track.addEventListener('touchend', (e) => {
    dragging = false;
    const dx = (currentX || startX) - startX;
    endSwipe(dx);
    startX = currentX = 0;
  });

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else start();
  });

  // Kick off
  go(0);
  start();
})();