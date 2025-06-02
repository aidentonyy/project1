const SETTINGS_KEY = 'fitnessSettings';

const unitSelect = document.getElementById('unit-select');
const saveStatus = document.getElementById('save-status');
const darkModeToggle = document.getElementById('darkModeToggle');
const fontSizeSlider = document.getElementById('fontSizeSlider');
const fontSizeValue = document.getElementById('fontSizeValue');
const dyslexiaToggle = document.getElementById('dyslexiaToggle');

function loadSettings() {
  const saved = localStorage.getItem(SETTINGS_KEY);
  if (saved) {
    const settings = JSON.parse(saved);

    if (settings.unit) {
      unitSelect.value = settings.unit;
    }
    if (typeof settings.darkMode === 'boolean') {
      darkModeToggle.checked = settings.darkMode;
      document.body.classList.toggle('dark-mode', settings.darkMode);
    }
    if (settings.fontSize) {
      fontSizeSlider.value = settings.fontSize;
      fontSizeValue.textContent = settings.fontSize + '%';
      document.documentElement.style.fontSize = settings.fontSize + '%';
    }
    if (typeof settings.dyslexiaFont === 'boolean') {
      dyslexiaToggle.checked = settings.dyslexiaFont;
      document.body.classList.toggle('dyslexia-font', settings.dyslexiaFont);
    }
  }
}

function saveSettings() {
  const settings = {
    unit: unitSelect.value,
    darkMode: darkModeToggle.checked,
    fontSize: fontSizeSlider.value,
    dyslexiaFont: dyslexiaToggle.checked,
  };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  saveStatus.textContent = 'Settings saved!';
  setTimeout(() => {
    saveStatus.textContent = '';
  }, 2000);
}

// save settings when these change:
unitSelect.addEventListener('change', saveSettings);

darkModeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode', darkModeToggle.checked);
  saveSettings();
});

fontSizeSlider.addEventListener('input', () => {
  const val = fontSizeSlider.value;
  fontSizeValue.textContent = val + '%';
  document.documentElement.style.fontSize = val + '%';
  saveSettings();
});

dyslexiaToggle.addEventListener('change', () => {
  document.body.classList.toggle('dyslexia-font', dyslexiaToggle.checked);
  saveSettings();
});

// load saved settings on page load
window.addEventListener('DOMContentLoaded', loadSettings);
