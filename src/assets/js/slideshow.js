/**
 * Slideshow — fade transition, dot navigation, auto-advance
 * Supports multiple instances via [data-slideshow] attribute.
 * Respects prefers-reduced-motion.
 */
(function () {
    'use strict';

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.querySelectorAll('[data-slideshow]').forEach(function (container) {
        var slides = container.querySelectorAll('.slideshow-slide');
        var dots = container.querySelectorAll('.slideshow-dot');
        var interval = parseInt(container.dataset.interval, 10) || 4000;
        var current = 0;
        var timer = null;
        var pauseTimeout = null;

        if (slides.length < 2) return;

        // Disable CSS transition if reduced motion
        if (prefersReducedMotion) {
            slides.forEach(function (s) { s.style.transition = 'none'; });
        }

        function goTo(index) {
            slides[current].classList.remove('active');
            dots[current].classList.remove('active');
            dots[current].setAttribute('aria-selected', 'false');

            current = index;

            slides[current].classList.add('active');
            dots[current].classList.add('active');
            dots[current].setAttribute('aria-selected', 'true');
        }

        function next() {
            goTo((current + 1) % slides.length);
        }

        function startAutoPlay() {
            stopAutoPlay();
            timer = setInterval(next, interval);
        }

        function stopAutoPlay() {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        }

        function pauseAndResume() {
            stopAutoPlay();
            if (pauseTimeout) clearTimeout(pauseTimeout);
            pauseTimeout = setTimeout(startAutoPlay, 10000);
        }

        // Dot click handlers
        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                if (i === current) return;
                goTo(i);
                pauseAndResume();
            });
        });

        startAutoPlay();
    });
})();
