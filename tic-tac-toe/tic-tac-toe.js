
const board = document.getElementById('ticTacToeBoard');
let squares = [];
let currentPlayer = 'X';

function checkWin() {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return winPatterns.some(p =>
    p.every(i => squares[i].textContent === currentPlayer)
  );
}


function handleTap(e) {
  if (e.target.textContent === '') {
    e.target.textContent = currentPlayer;
    e.target.classList.add(currentPlayer.toLowerCase());
    if (checkWin()) {
      setTimeout(() => {
        squares.forEach(sq => {
          sq.textContent = '';
          sq.classList.remove('x', 'o');
        });
        alert(currentPlayer + ' wins!');
      }, 300);
    } else if (squares.every(sq => sq.textContent !== '')) {
      setTimeout(() => {
        squares.forEach(sq => {
          sq.textContent = '';
          sq.classList.remove('x', 'o');
        });
        alert('Draw!');
      }, 300);
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
  }
}

for (let i = 0; i < 9; i++) {
  const square = document.createElement('div');
  square.className = 'square';
  square.addEventListener('touchstart', handleTap);
  square.addEventListener('click', handleTap);
  board.appendChild(square);
  squares.push(square);
}