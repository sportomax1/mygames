
const canvas = document.getElementById('tetrisCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 240;
canvas.height = 480;
const previewDiv = document.getElementById('preview');

const shapes = [
	{ shape: [[1,1,1,1]], color: '#0ff' },
	{ shape: [[1,1],[1,1]], color: '#ff0' },
	{ shape: [[0,1,0],[1,1,1]], color: '#f0f' },
	{ shape: [[0,1,1],[1,1,0]], color: '#0f0' },
	{ shape: [[1,1,0],[0,1,1]], color: '#f00' },
	{ shape: [[1,0,0],[1,1,1]], color: '#00f' },
	{ shape: [[0,0,1],[1,1,1]], color: '#fa0' }
];

let gridW = 10, gridH = 20, blockSize = 24;
let grid = Array.from({ length: gridH }, () => Array(gridW).fill(0));
let piece = null;
let nextQueue = [];

function drawGrid() {
	for (let r = 0; r < gridH; r++) {
		for (let c = 0; c < gridW; c++) {
			if (grid[r][c]) {
				ctx.fillStyle = grid[r][c];
				ctx.fillRect(c * blockSize, r * blockSize, blockSize-2, blockSize-2);
			}
		}
	}
}

// Removed duplicate drawPiece
function drawPiece(p = piece) {
	ctx.fillStyle = p.color;
	for (let r = 0; r < p.shape.length; r++) {
		for (let c = 0; c < p.shape[r].length; c++) {
			if (p.shape[r][c]) {
				ctx.fillRect((p.x + c) * blockSize, (p.y + r) * blockSize, blockSize-2, blockSize-2);
			}
		}
	}
}

// Removed duplicate canMove
function canMove(dx, dy, shape = piece.shape) {
	for (let r = 0; r < shape.length; r++) {
		for (let c = 0; c < shape[r].length; c++) {
			if (shape[r][c]) {
				let nx = piece.x + c + dx;
				let ny = piece.y + r + dy;
				if (nx < 0 || nx >= gridW || ny >= gridH || (ny >= 0 && grid[ny][nx])) return false;
			}
		}
	}
	return true;
}

function mergePiece() {
	for (let r = 0; r < piece.shape.length; r++) {
		for (let c = 0; c < piece.shape[r].length; c++) {
			if (piece.shape[r][c]) {
				grid[piece.y + r][piece.x + c] = piece.color;
			}
		}
	}
}

function clearLines() {
	for (let r = gridH - 1; r >= 0; r--) {
		if (grid[r].every(cell => cell)) {
			grid.splice(r, 1);
			grid.unshift(Array(gridW).fill(0));
			r++;
		}
	}
}

function newPiece() {
	if (nextQueue.length < 3) {
		while (nextQueue.length < 3) {
			let idx = Math.floor(Math.random()*shapes.length);
			let s = JSON.parse(JSON.stringify(shapes[idx]));
			s.x = 4; s.y = 0;
			nextQueue.push(s);
		}
	}
	piece = nextQueue.shift();
	piece.x = 4; piece.y = 0;
	let idx = Math.floor(Math.random()*shapes.length);
	let s = JSON.parse(JSON.stringify(shapes[idx]));
	s.x = 4; s.y = 0;
	nextQueue.push(s);
	drawPreview();
}

function drawPreview() {
	previewDiv.innerHTML = '';
	nextQueue.forEach((p, i) => {
		let cv = document.createElement('canvas');
		cv.width = 56; cv.height = 56;
		let cctx = cv.getContext('2d');
		for (let r = 0; r < p.shape.length; r++) {
			for (let c = 0; c < p.shape[r].length; c++) {
				if (p.shape[r][c]) {
					cctx.fillStyle = p.color;
					cctx.fillRect(c*16+8, r*16+8, 14, 14);
				}
			}
		}
		previewDiv.appendChild(cv);
	});
}

document.getElementById('leftBtn').addEventListener('touchstart', function(e) {
	e.preventDefault();
	if (canMove(-1,0)) piece.x--;
});
document.getElementById('rightBtn').addEventListener('touchstart', function(e) {
	e.preventDefault();
	if (canMove(1,0)) piece.x++;
});
document.getElementById('rotateBtn').addEventListener('touchstart', function(e) {
	e.preventDefault();
	let newShape = rotate(piece.shape);
	if (canMove(0,0,newShape)) piece.shape = newShape;
});
document.getElementById('downBtn').addEventListener('touchstart', function(e) {
	e.preventDefault();
	if (canMove(0,1)) piece.y++;
});

function rotate(shape) {
	let rows = shape.length, cols = shape[0].length;
	let newShape = Array.from({length:cols},()=>Array(rows).fill(0));
	for (let r=0; r<rows; r++) for (let c=0; c<cols; c++) newShape[c][rows-1-r]=shape[r][c];
	return newShape;
}
function update() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawGrid();
	drawPiece();
	if (canMove(0,1)) {
		piece.y++;
	} else {
		mergePiece();
		clearLines();
		newPiece();
		if (!canMove(0,0)) {
			setTimeout(() => alert('Game Over!'), 100);
			grid = Array.from({ length: gridH }, () => Array(gridW).fill(0));
			nextQueue = [];
			newPiece();
		}
	}
	setTimeout(update, 400);
}

newPiece();
update();