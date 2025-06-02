// get elements from the page
const dateInput = document.getElementById("date");
const weightInput = document.getElementById("weight");
const workoutInput = document.getElementById("workout");
const form = document.getElementById("logForm");
const chart = document.getElementById("weightChart");
const calendarDays = document.getElementById("calendarDays");
const monthYear = document.getElementById("monthYear");
const dayDetails = document.getElementById("dayDetails");
const deleteOptions = document.getElementById("deleteOptions");

// load logs from local storage or start with empty array
let logs = JSON.parse(localStorage.getItem("fitnessLogs")) || [];
let currentDate = new Date();

// set date input to today by default
dateInput.value = new Date().toISOString().split("T")[0];

// Helper function to format date as "2 June 2025"
function formatDatePretty(dateStr) {
  const date = new Date(dateStr);
  return `${date.getDate()} ${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`;
}

// when form is submitted, save log
form.addEventListener("submit", function(e) {
  e.preventDefault();

  const date = dateInput.value;
  if (!date) {
    alert("please select a date.");
    return;
  }

  const weight = weightInput.value ? parseFloat(weightInput.value) : null;
  const workout = workoutInput.value.trim() || null;

  if (weight === null && !workout) {
    alert("please enter either weight or workout.");
    return;
  }

  const existingIndex = logs.findIndex(log => log.date === date);

  if (existingIndex !== -1) {
    if (weight !== null) logs[existingIndex].weight = weight;
    if (workout) logs[existingIndex].workout = workout;
  } else {
    logs.push({ date, weight, workout });
  }

  localStorage.setItem("fitnessLogs", JSON.stringify(logs));

  weightInput.value = "";
  workoutInput.value = "";

  drawChart();
  buildCalendar();
});

function drawChart() {
  chart.innerHTML = "";

  const weightLogs = logs.filter(l => l.weight !== null).sort((a, b) => new Date(a.date) - new Date(b.date));

  const svgWidth = chart.clientWidth || 600;
  const svgHeight = chart.clientHeight || 200;
  const padding = 40;

  if (weightLogs.length < 2) {
    const svgNS = "http://www.w3.org/2000/svg";
    const msg = document.createElementNS(svgNS, "text");
    msg.setAttribute("x", svgWidth / 2);
    msg.setAttribute("y", svgHeight / 2);
    msg.setAttribute("text-anchor", "middle");
    msg.setAttribute("font-size", "16");
    msg.setAttribute("fill", "#888");
    msg.textContent = "add more weight logs to see a visualisation.";
    chart.appendChild(msg);
    return;
  }

  const minDate = new Date(weightLogs[0].date);
  const maxDate = new Date(weightLogs[weightLogs.length - 1].date);
  const minWeight = Math.floor(Math.min(...weightLogs.map(l => l.weight)));
  const maxWeight = Math.ceil(Math.max(...weightLogs.map(l => l.weight)));

  function getX(date) {
    return padding + ((new Date(date) - minDate) / (maxDate - minDate)) * (svgWidth - 2 * padding);
  }
  function getY(weight) {
    return svgHeight - padding - ((weight - minWeight) / (maxWeight - minWeight)) * (svgHeight - 2 * padding);
  }

  const svgNS = "http://www.w3.org/2000/svg";

  let line = document.createElementNS(svgNS, "line");
  line.setAttribute("x1", padding);
  line.setAttribute("y1", padding);
  line.setAttribute("x2", padding);
  line.setAttribute("y2", svgHeight - padding);
  line.setAttribute("stroke", "black");
  line.setAttribute("stroke-width", "2");
  chart.appendChild(line);

  line = document.createElementNS(svgNS, "line");
  line.setAttribute("x1", padding);
  line.setAttribute("y1", svgHeight - padding);
  line.setAttribute("x2", svgWidth - padding);
  line.setAttribute("y2", svgHeight - padding);
  line.setAttribute("stroke", "black");
  line.setAttribute("stroke-width", "2");
  chart.appendChild(line);

  const tickCount = 5;
  for (let i = 0; i <= tickCount; i++) {
    const weightVal = minWeight + ((maxWeight - minWeight) / tickCount) * i;
    const y = getY(weightVal);

    const tick = document.createElementNS(svgNS, "line");
    tick.setAttribute("x1", padding - 5);
    tick.setAttribute("y1", y);
    tick.setAttribute("x2", padding);
    tick.setAttribute("y2", y);
    tick.setAttribute("stroke", "black");
    tick.setAttribute("stroke-width", "1");
    chart.appendChild(tick);

    const label = document.createElementNS(svgNS, "text");
    label.setAttribute("x", padding - 10);
    label.setAttribute("y", y + 4);
    label.setAttribute("text-anchor", "end");
    label.setAttribute("font-size", "12");
    label.textContent = weightVal.toFixed(1);
    chart.appendChild(label);
  }

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

  let text = document.createElementNS(svgNS, "text");
  text.setAttribute("x", padding);
  text.setAttribute("y", svgHeight - padding + 20);
  text.setAttribute("font-size", "12");
  text.setAttribute("text-anchor", "start");
  text.textContent = formatDatePretty(weightLogs[0].date);
  chart.appendChild(text);

  text = document.createElementNS(svgNS, "text");
  text.setAttribute("x", svgWidth - padding);
  text.setAttribute("y", svgHeight - padding + 20);
  text.setAttribute("font-size", "12");
  text.setAttribute("text-anchor", "end");
  text.textContent = formatDatePretty(weightLogs[weightLogs.length - 1].date);
  chart.appendChild(text);
}

