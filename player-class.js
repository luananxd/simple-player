class Player {
  constructor(data) {
    this.source = data.source
    this.duration = null
    this.currentTime = null

    this.container = document.querySelector(data.selector)
    this.markdown = `
      <video src="${this.source}"></video>
      <div class="player__controls">
        <div class="player__line">
          <div class="player__handle" draggable="false"></div>
          <div class="player__progress"></div>
        </div>
        <div class="player__time">--:--/--:--</div>
        <div class="player__settings">
          <button type="button" class="player__button">
            <img src="./assets/gear.svg" width="20" height="20">
          </button>
          <button type="button" class="player__button">
            <img src="./assets/fullscreen.svg" width="18" height="18">
          </button>
        </div>
      </div>
    `
  }

  _loadVideoData() {
    playerSource = this.container.querySelector('video')
    playerSource.addEventListener('loadeddata', (event) => {
      totalDuration = Math.round(event.target.duration)
      setPlayerText()
    })
  }

  _setPlayerTimeText() {

  }

  init() {
    this.container.classList.add('player')
    this.container.innerHTML = this.markdown
    this._loadVideoData()
  }
}

const player = new Player({
  selector: '#test',
  source: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
})

player.init()
