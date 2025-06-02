// wait for the page to load
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('exerciseForm');
  const list = document.getElementById('exerciseList');
  let exerciseData = {};

  // load exercises from json file
  fetch('exercises/exercises.json')
    .then(res => res.json())
    .then(data => {
      exerciseData = data;
    })
    .catch(err => {
      console.error('could not load exercises', err);
      list.innerHTML = '<li>error loading exercise list</li>';
    });

  // when the form is submitted
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    list.innerHTML = '';

    // get selected muscle groups and equipment
    const muscles = Array.from(document.querySelectorAll('input[name="muscle"]:checked')).map(m => m.value);
    const equipment = Array.from(document.querySelectorAll('input[name="equipment"]:checked')).map(e => e.value);

    // show message if nothing selected
    if (muscles.length === 0 || equipment.length === 0) {
      list.innerHTML = '<li>please choose a muscle group and equipment type</li>';
      return;
    }

    const matches = [];

    // go through selected muscles and find matching exercises
    muscles.forEach(muscle => {
      const items = exerciseData[muscle] || [];

      items.forEach(ex => {
        if (equipment.includes(ex.type)) {
          matches.push(`${ex.name} (${muscle}, ${ex.type})`);
        }
      });
    });

    // show results
    if (matches.length === 0) {
      list.innerHTML = '<li>no matching exercises found</li>';
    } else {
      matches.forEach(ex => {
        const li = document.createElement('li');
        li.textContent = ex;
        list.appendChild(li);
      });
    }
  });
});
