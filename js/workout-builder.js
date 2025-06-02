// get form and other elements 
const routineForm = document.getElementById('routine-form');
const exercisesContainer = document.getElementById('exercises-container');
const savedRoutines = document.getElementById('saved-routines');
const addExerciseButton = document.getElementById('add-exercise');

let exercisesCount = 0; // count of exercises added
let editingRoutine = null; // check which existing routine is being edited

/**  
 * Function for adding exercises
 */
function addExercise(data = {}) {
  exercisesCount++;
  const div = document.createElement('div'); // creates new block 
  div.className = 'exercise-block';
  div.dataset.id = exercisesCount;

  // add inputs with default or passed values  - gen ai refined code
  div.innerHTML = `
    <label>exercise name:
      <input type="text" name="exercise-name-${exercisesCount}" required value="${data.exerciseName || ''}" />
    </label>
    <label>sets:
      <input type="number" name="sets-${exercisesCount}" min="1" value="${data.sets || 3}" required />
    </label>
    <label>reps:
      <input type="number" name="reps-${exercisesCount}" min="1" value="${data.reps || 8}" required />
    </label>
    <button type="button" class="remove-exercise">remove</button>
  `;

  // remove exercise block when added clicked
  div.querySelector('.remove-exercise').addEventListener('click', () => div.remove());

  // add the new block to the container
  exercisesContainer.appendChild(div);
}

/**
 * Saves the current added routine to local storage
 * @param {Event} e - event of the form being submitted
 */
function saveRoutine(e) {
  e.preventDefault();

  const routineName = document.getElementById('routine-name').value.trim(); // trims white space in routine name
  if (!routineName) {
    alert('please enter a routine name'); // alerts if no name
    return;
  }

  const blocks = exercisesContainer.querySelectorAll('.exercise-block'); // checks if a min of one exercise is added
  if (blocks.length === 0) {
    alert('add at least one exercise');
    return;
  }

  // get saved, parsed routines from local storage or empty array
  const routines = JSON.parse(localStorage.getItem('workoutRoutines') || '[]');

  // check if routine name already exists but not when editing the same routine
  const nameExists = routines.some((r, idx) =>
    r.name.toLowerCase() === routineName.toLowerCase() && idx !== editingRoutine
  );
  if (nameExists) {
    alert('a routine with this name already exists'); // alerts of existing routine name
    return;
  }

  // gather exercises data from input fields
  const exercises = Array.from(blocks).map(block => {
    const id = block.dataset.id;
    return {
      // returns exercise name, sets, and reps
      exerciseName: block.querySelector(`input[name="exercise-name-${id}"]`).value.trim(),
      sets: +block.querySelector(`input[name="sets-${id}"]`).value,
      reps: +block.querySelector(`input[name="reps-${id}"]`).value
    };
  });

  const routine = { name: routineName, exercises };

  // update existing routine or add new
  if (editingRoutine !== null) {
    routines[editingRoutine] = routine;
    editingRoutine = null;
  } else {
    routines.push(routine);
  }

  // save routines back to local storage as json
  localStorage.setItem('workoutRoutines', JSON.stringify(routines));

  // reset form and clear exercises
  routineForm.reset();
  exercisesContainer.innerHTML = '';
  exercisesCount = 0;

  // reload list of saved routines
  loadRoutines();
}

/**
 * load saved routines
 */
function loadRoutines() {
  savedRoutines.innerHTML = '';
  const routines = JSON.parse(localStorage.getItem('workoutRoutines') || '[]');

  if (routines.length === 0) {
    savedRoutines.innerHTML = '<li>no routines saved yet</li>';
    return;
  }

  // create list items for each routine
  routines.forEach((routine, index) => {
    const li = document.createElement('li');

    // hidden div to show exercises when clcied
    const detailDiv = document.createElement('div');
    detailDiv.className = 'routine-details';
    detailDiv.style.display = 'none';
    detailDiv.innerHTML = routine.exercises.map(ex =>
      `<div>${ex.exerciseName} - sets: ${ex.sets}, reps: ${ex.reps}</div>`
    ).join('');

    // routine name with toggle to show/hide exercises
    li.innerHTML = `
      <span class="routine-title" tabindex="0">${routine.name}</span>
      <button class="edit-btn">edit</button>
      <button class="remove-btn">remove workout</button>
    `;

    li.querySelector('.routine-title').addEventListener('click', () => {
      detailDiv.style.display = detailDiv.style.display === 'none' ? 'block' : 'none';
    });

    // remove routine from local storage
    li.querySelector('.remove-btn').addEventListener('click', () => {
      if (confirm(`delete "${routine.name}"?`)) {
        routines.splice(index, 1);
        localStorage.setItem('workoutRoutines', JSON.stringify(routines));
        loadRoutines();
      }
    });

    // fill form with existing routine data for editing
    li.querySelector('.edit-btn').addEventListener('click', () => {
      document.getElementById('routine-name').value = routine.name;
      exercisesContainer.innerHTML = '';
      exercisesCount = 0;
      routine.exercises.forEach(addExercise);
      editingRoutine = index;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    li.appendChild(detailDiv);
    savedRoutines.appendChild(li);
  });
}

// add exercise button adds new exercise block
addExerciseButton.addEventListener('click', () => addExercise());

routineForm.addEventListener('submit', saveRoutine); // when form submitted, save routine


loadRoutines(); // load saved routines on page load

