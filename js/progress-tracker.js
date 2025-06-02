// get all elements and inputs on the page
const dateInput = document.getElementById("date");
const weightInput = document.getElementById("weight");
const workoutInput = document.getElementById("workout");
const form = document.getElementById("logForm");
const chart = document.getElementById("weightChart");
const calendarDays = document.getElementById("calendarDays");
const monthYear = document.getElementById("monthYear");
const dayDetails = document.getElementById("dayDetails");
const deleteOptions = document.getElementById("deleteOptions");

// load logs from local storage if none create empty array
let logs = JSON.parse(localStorage.getItem("fitnessLogs")) || []; // parse json existing fitness logs into array, or new array
let currentDate = new Date(); // set current date

// set default date input to todays date
dateInput.value = new Date().toISOString().split("T")[0];

/**  
 * makes the date easily readable rather than being numbers
 * @param {String} dateString date as a string
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.getDate()} ${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`; // set date format - gen ai generated
}

// when form is submitted, save log
form.addEventListener("submit", function(e) {
  e.preventDefault(); // dont let the default inputs be submitted

  // get date input and check if appropriate, alert if not
  const date = dateInput.value;
  if (!date) {
    alert("please select a date.");
    return;
  }

  // parse weight if not null, trims whitespace on worout input
  const weight = weightInput.value ? parseFloat(weightInput.value) : null;
  const workout = workoutInput.value.trim() || null;

  // does not allow empty submission, gives alert
  if (weight === null && !workout) {
    alert("please enter either weight or workout.");
    return;
  }

  
  const existingIndex = logs.findIndex(log => log.date === date);
  // checs if data already exists for the index  
  if (existingIndex !== -1) {
    if (weight !== null) logs[existingIndex].weight = weight; // replaces existing weight if so
    if (workout) logs[existingIndex].workout = workout; // replaces existing workout data if so
  } else {
    logs.push({ date, weight, workout }); // pushes input data
  }

  // saves log array to local storage as a json parsed string
  localStorage.setItem("fitnessLogs", JSON.stringify(logs));

  // clears the previous inputs
  weightInput.value = "";
  workoutInput.value = "";

  // redraws the chart and calendar for new data to come on
  drawChart();
  buildCalendar();
});

/**  
 * draws the vanilla js chart
 */
