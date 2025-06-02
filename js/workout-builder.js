// get elements from the page
const routineForm = document.getElementById('routine-form');
const exercisesContainer = document.getElementById('exercises-container');
const savedRoutinesList = document.getElementById('saved-routines');
const addExerciseBtn = document.getElementById('add-exercise');

let exercisesCount = 0; // count of exercises added
let editingIndex = null; // track if editing existing routine

// add a new exercise block to the form
function addExercise(data = {}) {
  exercisesCount++;
  const div = document.createElement('div');
  div.className = 'exercise-block';
  div.dataset.id = exercisesCount;

  // add inputs with default or passed values
  div.innerHTML = `
    <label>exercise name:
      <input type="text" name="exercise-name-${exercisesCount}" required value="${data.exerciseName || ''}" />
    </label>
    <label>sets:
      <input type="number" name="sets-${exercisesCount}" min="1" value="${data.sets || 3}" required />
    </label>
    <label>reps:
      <input type="number" name="reps-${exercisesCount}" min="1" value="${data.reps || 10}" required />
    </label>
    <button type="button" class="remove-exercise">remove</button>
  `;

  // remove exercise block when button clicked
  div.querySelector('.remove-exercise').addEventListener('click', () => div.remove());

  // add the new block to the container
  exercisesContainer.appendChild(div);
}

// save routine to local storage
function saveRoutine(e) {
  e.preventDefault();

  const routineName = document.getElementById('routine-name').value.trim();
  if (!routineName) {
    alert('please enter a routine name');
    return;
  }

  const blocks = exercisesContainer.querySelectorAll('.exercise-block');
  if (blocks.length === 0) {
    alert('add at least one exercise');
    return;
  }

  // get saved routines or empty array
  const routines = JSON.parse(localStorage.getItem('workoutRoutines') || '[]');

  // check if routine name already exists (except when editing the same)
  const nameExists = routines.some((r, idx) =>
    r.name.toLowerCase() === routineName.toLowerCase() && idx !== editingIndex
  );
  if (nameExists) {
    alert('a routine with this name already exists');
    return;
  }

  // gather exercises data from input fields
  const exercises = Array.from(blocks).map(block => {
    const id = block.dataset.id;
    return {
      exerciseName: block.querySelector(`input[name="exercise-name-${id}"]`).value.trim(),
      sets: +block.querySelector(`input[name="sets-${id}"]`).value,
      reps: +block.querySelector(`input[name="reps-${id}"]`).value
    };
  });

  const routine = { name: routineName, exercises };

  // update existing routine or add new
  if (editingIndex !== null) {
    routines[editingIndex] = routine;
    editingIndex = null;
  } else {
    routines.push(routine);
  }

  // save routines back to local storage
  localStorage.setItem('workoutRoutines', JSON.stringify(routines));

  // reset form and clear exercises
  routineForm.reset();
  exercisesContainer.innerHTML = '';
  exercisesCount = 0;

  // reload list of saved routines
  loadRoutines();
}

// load saved routines and show them in list
function loadRoutines() {
  savedRoutinesList.innerHTML = '';
  const routines = JSON.parse(localStorage.getItem('workoutRoutines') || '[]');

  if (routines.length === 0) {
    savedRoutinesList.innerHTML = '<li>no routines saved yet</li>';
    return;
  }

  // create list items for each routine
  routines.forEach((routine, index) => {
    const li = document.createElement('li');

    // hidden div to show exercises when toggled
    const detailDiv = document.createElement('div');
    detailDiv.className = 'routine-details';
    detailDiv.style.display = 'none';
    detailDiv.innerHTML = routine.exercises.map(ex =>
      `<div>${ex.exerciseName} - sets: ${ex.sets}, reps: ${ex.reps}</div>`
    ).join('');

    // routine name with toggle to show/hide exercises
    li.innerHTML = `
      <span class="routine-title">${routine.name}</span>
      <button class="edit-btn">edit</button>
      <button class="remove-btn">remove workout</button>
    `;

    li.querySelector('.routine-title').addEventListener('click', () => {
      detailDiv.style.display = detailDiv.style.display === 'none' ? 'block' : 'none';
    });

    // remove routine from storage
    li.querySelector('.remove-btn').addEventListener('click', () => {
      if (confirm(`delete "${routine.name}"?`)) {
        routines.splice(index, 1);
        localStorage.setItem('workoutRoutines', JSON.stringify(routines));
        loadRoutines();
      }
    });

    // edit routine: fill form with existing data
    li.querySelector('.edit-btn').addEventListener('click', () => {
      document.getElementById('routine-name').value = routine.name;
      exercisesContainer.innerHTML = '';
      exercisesCount = 0;
      routine.exercises.forEach(addExercise);
      editingIndex = index;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    li.appendChild(detailDiv);
    savedRoutinesList.appendChild(li);
  });
}

// add exercise button adds new exercise block
addExerciseBtn.addEventListener('click', () => addExercise());

// when form submitted, save routine
routineForm.addEventListener('submit', saveRoutine);

// load saved routines on page load
loadRoutines();
