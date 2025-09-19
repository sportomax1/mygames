// Memory Game MVP with theme chooser
const themes = {
  Numbers: Array.from({length:8}, (_,i)=>i+1).flatMap(x=>[x,x]),
  Symbols: ['★','★','♥','♥','♣','♣','♦','♦','♠','♠','☀','☀','☂','☂','☁','☁'],
  Emojis: ['🍎','🍎','🍌','🍌','🍉','🍉','🍇','🍇','🍒','🍒','🍓','🍓','🍍','🍍','🥝','🥝']
};
const themeChooser = document.getElementById('themeChooser');
const board = document.getElementById('memoryBoard');
const msg = document.getElementById('memoryMsg');
let cards = [], flipped = [], matched = 0, theme = 'Numbers';

function chooseTheme() {
  themeChooser.innerHTML = '<b>Choose Theme:</b> ' + Object.keys(themes).map(t => `<button style="margin:0 6px;" onclick="window.setTheme('`+t+`')">`+t+`</button>`).join('');
}
window.setTheme = function(t) {
  theme = t;
  startGame();
};

function startGame() {
  msg.textContent = '';
  matched = 0;
  flipped = [];
  let arr = [...themes[theme]];
  arr.sort(()=>Math.random()-0.5);
  cards = arr.map((val,i)=>({val,flipped:false,matched:false,id:i}));
  renderBoard();
}

function renderBoard() {
  board.innerHTML = '';
  cards.forEach((card,i) => {
    const div = document.createElement('div');
    div.className = 'memory-card' + (card.flipped ? ' flipped':'') + (card.matched ? ' matched':'');
    div.textContent = card.flipped || card.matched ? card.val : '';
    div.onclick = () => flipCard(i);
    board.appendChild(div);
  });
}

function flipCard(i) {
  if (cards[i].flipped || cards[i].matched || flipped.length === 2) return;
  cards[i].flipped = true;
  flipped.push(i);
  renderBoard();
  if (flipped.length === 2) {
    setTimeout(checkMatch, 700);
  }
}

function checkMatch() {
  const [a,b] = flipped;
  if (cards[a].val === cards[b].val) {
    cards[a].matched = cards[b].matched = true;
    matched += 2;
    if (matched === cards.length) msg.textContent = 'You win!';
  } else {
    cards[a].flipped = cards[b].flipped = false;
  }
  flipped = [];
  renderBoard();
}

chooseTheme();
startGame();
