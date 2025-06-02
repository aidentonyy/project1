// get all the needed elements
const exerciseTimeInput = document.getElementById('exercise-time');
const restTimeInput = document.getElementById('rest-time');
const setsCountInput = document.getElementById('sets-count');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const pauseBtn = document.getElementById('pause-btn');
const timerDisplay = document.getElementById('timer-display');
const statusDisplay = document.getElementById('status-display');

// basic variables to control the timer
let intervalId = null;
let currentSet = 1;
let isExercise = true;
let remainingTime = 0;
let isPaused = false;
let synth = null;
let toneReady = false;

// basic beep sound fallback
const fallbackBeep = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQgAAA==");

// try to load tone.js for nicer sounds
(async function () {
  try {
    const res = await fetch("https://cdn.jsdelivr.net/npm/tone@14.7.77/build/Tone.min.js");
    const scriptText = await res.text();
    const script = document.createElement("script");
    script.textContent = scriptText;
    document.head.appendChild(script);

    await new Promise(r => setTimeout(r, 200));
    if (typeof Tone !== "undefined") {
      synth = new Tone.Synth().toDestination();
      toneReady = true;
    }
  } catch (err) {
    console.warn("tone.js didn’t load, using basic beep");
  }
})();

// make a beep sound
function beep() {
  try {
    if (toneReady && synth) {
      synth.triggerAttackRelease("C5", "8n");
    } else {
      fallbackBeep.currentTime = 0;
      fallbackBeep.play();
    }
  } catch (err) {
    console.error("beep error:", err);
  }
}

// show time and status on screen
function showStatus() {
  timerDisplay.textContent = `${remainingTime}s`;
  statusDisplay.textContent = isExercise
    ? `Exercise Set ${currentSet}`
    : `Rest After Set ${currentSet}`;
}

// what happens every second
function tick() {
  if (remainingTime > 0) {
    remainingTime--;
    showStatus();
    return;
  }

  beep();

  if (isExercise) {
    isExercise = false;
    remainingTime = parseInt(restTimeInput.value, 10);
  } else {
    currentSet++;
    if (currentSet > parseInt(setsCountInput.value, 10)) {
      clearInterval(intervalId);
      intervalId = null;
      timerDisplay.textContent = 'done!';
      timerDisplay.classList.add('done');
      statusDisplay.textContent = '';
      startBtn.disabled = true;
      pauseBtn.disabled = true;
      stopBtn.disabled = true;
      return;
    } else {
      isExercise = true;
      remainingTime = parseInt(exerciseTimeInput.value, 10);
    }
  }

  showStatus();
}

// start the timer
function startTimer() {
  if (intervalId) return;

  currentSet = 1;
  isExercise = true;
  isPaused = false;
  remainingTime = parseInt(exerciseTimeInput.value, 10);
  timerDisplay.classList.remove('done');

  startBtn.disabled = true;
  pauseBtn.disabled = false;
  stopBtn.disabled = false;
  pauseBtn.textContent = 'pause';

  showStatus();
  intervalId = setInterval(tick, 1000);
}

// stop everything
function stopTimer() {
  clearInterval(intervalId);
  intervalId = null;
  isPaused = false;

  timerDisplay.textContent = 'stopped';
  statusDisplay.textContent = '';
  timerDisplay.classList.remove('done');

  startBtn.disabled = false;
  pauseBtn.disabled = true;
  stopBtn.disabled = true;
  pauseBtn.textContent = 'pause';
}

// pause and resume
function pauseTimer() {
  if (!intervalId && !isPaused) return;

  if (!isPaused) {
    clearInterval(intervalId);
    intervalId = null;
    isPaused = true;
    timerDisplay.textContent = `paused: ${remainingTime}s`;
    pauseBtn.textContent = 'resume';
  } else {
    intervalId = setInterval(tick, 1000);
    isPaused = false;
    pauseBtn.textContent = 'pause';
    showStatus();
  }
}

// button listeners
startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
pauseBtn.addEventListener('click', pauseTimer);
