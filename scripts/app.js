const ROWS = 20
const COLS = 10
const blockSize = 30
const whiteColorIndex = 7

const colorMapping = [
    'red',
    'orange',
    'green',
    'purple',
    'blue',
    'cyan',
    'yellow',
    'white',
]

const brickLayout = [
    [
      [
        [1, 7, 7],
        [1, 1, 1],
        [7, 7, 7],
      ],
      [
        [7, 1, 1],
        [7, 1, 7],
        [7, 1, 7],
      ],
      [
        [7, 7, 7],
        [1, 1, 1],
        [7, 7, 1],
      ],
      [
        [7, 1, 7],
        [7, 1, 7],
        [1, 1, 7],
      ],
    ],
    [
      [
        [7, 1, 7],
        [7, 1, 7],
        [7, 1, 1],
      ],
      [
        [7, 7, 7],
        [1, 1, 1],
        [1, 7, 7],
      ],
      [
        [1, 1, 7],
        [7, 1, 7],
        [7, 1, 7],
      ],
      [
        [7, 7, 1],
        [1, 1, 1],
        [7, 7, 7],
      ],
    ],
    [
      [
        [1, 7, 7],
        [1, 1, 7],
        [7, 1, 7],
      ],
      [
        [7, 1, 1],
        [1, 1, 7],
        [7, 7, 7],
      ],
      [
        [7, 1, 7],
        [7, 1, 1],
        [7, 7, 1],
      ],
      [
        [7, 7, 7],
        [7, 1, 1],
        [1, 1, 7],
      ],
    ],
    [
      [
        [7, 1, 7],
        [1, 1, 7],
        [1, 7, 7],
      ],
      [
        [1, 1, 7],
        [7, 1, 1],
        [7, 7, 7],
      ],
      [
        [7, 7, 1],
        [7, 1, 1],
        [7, 1, 7],
      ],
      [
        [7, 7, 7],
        [1, 1, 7],
        [7, 1, 1],
      ],
    ],
    [
      [
        [7, 7, 7, 7],
        [1, 1, 1, 1],
        [7, 7, 7, 7],
        [7, 7, 7, 7],
      ],
      [
        [7, 7, 1, 7],
        [7, 7, 1, 7],
        [7, 7, 1, 7],
        [7, 7, 1, 7],
      ],
      [
        [7, 7, 7, 7],
        [7, 7, 7, 7],
        [1, 1, 1, 1],
        [7, 7, 7, 7],
      ],
      [
        [7, 1, 7, 7],
        [7, 1, 7, 7],
        [7, 1, 7, 7],
        [7, 1, 7, 7],
      ],
    ],
    [
      [
        [7, 7, 7, 7],
        [7, 1, 1, 7],
        [7, 1, 1, 7],
        [7, 7, 7, 7],
      ],
      [
        [7, 7, 7, 7],
        [7, 1, 1, 7],
        [7, 1, 1, 7],
        [7, 7, 7, 7],
      ],
      [
        [7, 7, 7, 7],
        [7, 1, 1, 7],
        [7, 1, 1, 7],
        [7, 7, 7, 7],
      ],
      [
        [7, 7, 7, 7],
        [7, 1, 1, 7],
        [7, 1, 1, 7],
        [7, 7, 7, 7],
      ],
    ],
    [
      [
        [7, 1, 7],
        [1, 1, 1],
        [7, 7, 7],
      ],
      [
        [7, 1, 7],
        [7, 1, 1],
        [7, 1, 7],
      ],
      [
        [7, 7, 7],
        [1, 1, 1],
        [7, 1, 7],
      ],
      [
        [7, 1, 7],
        [1, 1, 7],
        [7, 1, 7],
      ],
    ],
]

const playBtn = document.querySelector('.play-btn')
const alertGameOver = document.querySelector('.alert')
const turnOnVol = document.querySelector('.turn-on')
const turnOffVol = document.querySelector('.turn-off')

const canvas = document.getElementById('board')
const ctx = canvas.getContext('2d')

ctx.canvas.width = COLS*blockSize
ctx.canvas.height = ROWS*blockSize

class Board {
    constructor() {
        this.ctx = ctx
        this.score = 0
        this.gameOver = false
        this.isPlaying = false
        this.grid = this.generateWhiteBoard()
        this.clearAudio = new Audio('../sounds/clear.mp3')
        this.gameOverAudio = new Audio('../sounds/that-bai.mp3')
        this.brgAudio = new Audio('../sounds/nhac-nen.mp3')
    }

    generateWhiteBoard() {
        return Array.from({length: ROWS}, () => Array(COLS).fill(whiteColorIndex))
    }

    drawCell(x,y,colorID) {
        this.ctx.fillStyle = colorMapping[colorID] || colorMapping[whiteColorIndex]
        this.ctx.fillRect(x*blockSize,y*blockSize,blockSize,blockSize)
        this.ctx.fillStyle = 'black'
        this.ctx.strokeRect(x*blockSize,y*blockSize,blockSize,blockSize)
    }
    
    drawBoard() {
        for(let row = 0 ; row < this.grid.length ; row++) {
            for (let col = 0; col < this.grid[0].length; col++) {
                this.drawCell(col,row,this.grid[row][col])
            }
        }
    }

    handleCompleteRows() {
        const latestGrid = this.grid.filter(row => {
            return row.some(col => col === whiteColorIndex)
        })

        const newScore = ROWS - latestGrid.length
        const newRows = Array.from({length: newScore}, () => Array(COLS).fill(whiteColorIndex))

        if(newScore) {
            this.grid = [...newRows,...latestGrid]
            this.handleScore(newScore)
            this.clearAudio.play()
        }
    }

