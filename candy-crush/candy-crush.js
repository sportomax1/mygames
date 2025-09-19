const rows = 8, cols = 8;
const colors = ['#f44336','#ffeb3b','#4caf50','#2196f3','#e91e63','#ff9800'];
let board = [], score = 0, selected = null;
const boardDiv = document.getElementById('candyCrushBoard');
const msgDiv = document.getElementById('candyCrushMsg');

boardDiv.style.width = '320px';
boardDiv.style.height = '320px';
boardDiv.style.display = 'grid';
boardDiv.style.gridTemplate = `repeat(${rows}, 1fr) / repeat(${cols}, 1fr)`;
boardDiv.style.gap = '4px';

function init() {
  board = Array(rows).fill().map(()=>Array(cols).fill(0));
  for (let r=0; r<rows; r++) for (let c=0; c<cols; c++) {
    board[r][c] = colors[Math.floor(Math.random()*colors.length)];
  }
  score = 0;
  draw();
  msgDiv.textContent = '';
}

function draw(animate = {}) {
  boardDiv.innerHTML = '';
  for (let r=0; r<rows; r++) for (let c=0; c<cols; c++) {
    let cell = document.createElement('div');
    cell.style.background = board[r][c] || '#fff0';
    cell.style.borderRadius = '50%';
    cell.style.width = '100%';
    cell.style.height = '100%';
    cell.style.boxShadow = '0 2px 8px #0004';
    cell.style.display = 'flex';
    cell.style.justifyContent = 'center';
    cell.style.alignItems = 'center';
    cell.style.transition = 'background 0.2s, opacity 0.3s, transform 0.3s';
    cell.style.border = selected && selected.r===r && selected.c===c ? '3px solid #fff' : '2px solid #333';
    if (animate.fade && animate.fade.some(([rr,cc])=>rr===r&&cc===c)) {
      cell.style.opacity = '0';
    }
    if (animate.drop && animate.drop.some(([rr,cc])=>rr===r&&cc===c)) {
      cell.style.transform = 'translateY(-40px)';
    }
    if (animate.swap && animate.swap.r1===r && animate.swap.c1===c) {
      cell.style.transform = `translate(${40*(animate.swap.c2-animate.swap.c1)}px,${40*(animate.swap.r2-animate.swap.r1)}px)`;
    }
    cell.addEventListener('touchstart', e => handleTouch(r,c,e));
    boardDiv.appendChild(cell);
  }
  msgDiv.textContent = 'Score: ' + score;
}

let touchStart = null;
function handleTouch(r,c,e) {
  if (!touchStart) {
    touchStart = { r, c };
    selected = { r, c };
    draw();
    return;
  }
  // Only allow swap with adjacent
  if ((Math.abs(touchStart.r - r) + Math.abs(touchStart.c - c)) === 1) {
    draw({swap:{r1:touchStart.r,c1:touchStart.c,r2:r,c2:c}});
    setTimeout(()=>{
      swap(touchStart.r, touchStart.c, r, c);
      selected = null;
      touchStart = null;
      draw();
      setTimeout(matchAndDrop, 200);
    }, 180);
  } else {
    selected = null;
    touchStart = null;
    draw();
  }
}

function swap(r1,c1,r2,c2) {
  let tmp = board[r1][c1];
  board[r1][c1] = board[r2][c2];
  board[r2][c2] = tmp;
}

function matchAndDrop() {
  let matched = Array(rows).fill().map(()=>Array(cols).fill(false));
  // Check rows
  for (let r=0; r<rows; r++) for (let c=0; c<cols-2; c++) {
    if (board[r][c] && board[r][c]===board[r][c+1] && board[r][c]===board[r][c+2]) {
      matched[r][c]=matched[r][c+1]=matched[r][c+2]=true;
    }
  }
  // Check cols
  for (let c=0; c<cols; c++) for (let r=0; r<rows-2; r++) {
    if (board[r][c] && board[r][c]===board[r+1][c] && board[r][c]===board[r+2][c]) {
      matched[r][c]=matched[r+1][c]=matched[r+2][c]=true;
    }
  }
  let found = false;
  let fadeList = [];
  for (let r=0; r<rows; r++) for (let c=0; c<cols; c++) {
    if (matched[r][c]) {
      fadeList.push([r,c]);
      found = true;
    }
  }
  if (found) {
    draw({fade:fadeList});
    setTimeout(()=>{
      for (let [r,c] of fadeList) board[r][c] = null;
      score += 10 * fadeList.length;
      dropCandies(fadeList);
      setTimeout(matchAndDrop, 250);
      draw();
    }, 250);
  } else {
    draw();
  }
}

function dropCandies(fadeList=[]) {
  let dropList = [];
  for (let c=0; c<cols; c++) {
    for (let r=rows-1; r>=0; r--) {
      if (!board[r][c]) {
        for (let rr=r-1; rr>=0; rr--) {
          if (board[rr][c]) {
            board[r][c]=board[rr][c];
            board[rr][c]=null;
            dropList.push([r,c]);
            break;
          }
        }
      }
    }
    // Fill empty at top
    for (let r=0; r<rows; r++) if (!board[r][c]) board[r][c]=colors[Math.floor(Math.random()*colors.length)];
  }
  if (dropList.length) draw({drop:dropList});
}

init();
