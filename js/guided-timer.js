// get all the needed DOm timer elements
const exerciseTimeInput = document.getElementById('exercise-time');
const restTimeInput = document.getElementById('rest-time');
const setsInput = document.getElementById('sets-count');
const startButton = document.getElementById('start-btn');
const stopButton = document.getElementById('stop-btn');
const pauseButton = document.getElementById('pause-btn');
const currentTime = document.getElementById('timer-display');
const setStatus = document.getElementById('status-display');

// set DOM variables to control the timer
let intervalId = null; // gen ai advised
let currentTimerSet = 1;
let exercising = true;
let tonejsBeepPlayable = false;
let leftTime = 0;
let paused = false;
let Synth = null;



// try to load tone.js for the beep Synthesised sound
(async function () {
  try { // sends get request to tone.js library
    const res = await fetch("https://cdn.jsdelivr.net/npm/tone@14.7.77/build/Tone.min.js"); // gen ai advised use of tone.js
    const scriptText = await res.text(); // waits for response of the promise
    // Gen AI refined
    const script = document.createElement("script");
    script.textContent = scriptText;
    document.head.appendChild(script);

    await new Promise(r => setTimeout(r, 200));
    if (typeof Tone !== "undefined") {
      Synth = new Tone.Synth().toDestination();
      tonejsBeepPlayable = true;
    }
    //
  } catch (err) {
    console.warn("tone.js didn’t load");
  }
})();

 /**  
 * Makes a beep noise from the tone.js library
 */   
function beep() {
  try {
    if (tonejsBeepPlayable && Synth) {
      Synth.triggerAttackRelease("C5", "8n");
    } else {
      console.error("tone.js beep unavailable:", err);
    }
  } catch (err) {
    console.error("beep error:", err);
  }
}


 /**  
 * show time and status of timer screen
 */   
function showStatus() {
  currentTime.textContent = `${leftTime}s`;
  setStatus.textContent = exercising
    ? `Exercise Set ${currentTimerSet}`
    : `Rest After Set ${currentTimerSet}`;
}

 /**  
 * ticks time of timer
 */   
function tick() {
  if (leftTime > 0) {
    leftTime--;
    showStatus();
    return;
  }

  beep(); // plays the beep after every set or break reaches 0s

  /**
  This script is based off example code
  Reference
  *
  Author: JavaScript.Info
  Location: https://javascript.info/settimeout-setinterval
  Accessed: 21/5/2025,
  */
  if (exercising) {
    exercising = false; // switch to rest break from exercise
    leftTime = parseInt(restTimeInput.value, 10); // converts and sets remaining time on a base of 10
  } else {
    currentTimerSet++; // increase the set counter
    if (currentTimerSet > parseInt(setsInput.value, 10)) { // if all sets are done then
      // update session storage and ui to show timer is done and stopped 
      clearInterval(intervalId);
      intervalId = null;
      currentTime.textContent = 'done!';
      currentTime.classList.add('done');
      setStatus.textContent = '';
      startButton.disabled = true;
      pauseButton.disabled = true;
      stopButton.disabled = true;
      return;
    } else { // switch back to exercise timer if sets are left
      exercising = true;
      leftTime = parseInt(exerciseTimeInput.value, 10); 
    }
  }

  showStatus();
}

 /**  
 * starts the timer
 */   
function startTimer() {
  if (intervalId) return; // if sets rae remaining
  //starts from first set
  currentTimerSet = 1; 
  exercising = true;
  paused = false;
  leftTime = parseInt(exerciseTimeInput.value, 10);
  currentTime.classList.remove('done'); // remove indication that the previous set was done

  startButton.disabled = true;
  pauseButton.disabled = false;
  stopButton.disabled = false;
  pauseButton.textContent = 'pause'; 

  showStatus();
  intervalId = setInterval(tick, 1000); // restart the timer
}

 /**  
 * Stops all timer functions on the current run
 */   
function stopTimer() {
  clearInterval(intervalId);
  intervalId = null;
  paused = false;

  // sets ui to state of the timer being stopped
  currentTime.textContent = 'stopped';
  setStatus.textContent = '';
  currentTime.classList.remove('done');

  startButton.disabled = false;
  pauseButton.disabled = true;
  stopButton.disabled = true;
  pauseButton.textContent = 'pause';
}

 /**  
 * Pauses the timer when the pause button is pressed
 */   
function pauseTimer() {
  // if the timer is not running and nopt paused dont do anything
  if (!intervalId && !paused) return;

  // if the timer is paused
  if (!paused) {
    // stop the interval and set paused to true in the ui and status
    clearInterval(intervalId); 
    intervalId = null;
    paused = true;
    currentTime.textContent = `paused: ${leftTime}s`;
    pauseButton.textContent = 'resume';
  } else {
    // if the timer is currently paused after pause button press resume timer
    intervalId = setInterval(tick, 1000);
    paused = false;
    pauseButton.textContent = 'pause';
    showStatus();
  }
}

// timer button evenet listeners
startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
pauseButton.addEventListener('click', pauseTimer);
