const getCoords = (element) => {
  const rect = element.getBoundingClientRect()
  const coords = {
    top: rect.y,
    bottom: rect.y + rect.height,
    left: rect.x,
    right: rect.x + rect.width,
    width: rect.width,
    height: rect.height,
  }

  return coords
}

const minmax = (value, min, max) => {
  return Math.min(Math.max(value, min), max)
}

const playerSource = document.querySelector('#player video')
const playerTime = document.querySelector('#player .player__time')
const playerLine = document.querySelector('#player .player__line')
const playerProgress = document.querySelector('#player .player__progress')
const playerHandle = document.querySelector('#player .player__handle')

const playerLineCoords = getCoords(playerLine)
let isMouseDown = false
let progress = 0
let currentTime = 0
let totalDuration = 0

playerSource.addEventListener('loadeddata', (event) => {
  totalDuration = Math.round(event.target.duration)
  setPlayerText()
})

playerHandle.addEventListener('mousedown', (event) => {
  event.preventDefault()
  isMouseDown = true
})

document.addEventListener('mouseup', () => {
  isMouseDown = false
  setCurrentTime()
  setPlayerText()
})

document.addEventListener('mousemove', (event) => {
  if(!isMouseDown) return

  const cursorX = event.clientX
  const result = minmax((cursorX - playerLineCoords.left) / playerLineCoords.width, 0, 1)
  progress = result
  playerProgress.style.width = progress * 100 + '%'
  playerHandle.style.left = progress * 100 + '%'
})

const setCurrentTime = () => {
  currentTime = Math.round(totalDuration * progress)
  playerSource.currentTime = currentTime
}

const setPlayerText = () => {
  playerTime.textContent = `${getCurrentTimeText()}/${getDurationText()}`
}

const getCurrentTimeText = () => {
  const hours = Math.floor(currentTime / 3600)
  const minutes = Math.floor((currentTime - hours * 3600) / 60)
  const seconds = Math.floor((currentTime - hours * 3600 - minutes * 60))

  return `${hours ? normalizeTime(hours) + ':' : ''}${minutes ? normalizeTime(minutes) + ':' : '00:'}${seconds ? normalizeTime(seconds) : '00'}`
}

const getDurationText = () => {
  const hours = Math.floor(totalDuration / 3600)
  const minutes = Math.floor((totalDuration - hours * 3600) / 60)
  const seconds = Math.floor((totalDuration - hours * 3600 - minutes * 60))

  return `${hours ? normalizeTime(hours) + ':' : ''}${minutes ? normalizeTime(minutes) + ':' : '00:'}${seconds ? normalizeTime(seconds) : '00'}`
}

const normalizeTime = (number) => {
  return number > 9 ? number : '0' + number
}