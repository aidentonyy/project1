document.addEventListener('DOMContentLoaded', () => {
  // get local dark mode settings and font size
  const darkMode = localStorage.getItem('WADD')
    ? JSON.parse(localStorage.getItem('WADD')).darkMode
    : false;
  const fontSize = localStorage.getItem('WADD')
    ? JSON.parse(localStorage.getItem('WADD')).fontSize || '100'
    : '100';

  // switch to dark mode
  if (darkMode) {
    document.body.classList.add('dark-mode');
  }

  // put settings set font size
  document.documentElement.style.fontSize = fontSize + '%';

  // change to burger nav menu
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  // display burger menu navigation 
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }
});

const SETTINGS_KEY = 'WADD';

function applySettings() {
  const saved = localStorage.getItem(SETTINGS_KEY);
  if (saved) {
    try {
      const settings = JSON.parse(saved);
      // Apply dark mode class to body
      if (typeof settings.darkMode === 'boolean') {
        document.body.classList.toggle('dark-mode', settings.darkMode);
      }
      // Apply font size to css root
      if (settings.fontSize) {
        document.documentElement.style.fontSize = settings.fontSize + '%';
      }
    } catch (e) {
      console.warn('Failed to parse settings:', e);
    }
  }
}

// Run on every page load
window.addEventListener('DOMContentLoaded', applySettings);
