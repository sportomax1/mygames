const size = 4;
let board = [], empty = { r: size-1, c: size-1 }, gameOver = false;
const boardDiv = document.getElementById('slidingPuzzleBoard');
const msgDiv = document.getElementById('slidingPuzzleMsg');

boardDiv.style.width = '320px';
boardDiv.style.height = '320px';
boardDiv.style.display = 'grid';
boardDiv.style.gridTemplate = `repeat(${size}, 1fr) / repeat(${size}, 1fr)`;
boardDiv.style.gap = '6px';

function init() {
  let nums = [...Array(size*size-1).keys()].map(x=>x+1);
  nums = shuffle(nums);
  board = Array(size).fill().map(()=>Array(size).fill(0));
  let idx = 0;
  for (let r=0; r<size; r++) for (let c=0; c<size; c++) {
    if (r===size-1 && c===size-1) continue;
    board[r][c] = nums[idx++];
  }
  empty = { r:size-1, c:size-1 };
  gameOver = false;
  draw();
  msgDiv.textContent = '';
}

function shuffle(arr) {
  for (let i=arr.length-1; i>0; i--) {
    let j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]] = [arr[j],arr[i]];
  }
  return arr;
}

function draw() {
  boardDiv.innerHTML = '';
  for (let r=0; r<size; r++) for (let c=0; c<size; c++) {
    let val = board[r][c];
    let cell = document.createElement('div');
    cell.textContent = val ? val : '';
    cell.style.background = val ? '#0af' : '#444';
    cell.style.color = '#fff';
    cell.style.fontSize = '2em';
    cell.style.display = 'flex';
    cell.style.justifyContent = 'center';
    cell.style.alignItems = 'center';
    cell.style.borderRadius = '8px';
    cell.style.userSelect = 'none';
    cell.style.position = 'relative';
    cell.addEventListener('touchstart', e => handleTouch(r,c,e));
    boardDiv.appendChild(cell);
  }
}

function handleTouch(r,c,e) {
  if (gameOver) return;
  if (isAdjacent(r,c,empty.r,empty.c)) {
    board[empty.r][empty.c] = board[r][c];
    board[r][c] = 0;
    empty = { r, c };
    draw();
    if (isSolved()) {
      msgDiv.textContent = 'You Win!';
      gameOver = true;
    }
  }
}

function isAdjacent(r1,c1,r2,c2) {
  return (Math.abs(r1-r2)+Math.abs(c1-c2))===1;
}

function isSolved() {
  let n = 1;
  for (let r=0; r<size; r++) for (let c=0; c<size; c++) {
    if (r===size-1 && c===size-1) return true;
    if (board[r][c] !== n++) return false;
  }
  return true;
}

init();
