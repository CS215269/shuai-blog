(function () {
  'use strict';

  // ---- Theme Toggle ----
  var html = document.documentElement;
  var themeToggle = document.getElementById('themeToggle');

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    if (themeToggle) {
      themeToggle.innerHTML = theme === 'light' ? '&#9790;' : '&#9789;';
      themeToggle.setAttribute('aria-label',
        theme === 'light' ? '切换到暗色主题' : '切换到亮色主题'
      );
    }
    try { localStorage.setItem('theme', theme); } catch (e) {}
  }

  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  if (saved) {
    setTheme(saved);
  } else {
    setTheme(html.getAttribute('data-theme') || 'dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  // Keyboard shortcut: Ctrl+Shift+T
  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.shiftKey && (e.key === 'T' || e.key === 't')) {
      e.preventDefault();
      setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    }
  });

  // ---- Back to Top ----
  var backToTopBtn = document.getElementById('backToTopBtn');
  var backToTopLink = document.getElementById('backToTopLink');

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleBackToTop() {
    if (!backToTopBtn) return;
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  if (backToTopBtn) backToTopBtn.addEventListener('click', scrollToTop);
  if (backToTopLink) {
    backToTopLink.addEventListener('click', function (e) {
      e.preventDefault();
      scrollToTop();
    });
  }

  window.addEventListener('scroll', toggleBackToTop, { passive: true });

  // ---- Mobile TOC Toggle ----
  var tocToggle = document.getElementById('tocToggle');
  var tocContent = document.getElementById('tocContent');

  if (tocToggle && tocContent) {
    tocToggle.addEventListener('click', function () {
      var isOpen = tocContent.classList.toggle('open');
      tocToggle.setAttribute('aria-expanded', String(isOpen));
      tocToggle.innerHTML = isOpen ? '目录 &#10005;' : '目录 &#9776;';
    });
  }

  // ---- TOC Active Heading Highlight ----
  var tocLinks = document.querySelectorAll('.toc-list .toc-list-link');
  var headings = document.querySelectorAll('.article-body h2[id], .article-body h3[id]');

  if (tocLinks.length && headings.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            tocLinks.forEach(function (link) {
              link.classList.remove('active');
              var href = link.getAttribute('href');
              if (href) {
                var decoded = decodeURIComponent(href.replace('#', ''));
                if (decoded === entry.target.id) {
                  link.classList.add('active');
                }
              }
            });
          }
        });
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );

    headings.forEach(function (h) { observer.observe(h); });
  }

  // ---- Mobile Nav Toggle ----
  var navToggle = document.getElementById('navToggle');
  var navPanel = document.getElementById('navPanel');

  function openNav() {
    if (!navToggle || !navPanel) return;
    navPanel.hidden = false;
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', '关闭导航菜单');
    var firstLink = navPanel.querySelector('.nav-panel-link');
    if (firstLink) firstLink.focus();
  }

  function closeNav() {
    if (!navToggle || !navPanel) return;
    navPanel.hidden = true;
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', '打开导航菜单');
    navToggle.focus();
  }

  if (navToggle && navPanel) {
    navToggle.addEventListener('click', function () {
      var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) closeNav(); else openNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        closeNav();
      }
    });
  }

})();
