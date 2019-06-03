let ctx, timer = 0
let cells     =  []
let WID = 12, HEI = 12, SIZE = 40, TEMPO = 2
let cursor    = [0,0]
let moves     = 0
let lastBi    = [0,0]
let history   = []
let stepBack  = 0
let finish    = false


function findOptions() {
  let options = []
  for (let i = 0; i < 4; i++) {
    let y = cursor[0] + [-1, 0, 1, 0][i]
    let x = cursor[1] + [ 0, 1, 0,-1][i]
    if (x >= 0 && x < WID && y >= 0 && y < HEI)
      if (!cells[y * WID + x].visited)
        options.push([y,x])
  }
  return options
}

function deleteWalls(diff) { 
  if (diff[0] ===  1) {
    cells[ cursor[0]      * WID + cursor[1]].walls[2] = false
    cells[(cursor[0] + 1) * WID + cursor[1]].walls[0] = false
  }
  if (diff[0] === -1) {
    cells[ cursor[0]      * WID + cursor[1]].walls[0] = false
    cells[(cursor[0] - 1) * WID + cursor[1]].walls[2] = false
  }
  if (diff[1] ===  1) {
    cells[cursor[0] * WID + cursor[1]    ].walls[1] = false
    cells[cursor[0] * WID + cursor[1] + 1].walls[3] = false
  }
  if (diff[1] === -1) {
    cells[cursor[0] * WID + cursor[1]    ].walls[3] = false
    cells[cursor[0] * WID + cursor[1] - 1].walls[1] = false
  }
}

function moveCursor (options) {
  history.push(cursor)
  stepBack = 0
  let zufall = Math.floor(Math.random()*options.length)
  deleteWalls([options[zufall][0] - cursor[0], options[zufall][1] - cursor[1]])
  cursor = options[zufall] 
  moves++
}

function deadEnd (options) {
  stepBack++ 
  cursor = history[moves - stepBack]
  if (cells.filter((c) => !c.visited).length === 0)
    finish = true
}

function check() {
  cells[cursor[0]*WID + cursor[1]].visited = true
  let options = findOptions()
  if (options.length === 0) 
    deadEnd(options)
  else moveCursor(options)
}

function loop() {
  if (finish) 
    return
  timer++
  if (timer % TEMPO === 0) {
    check()
    for (let c of cells)
      c.show()
  }
  requestAnimationFrame(loop)
}

window.onload = function() {
  for (let i = 0; i < WID * HEI; i++)
    cells.push(new Cell(i))
  ctx = document.getElementById('C').getContext('2d')
  ctx.strokeStyle = 'white'
  loop()
}

class Cell {
  constructor(i) {
    this.x = i % WID
    this.y = Math.floor(i / HEI)
    this.walls = [true, true ,true ,true]
    this.visited = false
  }

  show() {
    ctx.fillStyle = this.visited ? 'purple' : '#444'
    if (this.y === cursor[0] && this.x === cursor[1] && !finish)
      ctx.fillStyle = 'lawngreen'
    ctx.fillRect(this.x * SIZE, this.y * SIZE, SIZE, SIZE)
    for (let j = 0; j < 4; j++) {
      if (this.walls[j] && this.visited) {
        ctx.beginPath()
        ctx.moveTo((this.x + [0,1,1,0][j]) * SIZE, (this.y + [0,0,1,1][j]) * SIZE)
        ctx.lineTo((this.x + [1,1,0,0][j]) * SIZE, (this.y + [0,1,1,0][j]) * SIZE)
        ctx.stroke();
      }
    }
  }
}