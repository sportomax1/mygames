const rows = 8, cols = 8, mines = 10;
let board = [], revealed = [], flagged = [], gameOver = false;
const boardDiv = document.getElementById('minesweeperBoard');
const msgDiv = document.getElementById('minesweeperMsg');

boardDiv.style.width = '320px';
boardDiv.style.height = '320px';
boardDiv.style.display = 'grid';
boardDiv.style.gridTemplate = `repeat(${rows}, 1fr) / repeat(${cols}, 1fr)`;
boardDiv.style.gap = '4px';

function init() {
  board = Array(rows).fill().map(()=>Array(cols).fill(0));
  revealed = Array(rows).fill().map(()=>Array(cols).fill(false));
  flagged = Array(rows).fill().map(()=>Array(cols).fill(false));
  gameOver = false;
  let placed = 0;
  while (placed < mines) {
    let r = Math.floor(Math.random()*rows), c = Math.floor(Math.random()*cols);
    if (board[r][c] === 'M') continue;
    board[r][c] = 'M';
    placed++;
  }
  for (let r=0; r<rows; r++) for (let c=0; c<cols; c++) {
    if (board[r][c] !== 'M') {
      let count = 0;
      for (let dr=-1; dr<=1; dr++) for (let dc=-1; dc<=1; dc++) {
        let nr=r+dr,nc=c+dc;
        if (nr>=0&&nr<rows&&nc>=0&&nc<cols&&board[nr][nc]==='M') count++;
      }
      board[r][c] = count;
    }
  }
  draw();
  msgDiv.textContent = '';
}

function draw() {
  boardDiv.innerHTML = '';
  for (let r=0; r<rows; r++) for (let c=0; c<cols; c++) {
    let cell = document.createElement('div');
    cell.style.background = revealed[r][c] ? '#888' : '#444';
    cell.style.color = '#fff';
    cell.style.fontSize = '1.5em';
    cell.style.display = 'flex';
    cell.style.justifyContent = 'center';
    cell.style.alignItems = 'center';
    cell.style.borderRadius = '6px';
    cell.style.userSelect = 'none';
    cell.style.position = 'relative';
    if (flagged[r][c]) {
      cell.textContent = '🚩';
    } else if (revealed[r][c]) {
      cell.textContent = board[r][c] === 'M' ? '💣' : (board[r][c] ? board[r][c] : '');
    }
    cell.addEventListener('touchstart', e => handleTouch(r,c,e));
    boardDiv.appendChild(cell);
  }
}

let lastTap = 0;
function handleTouch(r,c,e) {
  if (gameOver || revealed[r][c]) return;
  let now = Date.now();
  if (now - lastTap < 300) {
    flagged[r][c] = !flagged[r][c];
    draw();
    lastTap = 0;
    return;
  }
  lastTap = now;
  if (flagged[r][c]) return;
  if (board[r][c] === 'M') {
    revealed[r][c] = true;
    gameOver = true;
    draw();
    msgDiv.textContent = 'Game Over!';
    return;
  }
  revealCell(r,c);
  draw();
  if (checkWin()) {
    msgDiv.textContent = 'You Win!';
    gameOver = true;
  }
}

function revealCell(r,c) {
  if (r<0||r>=rows||c<0||c>=cols||revealed[r][c]||flagged[r][c]) return;
  revealed[r][c] = true;
  if (board[r][c] === 0) {
    for (let dr=-1; dr<=1; dr++) for (let dc=-1; dc<=1; dc++) {
      if (dr!==0||dc!==0) revealCell(r+dr,c+dc);
    }
  }
}

function checkWin() {
  for (let r=0; r<rows; r++) for (let c=0; c<cols; c++) {
    if (board[r][c]!=='M' && !revealed[r][c]) return false;
  }
  return true;
}

init();