function buildCalendar() {
  calendarDays.innerHTML = "";
  dayDetails.textContent = "";
  deleteOptions.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  monthYear.textContent = currentDate.toLocaleString("default", { month: "long" }) + " " + year;

  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.classList.add("empty");
    calendarDays.appendChild(emptyCell);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = year + "-" + String(month + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0");
    const cell = document.createElement("div");
    cell.textContent = d;

    const entry = logs.find(l => l.date === dateStr);

    if (entry && (entry.workout || entry.weight !== null)) {
      cell.classList.add("has-entry");

      cell.addEventListener("click", function() {
        let details = formatDatePretty(dateStr) + ": ";
        if (entry.weight !== null) details += "weight: " + entry.weight + " kg ";
        if (entry.workout) details += "| workout: " + entry.workout;

        dayDetails.textContent = details;
        deleteOptions.innerHTML = "";

        if (entry.weight !== null) {
          const delWeightBtn = document.createElement("button");
          delWeightBtn.textContent = "delete weight";
          delWeightBtn.addEventListener("click", function() {
            entry.weight = null;
            if (!entry.workout) {
              logs = logs.filter(l => l.date !== dateStr);
            }
            localStorage.setItem("fitnessLogs", JSON.stringify(logs));
            buildCalendar();
            drawChart();
            dayDetails.textContent = "";
            deleteOptions.innerHTML = "";
          });
          deleteOptions.appendChild(delWeightBtn);
        }

        if (entry.workout) {
          const delWorkoutBtn = document.createElement("button");
          delWorkoutBtn.textContent = "delete workout";
          delWorkoutBtn.addEventListener("click", function() {
            entry.workout = null;
            if (entry.weight === null) {
              logs = logs.filter(l => l.date !== dateStr);
            }
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

function changeMonth(amount) {
  currentDate.setMonth(currentDate.getMonth() + amount);
  buildCalendar();
}

drawChart();
buildCalendar();

const prevBtn = document.getElementById("prevMonth");
if (prevBtn) {
  prevBtn.addEventListener("click", () => changeMonth(-1));
}

const nextBtn = document.getElementById("nextMonth");
if (nextBtn) {
  nextBtn.addEventListener("click", () => changeMonth(1));
}
