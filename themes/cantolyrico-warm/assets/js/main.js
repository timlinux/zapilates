/**
 * Canto Lyrico - Main JavaScript
 * Enhanced for Bulma CSS Framework
 * Handles navigation, audio player, animations, and more
 */

(function() {
  'use strict';

  // ============================================
  // Bulma Navbar Burger Toggle
  // ============================================

  document.addEventListener('DOMContentLoaded', () => {
    // Get all "navbar-burger" elements
    const navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    // Add click event on each burger
    if (navbarBurgers.length > 0) {
      navbarBurgers.forEach(el => {
        el.addEventListener('click', () => {
          // Get the target from data-target attribute
          const target = el.dataset.target;
          const menu = document.getElementById(target);

          // Toggle the "is-active" class on both
          el.classList.toggle('is-active');
          if (menu) {
            menu.classList.toggle('is-active');
          }
        });
      });
    }

    // Close navbar menu when clicking on a link (mobile)
    const navbarItems = document.querySelectorAll('.navbar-menu .navbar-item');
    navbarItems.forEach(item => {
      item.addEventListener('click', () => {
        const burger = document.querySelector('.navbar-burger');
        const menu = document.querySelector('.navbar-menu');
        if (burger && menu && burger.classList.contains('is-active')) {
          burger.classList.remove('is-active');
          menu.classList.remove('is-active');
        }
      });
    });

    // Close navbar on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const burger = document.querySelector('.navbar-burger');
        const menu = document.querySelector('.navbar-menu');
        if (burger && menu) {
          burger.classList.remove('is-active');
          menu.classList.remove('is-active');
        }
      }
    });
  });

  // ============================================
  // Navbar Scroll Effect
  // ============================================

  let lastScroll = 0;
  const navbar = document.querySelector('.navbar');

  if (navbar) {
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      // Add shadow when scrolled
      if (currentScroll > 10) {
        navbar.classList.add('has-shadow');
      } else {
        navbar.classList.remove('has-shadow');
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ============================================
  // Scroll Animations
  // ============================================

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Optionally unobserve after animation
        // animationObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    animationObserver.observe(el);
  });

  // ============================================
  // Audio Player
  // ============================================

  const audioPlayers = document.querySelectorAll('.audio-player');

  audioPlayers.forEach(function(player) {
    const audio = player.querySelector('audio');
    const playBtn = player.querySelector('.audio-play-btn');
    const progressBar = player.querySelector('.audio-progress-bar');
    const progressContainer = player.querySelector('.audio-progress');
    const currentTimeEl = player.querySelector('.audio-current-time');
    const durationEl = player.querySelector('.audio-duration');
    const tracks = player.querySelectorAll('.audio-track');

    if (!audio || !playBtn) return;

    // Format time as mm:ss
    function formatTime(seconds) {
      if (isNaN(seconds)) return '0:00';
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return mins + ':' + (secs < 10 ? '0' : '') + secs;
    }

    // Update play button icon
    function updatePlayButton(playing) {
      if (playing) {
        playBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
        playBtn.setAttribute('aria-label', 'Pause');
      } else {
        playBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>';
        playBtn.setAttribute('aria-label', 'Play');
      }
    }

    // Play/Pause toggle
    playBtn.addEventListener('click', function() {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    });

    // Audio events
    audio.addEventListener('play', () => updatePlayButton(true));
    audio.addEventListener('pause', () => updatePlayButton(false));
    audio.addEventListener('ended', () => {
      updatePlayButton(false);
      tracks.forEach(t => t.classList.remove('is-playing'));
    });

    // Update progress bar
    audio.addEventListener('timeupdate', function() {
      if (progressBar) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = percent + '%';
      }
      if (currentTimeEl) {
        currentTimeEl.textContent = formatTime(audio.currentTime);
      }
    });

    // Set duration when loaded
    audio.addEventListener('loadedmetadata', function() {
      if (durationEl) {
        durationEl.textContent = formatTime(audio.duration);
      }
    });

    // Click on progress bar to seek
    if (progressContainer) {
      progressContainer.addEventListener('click', function(e) {
        const rect = progressContainer.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audio.currentTime = percent * audio.duration;
      });
    }

    // Track selection
    tracks.forEach(function(track) {
      track.addEventListener('click', function() {
        const src = this.dataset.src;
        if (src) {
          audio.src = src;
          audio.play();

          // Update active state
          tracks.forEach(t => t.classList.remove('is-playing'));
          this.classList.add('is-playing');
        }
      });

      // Keyboard accessibility
      track.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });
  });

  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================

  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#!') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();

        // Account for fixed navbar
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL without scrolling
        history.pushState(null, null, href);
      }
    });
  });

  // ============================================
  // Lazy Loading Images (enhanced native support)
  // ============================================

  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.add('is-loaded');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '100px 0px'
    });

    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  }

  // ============================================
  // Card Hover Effects (touch device support)
  // ============================================

  const cards = document.querySelectorAll('.card');

  cards.forEach(card => {
    // For touch devices, add tap-to-reveal
    card.addEventListener('touchstart', function() {
      this.classList.add('is-touched');
    }, { passive: true });

    card.addEventListener('touchend', function() {
      setTimeout(() => {
        this.classList.remove('is-touched');
      }, 300);
    }, { passive: true });
  });

  // ============================================
  // Back to Top Button
  // ============================================

  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ============================================
  // Notification Close Buttons
  // ============================================

  document.querySelectorAll('.notification .delete').forEach(deleteBtn => {
    const notification = deleteBtn.parentNode;
    deleteBtn.addEventListener('click', () => {
      notification.parentNode.removeChild(notification);
    });
  });

  // ============================================
  // Form Enhancements
  // ============================================

  // Add floating label effect to form inputs
  const formInputs = document.querySelectorAll('.input, .textarea');

  formInputs.forEach(input => {
    // Check if input has value on load
    if (input.value) {
      input.parentElement.classList.add('has-value');
    }

    input.addEventListener('focus', function() {
      this.parentElement.classList.add('is-focused');
    });

    input.addEventListener('blur', function() {
      this.parentElement.classList.remove('is-focused');
      if (this.value) {
        this.parentElement.classList.add('has-value');
      } else {
        this.parentElement.classList.remove('has-value');
      }
    });
  });

  // ============================================
  // Print Functionality
  // ============================================

  const printButtons = document.querySelectorAll('[data-print]');

  printButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      window.print();
    });
  });

  // ============================================
  // External Link Handler
  // ============================================

  // Add rel="noopener" to external links for security
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.href.includes(window.location.hostname)) {
      link.setAttribute('rel', 'noopener noreferrer');
      // Optionally add external link icon
      if (!link.querySelector('.fa-external-link-alt')) {
        // link.innerHTML += ' <i class="fas fa-external-link-alt fa-xs"></i>';
      }
    }
  });

})();
