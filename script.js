document.addEventListener('DOMContentLoaded', () => {
  const spinWheel = document.getElementById('spinWheel')
  const spinBtn = document.getElementById('spinBtn')
  const text = document.getElementById('text')
  const optionsResult = document.getElementById('options')
  const optionInput = document.getElementById('optionInput')
  const addOptionBtn = document.getElementById('addOptionBtn')

  const spinValues = [
    { minDegree: 61, maxDegree: 90, value: '100$' },
    { minDegree: 31, maxDegree: 60, value: '200$' },
    { minDegree: 0, maxDegree: 30, value: '300$' },
    { minDegree: 331, maxDegree: 360, value: '400$' },
    { minDegree: 301, maxDegree: 330, value: '500$' },
    { minDegree: 271, maxDegree: 300, value: '600$' },
    { minDegree: 241, maxDegree: 270, value: '700$' },
    { minDegree: 211, maxDegree: 240, value: '800$' },
  ]

  const size = [10, 10, 10, 10, 10, 10, 10, 10]
  const spinColors = [
    '#565656',
    '#9D4343',
    '#565656',
    '#9D4343',
    '#565656',
    '#9D4343',
    '#565656',
    '#9D4343',
  ]
  let alternateColor = false
  let spinCount = 0
  let currentValue = null

  let spinChart = createSpinChart()

  function createSpinChart() {
    return new Chart(spinWheel, {
      plugins: [ChartDataLabels],
      type: 'pie',
      data: {
        labels: spinValues.map((option) => option.value),
        datasets: [
          {
            backgroundColor: spinColors,
            data: size,
          },
        ],
      },
      options: {
        responsive: true,
        animation: { duration: 0 },
        plugins: {
          tooltip: false,
          legend: {
            display: false,
          },
          datalabels: {
            rotation: 90,
            color: '#ffffff',
            formatter: (_, context) =>
              context.chart.data.labels[context.dataIndex],
            font: { size: 24 },
          },
        },
      },
    })
  }

  const addOptionToSpinWheel = (value) => {
    if (spinValues.length >= 8) {
      alert('The spin wheel is full with options!')
      return
    }

    const newOption = {
      minDegree: 0,
      maxDegree: 0,
      value: value,
    }

    spinValues.push(newOption)
    size.push(10)

    if (alternateColor) {
      spinColors.push('#9D4343')
    } else {
      spinColors.push('#565656')
    }
    alternateColor = !alternateColor

    spinChart.data.labels.push(value)
    spinChart.data.datasets[0].backgroundColor = spinColors
    spinChart.data.datasets[0].data = size

    spinChart.update()
    displayOptions()
  }

  const isValidInputValue = (value) => {
    return /^\d{1,4}$/.test(value)
  }

  addOptionBtn.addEventListener('click', () => {
    const newOptionValue = optionInput.value.trim()
    if (newOptionValue && isValidInputValue(newOptionValue)) {
      addOptionToSpinWheel(newOptionValue)
    } else {
      alert('Please enter a valid deposit!')
    }
    optionInput.value = ''
  })

  const deleteOptionFromSpinWheel = (index) => {
    spinValues.splice(index, 1)
    size.splice(index, 1)
    spinColors.splice(index, 1)

    spinChart.data.labels.splice(index, 1)
    spinChart.data.datasets[0].backgroundColor = spinColors
    spinChart.data.datasets[0].data = size

    spinChart.update()
    displayOptions()
  }

  const displayOptions = () => {
    optionsResult.innerHTML = ''
    spinValues.forEach((option, index) => {
      const optionElement = document.createElement('div')
      optionElement.classList.add('option')
      optionElement.textContent = option.value
      const deleteButton = document.createElement('button')
      deleteButton.classList.add('deleteButton')
      deleteButton.textContent = 'X'
      deleteButton.addEventListener('click', () => {
        deleteOptionFromSpinWheel(index)
      })
      optionElement.appendChild(deleteButton)
      optionsResult.appendChild(optionElement)
    })
  }

  const spin = () => {
    if (spinCount >= spinValues.length) {
      spinCount = 0
    }

    spinBtn.disabled = true
    let randomDegree = Math.floor(Math.random() * 360)

    let count = 0
    let resultValue = 101

    const spinWheelInterval = 10
    let rotationInterval

    rotationInterval = window.setInterval(() => {
      spinChart.options.rotation += resultValue
      spinChart.update()

      if (spinChart.options.rotation >= 360) {
        count += 1
        resultValue -= 5
        spinChart.options.rotation = 0
      }

      if (count > 15 && spinChart.options.rotation === randomDegree) {
        currentValue = getCurrentValueAtTop()
        clearInterval(rotationInterval)
        count = 0
        resultValue = 101
        spinCount++
        spinBtn.disabled = false

        generateValue(currentValue)
      }
    }, spinWheelInterval)
  }

  const generateValue = (value) => {
    text.innerHTML = `Previous prize : ${value}`
  }

  const getCurrentValueAtTop = () => {
    const rotation = spinChart.options.rotation
    const segmentAngle = 360 / spinValues.length
    const topSegmentIndex =
      Math.floor((360 - rotation + segmentAngle / 2) / segmentAngle) %
      spinValues.length
    return spinValues[topSegmentIndex].value
  }

  addOptionBtn.addEventListener('click', () => {
    const newOptionValue = optionInput.value.trim()
    if (newOptionValue) {
      addOptionToSpinWheel(newOptionValue)
    }
    optionInput.value = ''
  })

  spinBtn.addEventListener('click', spin)

  displayOptions()
})

// linkedin.com/in/frederik-rbnsk
// github.com/frdrk00