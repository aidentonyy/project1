// const SETTINGS_KEY = 'WADD'; // the key used to access local storage

// loads in elements for settings input and status indication
const saveStatus = document.getElementById('save-status');
const darkModeToggle = document.getElementById('darkModeToggle');
const fontSizeSlider = document.getElementById('fontSizeSlider');
const fontSizeValue = document.getElementById('fontSizeValue');


/**  
 * Loading settings from local storage
 */
/**
This script is learnt from a youtube tutorial
Reference
*
Author: Net Ninja (on YouTube),
Location: https://www.youtube.com/watch?v=ZSLWtdLLadk,
Accessed: 12/5/2025,
*/  
function loadSettings() {
  const saved = localStorage.getItem(SETTINGS_KEY);
  if (saved) {
    const settings = JSON.parse(saved); // parse saved settings
 
    if (typeof settings.darkMode === 'boolean') { // if dark mode is on
      darkModeToggle.checked = settings.darkMode; // set toggle indiator to on
      document.body.classList.toggle('dark-mode', settings.darkMode); // toggle dark mode for CSS
    }
    if (settings.fontSize) {
      fontSizeSlider.value = settings.fontSize; // font size changed according to ui slider
      fontSizeValue.textContent = settings.fontSize + '%'; // display a percentage
      document.documentElement.style.fontSize = settings.fontSize + '%'; // change size in CSs settings data
    }
  
  }
}

/**  
 * Saving settings to local storage
 */
/**
This script is learnt from a youtube tutorial
Reference
*
Author: Net Ninja (on YouTube),
Location: https://www.youtube.com/watch?v=ZSLWtdLLadk,
Accessed: 12/5/2025,
*/  
function saveSettings() {
  const settings = {
    // get current saved settings values
    darkMode: darkModeToggle.checked,
    fontSize: fontSizeSlider.value,
  };
  // set settings as current settings, in json local storage data, using the key
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  saveStatus.textContent = 'Settings saved!'; // indicate user
  setTimeout(() => { // clear the status message after 2s
    saveStatus.textContent = '';
  }, 2000);
}

// event listeners which save when they are changed

darkModeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode', darkModeToggle.checked); // check dark mode on click
  saveSettings();
});

fontSizeSlider.addEventListener('input', () => {
  const val = fontSizeSlider.value;  //  set temp value to slider value
  fontSizeValue.textContent = val + '%'; // change text display of font size percent
  document.documentElement.style.fontSize = val + '%';
  saveSettings();
});

// load saved settings on page load
window.addEventListener('DOMContentLoaded', loadSettings);
