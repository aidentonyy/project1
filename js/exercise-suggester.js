// wait for page DOM to load 
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('exerciseForm');
  const list = document.getElementById('exerciseList');
  let exerciseData = {};

  /**
  This script is learnt and used to fetch all exercises from the json file 
  Reference
  *
  Author: MDN Web Docs,
  Location: https://developer.mozilla.org/en-US/docs/Web/API/Response,
  Accessed: 27/5/2025,
  */
  fetch('json/exercises.json')
    .then(response => response.json()) 
    .then(data => {
      exerciseData = data;
    })
    // catch and presenterror if json file cannot be read and parsed
    .catch(err => { // 
      console.error('could not load exercises', err);
      list.innerHTML = '<li>error loading exercise list</li>';
    });

  // when the form is submitted
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    list.innerHTML = '';

    
    /**
    This script is learnt from two youtube tutorials for DOM traversal through maps and arrays
    Reference
    *
    Author: OpenJavaScript and Travery Media (on Youtube),
    Location: https://www.youtube.com/watch?v=TjpL8U_vxOo, https://www.youtube.com/watch?v=0ik6X4DJKCc,
    Accessed: 27/5/2025,
    */
    // get selected checked muscle group exercises
    const muscles = Array.from(document.querySelectorAll('input[name="muscle"]:checked')).map(m => m.value);
    // get selected checked equipment group exercises
    const equipment = Array.from(document.querySelectorAll('input[name="equipment"]:checked')).map(e => e.value);

    // show alert message if no muscles or equipment selected
    if (muscles.length === 0 || equipment.length === 0) {
      list.innerHTML = '<li>please choose a muscle group and equipment type</li>';
      return;
    }

    const matches = []; //  array of exercises matching muscle and equipment choices

    // go through selected muscles and find matching exercises
    muscles.forEach(muscle => {
      const items = exerciseData[muscle] || []; // go throught he array of exercises through muscles

        
      /**
      This script is learnt from two youtube tutorials for DOM traversal through maps and arrays
      Reference
      *
      Author: MDN Web Docs,
      Location: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
      Accessed: 27/5/2025,
      */
      items.forEach(ex => {
        if (equipment.includes(ex.type)) { 
          matches.push(`${ex.name} (${muscle}, ${ex.type})`);
        }
      });
    });

    // present results
    if (matches.length === 0) {
      list.innerHTML = '<li>no matching exercises found</li>';
     /**
      This code is based upon generative AI advice
      Accessed: 25/05/2025
      */
    } else {       
      matches.forEach(ex => {
        const li = document.createElement('li');
        li.textContent = ex;
        list.appendChild(li);
      });
    }
  });
});
