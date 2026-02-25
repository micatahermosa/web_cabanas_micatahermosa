/**
 * Slideshow — fade transition, dot navigation, auto-advance
 * Supports multiple instances via [data-slideshow] attribute.
 * Respects prefers-reduced-motion.
 *
 * Images use data-src / data-srcset — nothing loads until JS swaps them in.
 * On mobile (< 52rem) initialization is skipped: zero slider images downloaded.
 * Listens for viewport changes so resizing to desktop after mobile works correctly.
 * Dot clicks wait for the target image to load before crossfading.
 */
(function () {
    'use strict';

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var mq = window.matchMedia('(min-width: 52rem)');

    function loadSlide(slide) {
        if (slide.dataset.loaded) return;
        slide.dataset.loaded = '1';
        slide.querySelectorAll('source[data-srcset]').forEach(function (source) {
            source.srcset = source.dataset.srcset;
        });
        var img = slide.querySelector('img[data-src]');
        if (img) img.src = img.dataset.src;
    }

    function initSlideshow(container) {
        // Guard against double-init (e.g. user resizes mobile → desktop after desktop → mobile)
        if (container.dataset.slideshowInit) return;
        container.dataset.slideshowInit = '1';

        var slides = container.querySelectorAll('.slideshow-slide');
        var dots = container.querySelectorAll('.slideshow-dot');
        var interval = parseInt(container.dataset.interval, 10) || 4000;
        var current = 0;
        var timer = null;
        var pauseTimeout = null;

        if (slides.length < 2) return;

        // Load first two slides upfront — second needs to be ready before first interval fires
        loadSlide(slides[0]);
        loadSlide(slides[1]);

        if (prefersReducedMotion) {
            slides.forEach(function (s) { s.style.transition = 'none'; });
        }

        function activate(index) {
            slides[current].classList.remove('active');
            dots[current].classList.remove('active');
            dots[current].setAttribute('aria-selected', 'false');

            current = index;

            slides[current].classList.add('active');
            dots[current].classList.add('active');
            dots[current].setAttribute('aria-selected', 'true');

            // Preload the one after so it's always ready
            loadSlide(slides[(current + 1) % slides.length]);
        }

        function goTo(index) {
            loadSlide(slides[index]);
            var img = slides[index].querySelector('img');

            // Wait for the image to be ready before crossfading
            if (!img || (img.complete && img.naturalWidth > 0)) {
                activate(index);
            } else {
                img.addEventListener('load',  function () { activate(index); }, { once: true });
                img.addEventListener('error', function () { activate(index); }, { once: true });
            }
        }

        function next() {
            goTo((current + 1) % slides.length);
        }

        function startAutoPlay() {
            stopAutoPlay();
            timer = setInterval(next, interval);
        }

        function stopAutoPlay() {
            if (timer) { clearInterval(timer); timer = null; }
        }

        function pauseAndResume() {
            stopAutoPlay();
            if (pauseTimeout) clearTimeout(pauseTimeout);
            pauseTimeout = setTimeout(startAutoPlay, 10000);
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                if (i === current) return;
                goTo(i);
                pauseAndResume();
            });
        });

        startAutoPlay();
    }

    function maybeInit() {
        if (!mq.matches) return;
        document.querySelectorAll('[data-slideshow]').forEach(initSlideshow);
    }

    maybeInit();
    mq.addEventListener('change', maybeInit);
})();
