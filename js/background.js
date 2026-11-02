document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const colorBtn = document.getElementById('colorBtn');
  const colorNameSpan = document.getElementById('colorName');


  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    if (themeToggleBtn) themeToggleBtn.textContent = '☀️ Light Mode';
  } else {
    document.body.classList.remove('dark-theme');
    if (themeToggleBtn) themeToggleBtn.textContent = '🌙 Dark Mode';
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');

      if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
        themeToggleBtn.textContent = '☀️ Light Mode';
      } else {
        localStorage.setItem('theme', 'light');
        themeToggleBtn.textContent = '🌙 Dark Mode';
      }
    });
  }


  const colors = [
    { name: 'Light Blue', hex: '#e0f2fe' },
    { name: 'Soft Green', hex: '#dcfce7' },
    { name: 'Warm Yellow', hex: '#fef9c3' },
    { name: 'Lavender', hex: '#f3e8ff' },
    { name: 'Peach', hex: '#ffedd5' },
    { name: 'Default White', hex: '#ffffff' }
  ];

  if (colorBtn) {
    colorBtn.addEventListener('click', () => {
      const randomItem = colors[Math.floor(Math.random() * colors.length)];
      

      document.body.style.setProperty('background-color', randomItem.hex, 'important');

      if (colorNameSpan) {
        colorNameSpan.textContent = randomItem.name;
      }
    });
  }
});