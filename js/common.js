document.addEventListener('DOMContentLoaded', () => {
  // get local dark mode settings and font size
  const darkMode = localStorage.getItem('fitnessSettings')
    ? JSON.parse(localStorage.getItem('fitnessSettings')).darkMode
    : false;
  const fontSize = localStorage.getItem('fitnessSettings')
    ? JSON.parse(localStorage.getItem('fitnessSettings')).fontSize || '100'
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
