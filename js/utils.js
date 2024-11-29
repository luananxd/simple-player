export const getCoords = (element) => {
  const rect = element?.getBoundingClientRect()
  const coords = {
    top: rect?.y,
    bottom: rect?.y + rect?.height,
    left: rect?.x,
    right: rect?.x + rect?.width,
    width: rect?.width,
    height: rect?.height,
  }

  return coords
}

export const getFormattedSeconds = (time) => {
  const hours = Math.floor(time / 3600)
  const minutes = Math.floor((time - hours * 3600) / 60)
  const seconds = Math.floor((time - hours * 3600 - minutes * 60))

  return `${hours ? normalizeTimeValue(hours) + ':' : ''}${minutes ? normalizeTimeValue(minutes) + ':' : '00:'}${seconds ? normalizeTimeValue(seconds) : '00'}`
}

export const minmax = (value, min, max) => {
  return Math.min(Math.max(value, min), max)
}

export const normalizeTimeValue = (number) => {
  return number > 9 ? number : '0' + number
}

export const setCSS = (url) => {
  const head = document.querySelector('head')
  const link = document.createElement('link')
  link.href = url
  link.type = 'text/css';
  link.rel = 'stylesheet';
  head.append(link)
}