// Simon Game MVP
const board = document.getElementById('simonBoard');
const msg = document.getElementById('simonMsg');
const colors = ['red', 'green', 'blue', 'yellow'];
let sequence = [];
let userStep = 0;
let playing = false;

function createButtons() {
  colors.forEach(color => {
    const btn = document.createElement('button');
    btn.className = 'simon-btn ' + color;
    btn.addEventListener('touchstart', () => handleTap(color));
    btn.addEventListener('click', () => handleTap(color));
    board.appendChild(btn);
  });
}

function playSequence() {
  playing = true;
  let i = 0;
  function next() {
    if (i < sequence.length) {
      const btn = board.children[colors.indexOf(sequence[i])];
      btn.classList.add('active');
      setTimeout(() => {
        btn.classList.remove('active');
        setTimeout(() => { i++; next(); }, 200);
      }, 600);
    } else {
      playing = false;
      msg.textContent = 'Your turn!';
    }
  }
  next();
}

function startGame() {
  sequence = [];
  userStep = 0;
  msg.textContent = 'Watch the sequence!';
  addStep();
}

function addStep() {
  sequence.push(colors[Math.floor(Math.random()*4)]);
  setTimeout(playSequence, 500);
}

function handleTap(color) {
  if (playing) return;
  const btn = board.children[colors.indexOf(color)];
  btn.classList.add('selected');
  setTimeout(() => btn.classList.remove('selected'), 350);
  if (color === sequence[userStep]) {
    userStep++;
    if (userStep === sequence.length) {
      msg.textContent = 'Correct!';
      setTimeout(() => {
        userStep = 0;
        msg.textContent = 'Watch the sequence!';
        addStep();
      }, 800);
    }
  } else {
    msg.textContent = 'Wrong! Tap any color to restart.';
    board.onclick = () => { board.onclick = null; startGame(); };
  }
}

createButtons();
startGame();
