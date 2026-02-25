/**
 * Mi Cata Hermosa — Main JavaScript
 * Nav toggle, GLightbox, email obfuscation
 */
(function () {
    'use strict';

    // =====================
    // Mobile nav toggle
    // =====================
    var hamburger = document.getElementById('hamburger');
    var nav = document.getElementById('main-nav');

    if (hamburger && nav) {
        var labelOpen  = hamburger.dataset.labelOpen  || 'Abrir menú';
        var labelClose = hamburger.dataset.labelClose || 'Cerrar menú';

        function openNav() {
            nav.classList.add('open');
            hamburger.setAttribute('aria-expanded', 'true');
            hamburger.setAttribute('aria-label', labelClose);
            document.body.style.overflow = 'hidden';
            var firstLink = nav.querySelector('a');
            if (firstLink) firstLink.focus();
        }

        function closeNav() {
            nav.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', labelOpen);
            document.body.style.overflow = '';
        }

        hamburger.addEventListener('click', function () {
            nav.classList.contains('open') ? closeNav() : openNav();
        });

        // Close nav when clicking a link
        nav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function (e) {
                var href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    closeNav();
                    var target = document.querySelector(href);
                    if (target) {
                        requestAnimationFrame(function () {
                            target.scrollIntoView({ behavior: 'smooth' });
                        });
                    }
                } else {
                    closeNav();
                }
            });
        });

        // Escape to close + Tab focus trap
        document.addEventListener('keydown', function (e) {
            if (!nav.classList.contains('open')) return;

            if (e.key === 'Escape') {
                closeNav();
                hamburger.focus();
                return;
            }

            if (e.key === 'Tab') {
                var links = Array.from(nav.querySelectorAll('a'));
                if (!links.length) return;
                var first = links[0];
                var last = links[links.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        });
    }

    // =====================
    // GLightbox
    // =====================
    if (typeof GLightbox !== 'undefined') {
        GLightbox({
            selector: '.glightbox',
            touchNavigation: true,
            loop: true,
            autoplayVideos: false,
            closeOnOutsideClick: true,
            descPosition: 'bottom'
        });
    }

    // =====================
    // Gallery open buttons
    // =====================
    document.querySelectorAll('[data-open-gallery]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var trigger = btn.closest('section').querySelector('.gallery-trigger');
            if (trigger) trigger.click();
        });
    });

    // =====================
    // Legal modal
    // =====================
    var legalTrigger = document.getElementById('legal-trigger');
    var legalModal = document.getElementById('legal-modal');

    if (legalTrigger && legalModal) {
        legalTrigger.addEventListener('click', function () {
            legalModal.showModal();
            legalModal.focus();
        });

        legalModal.querySelector('.legal-close').addEventListener('click', function () {
            legalModal.close();
        });

        // Close on backdrop click
        legalModal.addEventListener('click', function (e) {
            if (e.target === legalModal) legalModal.close();
        });
    }

    // =====================
    // Email obfuscation
    // =====================
    document.querySelectorAll('.email-link').forEach(function (el) {
        var encoded = el.dataset.email;
        if (!encoded) return;

        try {
            var decoded = atob(encoded);
            el.href = 'mailto:' + decoded;
            var label = el.querySelector('span');
            if (label) label.textContent = decoded;
        } catch (e) {
            // silently fail
        }
    });

})();
