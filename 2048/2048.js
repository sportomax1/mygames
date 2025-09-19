const size = 4;
let board = Array(size).fill().map(()=>Array(size).fill(0));
let score = 0;
const gameDiv = document.getElementById('game2048');
const scoreDiv = document.getElementById('score2048');

gameDiv.style.width = '320px';
gameDiv.style.height = '320px';
gameDiv.style.display = 'grid';
gameDiv.style.gridTemplate = `repeat(${size}, 1fr) / repeat(${size}, 1fr)`;
gameDiv.style.gap = '6px';

function addTile() {
  let empty = [];
  for (let r=0; r<size; r++) for (let c=0; c<size; c++) if (!board[r][c]) empty.push([r,c]);
  if (empty.length) {
    let [r,c] = empty[Math.floor(Math.random()*empty.length)];
    board[r][c] = Math.random()<0.9 ? 2 : 4;
  }
}

function draw() {
  gameDiv.innerHTML = '';
  for (let r=0; r<size; r++) for (let c=0; c<size; c++) {
    let val = board[r][c];
    let cell = document.createElement('div');
    cell.textContent = val ? val : '';
    cell.style.background = val ? `hsl(${30+val*2},70%,${val?60:20}%)` : '#444';
    cell.style.color = val>4 ? '#fff' : '#222';
    cell.style.fontSize = '2em';
    cell.style.display = 'flex';
    cell.style.justifyContent = 'center';
    cell.style.alignItems = 'center';
    cell.style.borderRadius = '8px';
    gameDiv.appendChild(cell);
  }
  scoreDiv.textContent = 'Score: ' + score;
}

function move(dir) {
  let moved = false;
  let merged = Array(size).fill().map(()=>Array(size).fill(false));
  function slide(r, c, dr, dc) {
    let nr = r+dr, nc = c+dc;
    if (nr<0||nr>=size||nc<0||nc>=size) return;
    if (!board[nr][nc] && board[r][c]) {
      board[nr][nc] = board[r][c];
      board[r][c] = 0;
      moved = true;
      slide(nr, nc, dr, dc);
    } else if (board[nr][nc] === board[r][c] && board[r][c] && !merged[nr][nc] && !merged[r][c]) {
      board[nr][nc] *= 2;
      score += board[nr][nc];
      board[r][c] = 0;
      merged[nr][nc] = true;
      moved = true;
    }
  }
  let order = [...Array(size).keys()];
  if (dir==='down'||dir==='right') order = order.reverse();
  for (let i of order) for (let j of order) {
    let r = dir==='up'||dir==='down' ? i : j;
    let c = dir==='up'||dir==='down' ? j : i;
    if (dir==='up') slide(r,c,-1,0);
    if (dir==='down') slide(r,c,1,0);
    if (dir==='left') slide(r,c,0,-1);
    if (dir==='right') slide(r,c,0,1);
  }
  if (moved) addTile();
  draw();
  if (isGameOver()) setTimeout(()=>alert('Game Over!'),100);
}

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchend', handleTouchEnd, false);
let xDown=null, yDown=null;
function handleTouchStart(evt) {
  xDown = evt.touches[0].clientX;
  yDown = evt.touches[0].clientY;
}
function handleTouchEnd(evt) {
  if (!xDown || !yDown) return;
  let xUp = evt.changedTouches[0].clientX;
  let yUp = evt.changedTouches[0].clientY;
  let dx = xUp - xDown, dy = yUp - yDown;
  if (Math.abs(dx)>Math.abs(dy)) {
    if (dx>30) move('right');
    else if (dx<-30) move('left');
  } else {
    if (dy>30) move('down');
    else if (dy<-30) move('up');
  }
  xDown = yDown = null;
}

function isGameOver() {
  for (let r=0; r<size; r++) for (let c=0; c<size; c++) if (!board[r][c]) return false;
  for (let r=0; r<size; r++) for (let c=0; c<size; c++) {
    for (let [dr,dc] of [[0,1],[1,0]]) {
      let nr=r+dr,nc=c+dc;
      if (nr<size&&nc<size&&board[r][c]===board[nr][nc]) return false;
    }
  }
  return true;
}

function newGame() {
  board = Array(size).fill().map(()=>Array(size).fill(0));
  score = 0;
  addTile();
  addTile();
  draw();
}

newGame();