/**
This svg drawn chart is learnt from a youtube tutorial for react, and adapted to vanilla JS using gen ai guidance
Reference
*
Author: Headway,
Location: https://www.youtube.com/watch?v=PV2kFiVi5Ns,
Accessed: 22/5/2025,
*/  
function drawChart() {
  chart.innerHTML = ""; // clears the chart

  // sorts weights by ascending date
  const weightLogs = logs.filter(l => l.weight !== null).sort((a, b) => new Date(a.date) - new Date(b.date));

  //chooses height for the chart
  const svgWidth = chart.clientWidth || 600;
  const svgHeight = chart.clientHeight || 200;
  const padding = 40; // padding for the axes

  if (weightLogs.length < 2) { // if less than two weights are logged
    // dont display a chart and display a message
    const svgNS = "http://www.w3.org/2000/svg"; 
    const lackingWeightDataMessage = document.createElementNS(svgNS, "text");
    lackingWeightDataMessage.setAttribute("x", svgWidth / 2);
    lackingWeightDataMessage.setAttribute("y", svgHeight / 2);
    lackingWeightDataMessage.setAttribute("text-anchor", "middle");
    lackingWeightDataMessage.setAttribute("font-size", "16");
    lackingWeightDataMessage.setAttribute("fill", "#888");
    lackingWeightDataMessage.textContent = "Add more than two weight logs, to generate a weight progression chart.";
    chart.appendChild(lackingWeightDataMessage);
    return;
  }

  // get the smallest and largest dates to have as the two x axis labels 
  const minDate = new Date(weightLogs[0].date);
  const maxDate = new Date(weightLogs[weightLogs.length - 1].date);
  const minWeight = Math.floor(Math.min(...weightLogs.map(l => l.weight)));
  const maxWeight = Math.ceil(Math.max(...weightLogs.map(l => l.weight)));

  // functions to plot the date and weight to appropriate coordinates on the chart
  function getX(date) {
    return padding + ((new Date(date) - minDate) / (maxDate - minDate)) * (svgWidth - 2 * padding); // gen ai refined
  }
  function getY(weight) {
    return svgHeight - padding - ((weight - minWeight) / (maxWeight - minWeight)) * (svgHeight - 2 * padding); 
  }

  const svgNS = "http://www.w3.org/2000/svg"; // stores svg url for later elements using the DOM API

    //draw y axis
  let line = document.createElementNS(svgNS, "line");
  line.setAttribute("x1", padding);
  line.setAttribute("y1", padding);
  line.setAttribute("x2", padding);
  line.setAttribute("y2", svgHeight - padding);
  line.setAttribute("stroke", "black");
  line.setAttribute("stroke-width", "2");
  chart.appendChild(line);

  // draw x axis
  line = document.createElementNS(svgNS, "line");
  line.setAttribute("x1", padding);
  line.setAttribute("y1", svgHeight - padding);
  line.setAttribute("x2", svgWidth - padding);
  line.setAttribute("y2", svgHeight - padding);
  line.setAttribute("stroke", "black");
  line.setAttribute("stroke-width", "2");
  chart.appendChild(line);

  // draw y axis lines and 5 label intervals
  const intervalCount = 5;
  for (let i = 0; i <= intervalCount; i++) {
    const weightVal = minWeight + ((maxWeight - minWeight) / intervalCount) * i;
    const y = getY(weightVal);

    // the interval marks lines - gen ai advised
    const interval = document.createElementNS(svgNS, "line");
    interval.setAttribute("x1", padding - 5);
    interval.setAttribute("y1", y);
    interval.setAttribute("x2", padding);
    interval.setAttribute("y2", y);
    interval.setAttribute("stroke", "black");
    interval.setAttribute("stroke-width", "1");
    chart.appendChild(interval);

    //draw the labels for the ticks - gen ai advised
    const label = document.createElementNS(svgNS, "text");
    label.setAttribute("x", padding - 10);
    label.setAttribute("y", y + 4);
    label.setAttribute("text-anchor", "end");
    label.setAttribute("font-size", "12");
    label.textContent = weightVal.toFixed(1);
    chart.appendChild(label);
  }

   // connect each weight points - gen ai advised 
  for (let i = 0; i < weightLogs.length - 1; i++) {
    const x1 = getX(weightLogs[i].date);
    const y1 = getY(weightLogs[i].weight);
    const x2 = getX(weightLogs[i + 1].date);
    const y2 = getY(weightLogs[i + 1].weight);

    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "#567186");
    line.setAttribute("stroke-width", "2");
    chart.appendChild(line);
  }

  // draw circles on each weight
  weightLogs.forEach(log => {
    const cx = getX(log.date);
    const cy = getY(log.weight);


    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", 4);
    circle.setAttribute("fill", "#264964");
    chart.appendChild(circle);
  });

  // draw the first date of weight log
  let text = document.createElementNS(svgNS, "text");
  text.setAttribute("x", padding);
  text.setAttribute("y", svgHeight - padding + 20);
  text.setAttribute("font-size", "12");
  text.setAttribute("text-anchor", "start");
  text.textContent = formatDate(weightLogs[0].date);
  chart.appendChild(text);

  // draw the last date of weight log
  text = document.createElementNS(svgNS, "text");
  text.setAttribute("x", svgWidth - padding);
  text.setAttribute("y", svgHeight - padding + 20);
  text.setAttribute("font-size", "12");
  text.setAttribute("text-anchor", "end");
  text.textContent = formatDate(weightLogs[weightLogs.length - 1].date);
  chart.appendChild(text);
}


