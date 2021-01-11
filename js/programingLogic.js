//Scene
const gameboardEl = document.getElementById('gameboard')
//Buttons
const STONES = {
  sRed: document.getElementById('sRed'),
  sGreen: document.getElementById('sGreen'),
  sOrange: document.getElementById('sOrange'),
  sPurple: document.getElementById('sPurple'),
  sYellow: document.getElementById('sYellow'),
  sBlue: document.getElementById('sBlue'),
}
//Sounds
const SOUNDS = {
  sound_do: document.getElementById('sound_do'),
  sound_re: document.getElementById('sound_re'),
  sound_mi: document.getElementById('sound_mi'),
  sound_fa: document.getElementById('sound_fa'),
  sound_sol: document.getElementById('sound_sol'),
  sound_la: document.getElementById('sound_la'),
}
//Important
const FINAL_LEVEL = 5
const btnPlay = document.getElementById('btnPlay')
const TIME_PLAY = 500
const NEXT_LEVEL_PLAY = 800
//Builder
class Game {
  constructor({ timePlay = TIME_PLAY, nextLevelPlay = NEXT_LEVEL_PLAY } = {}) {
    this.stones = { ...STONES }
    this.sounds = { ...SOUNDS }
    this.timePlay = timePlay
    this.nextLevelPlay = nextLevelPlay
    this.level = 1
    this.turnOn = false
    this.addedEventsClick()
  }

  //Start the sequence
  start() {
    console.log('---------init: new Game')
    this.level = 1
    btnPlay.classList.add('hide')
    this.generateSequence()
    this.on()
    setTimeout(() => this.nextLevel(), this.timePlay)
  }
  // reset
  reset() {
    btnPlay.classList.remove('hide')
    console.log('---------reset')
  }

  //Generate random sequence
  generateSequence() {
    this.sequence = new Array(FINAL_LEVEL)
      .fill(0)
      .map((n) => Math.floor(Math.random() * 6))
  }

  nextLevel() {
    this.illuminateSequence()
    this.sublevel = 0
  }
  //Generate cursor
  on(state = true) {
    this.turnOn = state
    for (const color in this.stones) {
      if (state) {
        this.stones[color].style.cursor = 'not-allowed'
      } else {
        this.stones[color].style.cursor = ''
      }
    }
  }

  trasformNumberToColor(number) {
    switch (number) {
      case 0:
        return 'sRed'
      case 1:
        return 'sGreen'
      case 2:
        return 'sOrange'
      case 3:
        return 'sPurple'
      case 4:
        return 'sYellow'
      case 5:
        return 'sBlue'
    }
  }

  trasformColorToNumber(color) {
    switch (color) {
      case 'sRed':
        return 0
      case 'sGreen':
        return 1
      case 'sOrange':
        return 2
      case 'sPurple':
        return 3
      case 'sYellow':
        return 4
      case 'sBlue':
        return 5
    }
  }

  playSound(color) {
    switch (color) {
      case 'sRed':
        this.sounds.sound_do.play()
        break
      case 'sGreen':
        this.sounds.sound_re.play()
        break
      case 'sOrange':
        this.sounds.sound_sol.play()
        break
      case 'sPurple':
        this.sounds.sound_fa.play()
        break
      case 'sYellow':
        this.sounds.sound_mi.play()
        break
      case 'sBlue':
        this.sounds.sound_la.play()
        break
    }
  }
  illuminateSequence() {
    for (let i = 0; i < this.level; i++) {
      let color = this.trasformNumberToColor(this.sequence[i])

      setTimeout(() => {
        this.playSound(color)
        if (i === this.level - 1) {
          setTimeout(() => {
            this.on(false)
          }, this.timePlay)
        }
      }, this.timePlay * i)
      console.log(color)

      setTimeout(() => {
        this.illuminateColor(color)
        if (i === this.level - 1) {
          setTimeout(() => {
            this.on(false)
          }, this.timePlay)
        }
      }, this.timePlay * i)
    }
  }

  illuminateColor(color) {
    this.stones[color].classList.add('light')
    setTimeout(() => this.offColor(color), this.timePlay)
    console.log(`${color}light`)
  }
  offColor(color) {
    this.stones[color].classList.remove('light')
  }

  addedEventsClick() {
    gameboard.addEventListener(
      'click',
      (event) => {
        if (this.turnOn) {
          event.stopPropagation()
        }
      },
      true
    )
    for (const color in this.stones) {
      this.stones[color].addEventListener('click', (event) =>
        this.chooseColor(event)
      )
    }
  }
  removeEventsClick() {
    for (const color in this.stones) {
      this.stones[color].removeEventListener('click', (event) =>
        this.chooseColor(event)
      )
    }
  }

  chooseColor(ev) {
    const nameColor = ev.target.dataset.color
    const numberColor = this.trasformColorToNumber(nameColor)
    this.illuminateColor(nameColor)
    this.playSound(nameColor)

    if (numberColor === this.sequence[this.sublevel]) {
      this.sublevel++
      if (this.sublevel === this.level) {
        this.level++
        this.removeEventsClick()
        if (this.level === FINAL_LEVEL + 1) {
          this.wingame()
        } else {
          this.on()
          setTimeout(() => this.nextLevel(), this.nextLevelPlay)
        }
      }
    } else {
      this.gameOver()
    }
  }
  wingame() {
    swal('Eres una maquina😎', 'HAS GANADO', 'success').then(() => {
      this.reset()
    })
  }
  gameOver() {
    swal(
      'Eres un mortal cualquiera🤷‍♂️',
      `HAS PERDIDO EN EL NIVEL ${this.level}`,
      'error'
    ).then(() => {
      this.reset()
    })
  }
}
let game = new Game()
function playGame() {
  game.start()
}