    handleScore(newScore) {
        this.score += newScore
        document.getElementById('score').innerText = this.score
    }

    handleGameOver() {
        this.gameOver = true
        this.isPlaying = false
        playBtn.innerText = 'Play'
        this.brgAudio.pause()
        this.gameOverAudio.play()
        playBtn.classList.remove('active')
        alertGameOver.classList.add('active')
    }

    handleReset() {
        this.gameOver = false
        this.score = 0
        alertGameOver.classList.remove('active')
        this.grid = this.generateWhiteBoard()
        this.drawBoard()
        this.handleScore(this.score)
    }
}

class Brick {
    constructor(id) {
        this.id = id
        this.layout = brickLayout[id]
        this.activeIndex = 0
        this.rowPos = -2
        this.colPos = 3
    }

    drawBrickLayout() {
        for (let row = 0; row < this.layout[this.activeIndex].length; row++) {
            for (let col = 0; col < this.layout[this.activeIndex][0].length; col++) {
                if(this.layout[this.activeIndex][row][col] !== whiteColorIndex) {
                    board.drawCell(col+this.colPos,row+this.rowPos,this.id)
                }
            }
            
        }
    }

    clear() {
        for (let row = 0; row < this.layout[this.activeIndex].length; row++) {
            for (let col = 0; col < this.layout[this.activeIndex][0].length; col++) {
                if(this.layout[this.activeIndex][row][col] !== whiteColorIndex) {
                    board.drawCell(col+this.colPos,row+this.rowPos,whiteColorIndex)
                }
            }
            
        }
    }

    moveLeft() {
        if (!this.checkCollition(this.rowPos,this.colPos-1,this.layout[this.activeIndex])) {
            this.clear()
            this.colPos--
            this.drawBrickLayout()
        }
    }

    moveRight() {
        if (!this.checkCollition(this.rowPos,this.colPos+1,this.layout[this.activeIndex])) {   
            this.clear()
            this.colPos++
            this.drawBrickLayout()
        }
    }
    
    moveDown() {
        if (!this.checkCollition(this.rowPos+1,this.colPos,this.layout[this.activeIndex])) {
            this.clear()
            this.rowPos++
            this.drawBrickLayout()

            return
        }

        this.handleLanded()
        generateNewBrick()
    }

    rotate() { 
        if (!this.checkCollition(this.rowPos,this.colPos,this.layout[(this.activeIndex+1)%4])) {   
            this.clear()
            this.activeIndex = (this.activeIndex+1)%4
            this.drawBrickLayout()
        }
    }

    checkCollition(nextRow,nextCol,nextLayout) {
        for (let row = 0; row < nextLayout.length; row++) {
            for (let col = 0; col < nextLayout[0].length; col++) {
                if(nextLayout[row][col] !== whiteColorIndex && nextRow >= 0) {
                    if(
                        nextCol+col < 0 ||
                        nextCol+col >= COLS ||
                        nextRow+row >= ROWS ||
                        board.grid[row+nextRow][col+nextCol] !== whiteColorIndex
                    ) {
                        return true
                    }
                }
                
            }
            
        }
    }

    handleLanded() {
        if(this.rowPos <= 0) {
            board.handleGameOver()
            return
        }

        for (let row = 0; row < this.layout[this.activeIndex].length; row++) {
            for (let col = 0; col < this.layout[this.activeIndex][0].length; col++) {
                if(this.layout[this.activeIndex][row][col] !== whiteColorIndex) {
                    board.grid[row+this.rowPos][col+this.colPos] = this.id
                }
            }
            
        }

        board.handleCompleteRows()
        board.drawBoard()
    }
}
const board = new Board(ctx)
board.drawBoard()

const generateNewBrick = () => {
    brick = new Brick(Math.floor(Math.random()*10)%brickLayout.length)
}

playBtn.addEventListener('click',() => {

    board.isPlaying = true
    board.handleReset()
    generateNewBrick()

    board.brgAudio.addEventListener('ended',() => {
      board.brgAudio.play()
    })

    playBtn.innerText = 'ReStart'
    playBtn.classList.add('active')
    board.brgAudio.play()

    refresh = setInterval(()=> {
      if(!board.gameOver){
          brick.moveDown()
      }else {
          clearInterval(refresh)
      }
    },500)
})

turnOnVol.addEventListener('click',() => {
  turnOnVol.querySelector('i').className = 'bx bxs-volume-full'
  turnOffVol.querySelector('i').className = 'bx bx-volume'
  board.brgAudio.volume = 1
  board.clearAudio.volume = 1
  board.gameOverAudio.volume = 1
})

turnOffVol.addEventListener('click',() => {
  turnOffVol.querySelector('i').className = 'bx bxs-volume'
  turnOnVol.querySelector('i').className = 'bx bx-volume-full'
  board.brgAudio.volume = 0
  board.clearAudio.volume = 0
  board.gameOverAudio.volume = 0
})

document.addEventListener('keydown', e => {
    switch(e.code) {
        case 'ArrowLeft':
            brick.moveLeft()
            break
        case 'ArrowRight':
            brick.moveRight()
            break
        case 'ArrowDown':
            brick.moveDown()
            break
        case 'ArrowUp':
            brick.rotate()
            break
        default:
            break
    } 
})