/**  
 * builds a monthly calendar 
 */
/**
This svg drawn chart is learnt from a youtube tutorial 
Reference
*
Author: Code Steppe (on YouTube),
Location: https://www.youtube.com/watch?v=6W95n9a-5q4,
Accessed: 24/5/2025,
*/  
function buildCalendar() {
  // clear the current calendar to refresh
  calendarDays.innerHTML = "";
  dayDetails.textContent = "";
  

  const year = currentDate.getFullYear(); // get a year from the current date
  const month = currentDate.getMonth(); // get a month from the current date

  const firstDay = new Date(year, month, 1).getDay(); // first dat of the current month 
  const daysInMonthNum = new Date(year, month + 1, 0).getDate(); // get monthChange of days in the current month

  monthYear.textContent = currentDate.toLocaleString("default", { month: "long" }) + " " + year; // set the title for current date

 // create empty divisions for the first days of motnhs to be in the right grid position - gen ai refined
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.classList.add("empty");
    calendarDays.appendChild(emptyCell);
  }

   // create calendar grid for currently displayed month - tutorial followed
  for (let d = 1; d <= daysInMonthNum; d++) {
    const dateString = year + "-" + String(month + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0");
    const cell = document.createElement("div");
    cell.textContent = d;

    // find entry for the first date of the current month
    const entry = logs.find(l => l.date === dateString);

    if (entry && (entry.workout || entry.weight !== null)) {
      cell.classList.add("has-entry");

      // if there is an entry add listeners for interaction
      cell.addEventListener("click", function() {
        let details = formatDate(dateString) + ": ";
        if (entry.weight !== null) details += "weight: " + entry.weight + " kg ";
        if (entry.workout) details += "| workout: " + entry.workout;

        dayDetails.textContent = details;
        deleteOptions.innerHTML = "";

        // delete button for weight
        if (entry.weight !== null) {
          // deletes current weight log for the chosen date
          const delWeightBtn = document.createElement("button");
          delWeightBtn.textContent = "delete weight";
          delWeightBtn.addEventListener("click", function() { // event listener for delete click
            entry.weight = null; 
            if (!entry.workout) { // if no workout remove log 
              logs = logs.filter(l => l.date !== dateString);
            }
            localStorage.setItem("fitnessLogs", JSON.stringify(logs)); // clears log
            buildCalendar();
            drawChart();
            dayDetails.textContent = "";
            deleteOptions.innerHTML = "";
          });
          deleteOptions.appendChild(delWeightBtn);
        }

        // workout delete button
        if (entry.workout) {
          const delWorkoutBtn = document.createElement("button");
          // checks for wokrout log on current date
          delWorkoutBtn.textContent = "delete workout";
          delWorkoutBtn.addEventListener("click", function() {
            entry.workout = null;
            if (entry.weight === null) { // if weight doesnt exist for date
              logs = logs.filter(l => l.date !== dateString);
            } // delete log completely
            localStorage.setItem("fitnessLogs", JSON.stringify(logs));
            buildCalendar();
            drawChart();
            dayDetails.textContent = "";
            deleteOptions.innerHTML = "";
          });
          deleteOptions.appendChild(delWorkoutBtn);
        }
      });
    }

    calendarDays.appendChild(cell);
  }
}

/**  
 * draws the vanilla js chart
 * @param {Number} monthChange change in month from current
 */
function changeMonth(monthChange) {
  currentDate.setMonth(currentDate.getMonth() + monthChange); // increments or decrements month
  buildCalendar(); // refreshes calendar
}

// refreshes chart and calendar
drawChart();
buildCalendar();

// button for going to previous month
const prevBtn = document.getElementById("prevMonth");
if (prevBtn) {
  prevBtn.addEventListener("click", () => changeMonth(-1));
}

// button for going to next month
const nextBtn = document.getElementById("nextMonth");
if (nextBtn) {
  nextBtn.addEventListener("click", () => changeMonth(1));
}
