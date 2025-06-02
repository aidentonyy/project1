// js/common.js

document.addEventListener('DOMContentLoaded', () => {
  const darkMode = localStorage.getItem('fitnessSettings')
    ? JSON.parse(localStorage.getItem('fitnessSettings')).darkMode
    : false;
  const fontSize = localStorage.getItem('fitnessSettings')
    ? JSON.parse(localStorage.getItem('fitnessSettings')).fontSize || '100'
    : '100';

  // apply dark mode
  if (darkMode) {
    document.body.classList.add('dark-mode');
  }

  // apply font size
  document.documentElement.style.fontSize = fontSize + '%';

  // toggle mobile nav menu
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }
});
