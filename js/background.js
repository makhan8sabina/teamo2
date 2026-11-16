
document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle');

  function getSavedTheme() {
    try {
      return localStorage.getItem('theme');
    } catch (err) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem('theme', theme);
    } catch (err) {}
  }

  function applyTheme(theme) {
    const dark = theme === 'dark';
    document.body.classList.toggle('dark-theme', dark);
    if (themeToggleBtn) {
      themeToggleBtn.textContent = dark ? '☀️ Light Mode' : '🌙 Dark Mode';
    }
  }

  applyTheme(getSavedTheme() === 'dark' ? 'dark' : 'light');

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const next = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
      applyTheme(next);
      saveTheme(next);
    });
  }
});