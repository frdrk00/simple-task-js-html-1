const labels = [];

function renderOptions() {
  const optionsElement = document.getElementById('options');
  optionsElement.innerHTML = '';

  labels.forEach(function(label, index) {
    const optionElement = document.createElement('div');
    optionElement.classList.add('option');

    const valueElement = document.createElement('span');
    valueElement.classList.add('option-value');
    valueElement.innerText = label;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.innerText = 'X';
    deleteButton.onclick = function() {
      deleteOption(index);
    };

    optionElement.appendChild(valueElement);
    optionElement.appendChild(deleteButton);
    optionsElement.appendChild(optionElement);
  });
}

function deleteOption(index) {
  labels.splice(index, 1);
  renderOptions();
}

function addButtonClick() {
  const input = document.getElementById('input');
  const value = input.value.trim();

  if (value !== '') {
    labels.push(value);
    input.value = '';
    renderOptions();

    // Update chart labels
    const inputLabels = document.getElementById("input-labels");
    inputLabels.value = labels.join(", ");
    const updateButton = document.getElementById("update-button");
    updateButton.click();
  }
}

const addButton = document.getElementById('add-button');
addButton.addEventListener('click', addButtonClick);

const spinnerElement = document.querySelector("#wheel");
const inputElement = document.getElementById("input");

function updateSpinner(value) {
  spinnerElement.textContent = value;
}

function handleInputChange() {
  updateSpinner(inputElement.value);
}

inputElement.addEventListener("input", handleInputChange);

addButton.addEventListener("click", function () {
  const value = inputElement.value.trim();
  if (value !== "") {
    updateSpinner(value);
  }
});

const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");



const data = [16, 16, 16, 16, 16, 16];
const pieColors = ["#9D4343", "#565656"];

const inputLabels = document.getElementById("input-labels");
const updateButton = document.getElementById("update-button");
 
const myChart = new Chart(wheel, {
  plugins: [ChartDataLabels],
  type: "pie",
  data: {
    labels: labels.length ? labels : ["20$", "111$", "64$", "58$", "48$", "37$"],
    datasets: [
      {
        backgroundColor: pieColors,
        data: data,
      },
    ],
  },
  options: {
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      tooltip: false,
      legend: { display: false },
      datalabels: {
        color: "#ffffff",
        formatter: (_, context) =>
          context.chart.data.labels[context.dataIndex],
        font: {
          size: 24,
          weight: "400",
          family: "Inter",
          lineHeight: "43.57px",
        },
      },
    },
  },
});

updateButton.addEventListener("click", () => {
  const inputLabelsValue = inputLabels.value;
  const labels = inputLabelsValue.split(",").map((label) => label.trim());
  myChart.data.labels = labels.length
    ? labels
    : ["raz$", "dva$", "tri$", "štyri$", "páť$", "šesť$"];
  myChart.update();
});

const rotationValues = [
  { minDegree: 0, maxDegree: 30, value: 20 },
  { minDegree: 31, maxDegree: 90, value: 130 },
  { minDegree: 91, maxDegree: 150, value: 650 },
  { minDegree: 151, maxDegree: 210, value: 57 },
  { minDegree: 211, maxDegree: 270, value: 45 },
  { minDegree: 271, maxDegree: 330, value: 35 },
  { minDegree: 331, maxDegree: 360, value: 28 },
];

//display value based on the randomAngle
const valueGenerator = (angleValue) => {
  for (let i of rotationValues) {
    //if the angleValue is between min and max then display it
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      finalValue.innerHTML = `<p>Previous prize : ${i.value}$</p>`;
      spinBtn.disabled = false;
      break;
    }
  }
};

//Spinner count
let count = 0;
//100 rotations for animation and last rotation for result
let resultValue = 101;
//Start spinning
spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;
  //Empty final value
/*   finalValue.innerHTML = `<p>Good Luck!</p>`; */
  //Generate random degrees to stop at
  let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
  //Interval for rotation animation
  let rotationInterval = window.setInterval(() => {
    //Set rotation for piechart
    /*
    Initially to make the piechart rotate faster we set resultValue to 101 so it rotates 101 degrees at a time and this reduces by 1 with every count. Eventually on last rotation we rotate by 1 degree at a time.
    */
    myChart.options.rotation = myChart.options.rotation + resultValue;
    //Update chart with new value;
    myChart.update();
    //If rotation>360 reset it back to 0
    if (myChart.options.rotation >= 360) {
      count += 1;
      resultValue -= 5;
      myChart.options.rotation = 0;
    } else if (count > 15 && myChart.options.rotation == randomDegree) {
      valueGenerator(randomDegree);
      clearInterval(rotationInterval);
      count = 0;
      resultValue = 101;
    }
  }, 10);
});




