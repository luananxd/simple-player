import { minmax, setCSS, getCoords, getFormattedSeconds } from "./utils.js"
import Icons from "./icons.js"

class Player {
  constructor(data) {
    this.source = data.source
    
    this._isMouseDown = false
    this._container = document.querySelector(data.selector)
    this._markdown = `
    <div class="simple-player">
      <video src="${this.source}"></video>
      <div class="simple-player__controls">
        <div class="simple-player__line">
          <div class="simple-player__handle" draggable="false"></div>
          <div class="simple-player__progress"></div>
        </div>
        <div class="simple-player__time">--:--/--:--</div>
        <div class="simple-player__settings">
          <button type="button" class="simple-player__button">
            ${Icons.settings}
          </button>
          <button type="button" class="simple-player__button">
            ${Icons.fullscreen}
          </button>
        </div>
      </div>
    </div>
    `

    this._elements = {
      source: null,
      line: null,
      progress: null,
      time: null,
      handler: null,
    }
    this._state = {
      isMouseDown: false,
      duration: 0,
      currentTime: 0,
      progress: 0,
      playerLineCoords: null,
    }
  }

  // Handlers

  _handleMouseDown(event) {
    event.preventDefault()
    this._state.isMouseDown = true
  }

  _handleMouseUp() {
    this._state.isMouseDown = false
    this._setCurrentTime()
    this._setPlayerText()
  }

  _handleMouseMove(event) {
    if(!this._state.isMouseDown) return
    this._state.playerLineCoords = this._state.playerLineCoords ?? getCoords(this._elements.line)
    const cursorX = event.clientX
    this._setProgress(cursorX)
  }

  _handleLineClick(event) {
    this._state.playerLineCoords = this._state.playerLineCoords ?? getCoords(this._elements.line)
    const cursorX = event.clientX
    this._setProgress(cursorX)
    this._setCurrentTime()
    this._setPlayerText()
  }

  // Set data

  _setProgress(newPosition) {
    const result = minmax((newPosition - this._state.playerLineCoords?.left) / this._state.playerLineCoords?.width, 0, 1)
    this._state.progress = result

    this._elements.progress.style.width = this._state.progress * 100 + '%'
    this._elements.handler.style.left = this._state.progress * 100 + '%'
  }

  _setCurrentTime() {
    this._state.currentTime = Math.round(this._state.duration * this._state.progress)
    this._elements.source.currentTime = this._state.currentTime
  }

  _setPlayerText() {
    if(!this._elements.time) return
    this._elements.time.textContent = `${getFormattedSeconds(this._state.currentTime)}/${getFormattedSeconds(this._state.duration)}`
  }

  _loadVideoData() {
    this._elements.source?.addEventListener('loadeddata', (event) => {
      this._state.duration = Math.round(event.target?.duration)
      this._setPlayerText()
    })
  }

  _setElements() {
    this._elements.source = this._container?.querySelector('video')
    this._elements.handler = this._container?.querySelector('.simple-player__handle')
    this._elements.line = this._container?.querySelector('.simple-player__line')
    this._elements.progress = this._container?.querySelector('.simple-player__progress')
    this._elements.time = this._container?.querySelector('.simple-player__time')
  }

  _setListeners() {
    this._elements.handler?.addEventListener('mousedown', this._handleMouseDown.bind(this))
    this._elements.line?.addEventListener('click', this._handleLineClick.bind(this))
    document.addEventListener('mouseup', this._handleMouseUp.bind(this))
    document.addEventListener('mousemove', this._handleMouseMove.bind(this))
  }

  // Public

  init() {
    setCSS('./css/style.css')
    this._container.innerHTML = this._markdown
    this._setElements()
    this._loadVideoData()
    this._setListeners()
  }
}

const player = new Player({
  selector: '#test',
  source: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
})

player.init()
