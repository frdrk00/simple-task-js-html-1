const pieColors = ['#565656', '#9D4343', '#565656', '#9D4343', '#565656', '#9D4343', '#565656', '#9D4343']

let labels = []
const defaultLabels = [100 + "$", 50 + "$", 0 + "$", 10 + "$", "present", 0 + "$" , 1000 + "$", 75 + "$"]
const data = [16, 16, 16, 16, 16, 16, 16, 16]
let count = 0
let resultValue = 101

const rotationValues = [
  { minDegree: 0, maxDegree: 30, value: 2 },
  { minDegree: 31, maxDegree: 90, value: 1 },
  { minDegree: 91, maxDegree: 150, value: 6 },
  { minDegree: 151, maxDegree: 210, value: 5 },
  { minDegree: 211, maxDegree: 270, value: 4 },
  { minDegree: 271, maxDegree: 330, value: 3 },
  { minDegree: 331, maxDegree: 360, value: 2 },
]

const wheel = document.getElementById('wheel')
const addButton = document.getElementById('add-button')
const spinBtn = document.getElementById('spin-btn')
const inputElement = document.getElementById('input')
const finalValue = document.getElementById('final-value')

const renderOptions = () => {
  const optionsElement = document.getElementById('options')
  optionsElement.innerHTML = ''

  labels.forEach((label, index) => {
    const optionElement = document.createElement('div')
    optionElement.classList.add('option')

    const valueElement = document.createElement('span')
    valueElement.classList.add('option-value')
    valueElement.innerText = label

    const deleteButton = document.createElement('button')
    deleteButton.classList.add('delete-button')
    deleteButton.innerText = 'X'
    deleteButton.onclick = () => {
      deleteOption(index)
    }

    optionElement.appendChild(valueElement)
    optionElement.appendChild(deleteButton)
    optionsElement.appendChild(optionElement)
  })
}

const deleteOption = (index) => {
  labels.splice(index, 1)
  renderOptions()
}

addButton.addEventListener('click', () => {
  const value = inputElement.value.trim()
  if (value !== '') {
    labels.push(value)
    inputElement.value = ''
    renderOptions()

    const inputLabels = document.getElementById('input')
    inputLabels.value = labels.join(', ')
  }
})

const updateSpinner = (value) => {
  wheel.textContent = value
}

const handleInputChange = () => {
  updateSpinner(inputElement.value)
}

inputElement.addEventListener('input', handleInputChange)

const myChart = new Chart(wheel, {
  plugins: [ChartDataLabels],
  type: 'pie',
  data: {
    labels: defaultLabels,
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
  for (const [i, label] of labels.entries()) {
    rotationValues[i].value = label || 0
  }
}

addButton.addEventListener('click', () => {
  const inputLabelsValue = inputElement.value
  labels = inputLabelsValue
    .split(',')
    .map((label) => label.trim())
    .filter((label) => label !== '')
  myChart.data.labels = labels.length ? labels : []

  updateRotationValues()
  inputElement.value = ''

  myChart.update()
})

const valueGenerator = (angleValue) => {
  for (const i of rotationValues) {
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
