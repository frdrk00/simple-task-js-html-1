let labels = []
let count = 0
let resultValue = 101
const data = [16, 16, 16, 16, 16, 16]
const pieColors = ['#9D4343', '#565656']
const rotationValues = [
  { minDegree: 0, maxDegree: 30, value: 2 },
  { minDegree: 31, maxDegree: 90, value: 1 },
  { minDegree: 91, maxDegree: 150, value: 6 },
  { minDegree: 151, maxDegree: 210, value: 5 },
  { minDegree: 211, maxDegree: 270, value: 4 },
  { minDegree: 271, maxDegree: 330, value: 3 },
  { minDegree: 331, maxDegree: 360, value: 2 },
]

const addButton = document.getElementById('add-button')
const spinBtn = document.getElementById('spin-btn')
const inputElement = document.getElementById('input')
const wheel = document.getElementById('wheel')
const spinnerElement = document.querySelector('#wheel')
const finalValue = document.getElementById('final-value')

function renderOptions() {
  const optionsElement = document.getElementById('options')
  optionsElement.innerHTML = ''

  labels.forEach(function (label, index) {
    const optionElement = document.createElement('div')
    optionElement.classList.add('option')

    const valueElement = document.createElement('span')
    valueElement.classList.add('option-value')
    valueElement.innerText = label

    const deleteButton = document.createElement('button')
    deleteButton.classList.add('delete-button')
    deleteButton.innerText = 'X'
    deleteButton.onclick = function () {
      deleteOption(index)
    }

    optionElement.appendChild(valueElement)
    optionElement.appendChild(deleteButton)
    optionsElement.appendChild(optionElement)
  })
}

function deleteOption(index) {
  labels.splice(index, 1)
  renderOptions()
}

function addButtonClick(e) {
  const input = document.getElementById('input')
  const value = input.value.trim()

  if (value !== '') {
    labels.push(value)
    input.value = ''
    renderOptions()

    const inputLabels = document.getElementById('input')
    inputLabels.value = labels.join(', ')

  }
}

addButton.addEventListener('click', addButtonClick)

function updateSpinner(value) {
  spinnerElement.textContent = value
}

function handleInputChange() {
  updateSpinner(inputElement.value)
}

inputElement.addEventListener('input', handleInputChange)
addButton.addEventListener('click', function () {
  const value = inputElement.value.trim()
  if (value !== '') {
    renderOptions()
    updateSpinner(value)
  }
})

const myChart = new Chart(wheel, {
  plugins: [ChartDataLabels],
  type: 'pie',
  data: {
    labels: [1, 2, 3, 4, 5, 6],
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
        color: '#ffffff',
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
        font: {
          size: 24,
          weight: '400',
          family: 'Inter',
          lineHeight: '43.57px',
        },
      },
    },
  },
})

function updateRotationValues() {
  for (let i = 0; i < rotationValues.length; i++) {
    rotationValues[i].value = labels[i] || 0
  }
}

addButton.addEventListener('click', () => {
  const inputLabelsValue = inputElement.value
  labels = inputLabelsValue.split(',').map((label) => label.trim())
  myChart.data.labels = labels.length ? labels : []

  updateRotationValues()
  inputElement.value = '';

  myChart.update()
})

const valueGenerator = (angleValue) => {
  for (let i of rotationValues) {
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      finalValue.innerHTML = `<p>Previous prize : ${i.value}</p>`
      spinBtn.disabled = false
      break
    }
  }
}

spinBtn.addEventListener('click', () => {
  spinBtn.disabled = true

  let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0)

  let rotationInterval = window.setInterval(() => {
    myChart.options.rotation = myChart.options.rotation + resultValue

    myChart.update()

    if (myChart.options.rotation >= 360) {
      count += 1
      resultValue -= 5
      myChart.options.rotation = 0
    } else if (count > 15 && myChart.options.rotation == randomDegree) {
      valueGenerator(randomDegree)
      clearInterval(rotationInterval)
      count = 0
      resultValue = 101
    }
  }, 10)
})
