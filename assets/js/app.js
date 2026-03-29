(function () {
  const path = window.location.pathname;
  document.querySelectorAll('[data-nav]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && path.endsWith(href.replace(/^\.\//, '').replace(/^\.\.\//, ''))) {
      link.style.outline = '3px solid rgba(31,94,135,.15)';
    }
  });

  const todayTarget = document.querySelector('[data-today-label]');
  if (todayTarget) {
    const now = new Date();
    todayTarget.textContent = now.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  const yearTarget = document.querySelector('[data-current-year]');
  if (yearTarget) yearTarget.textContent = String(new Date().getFullYear());
})();