
const canvas = document.getElementById('tetrisCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 320;
canvas.height = 480;

let gridW = 10, gridH = 20, blockSize = 24;
let grid = Array.from({ length: gridH }, () => Array(gridW).fill(0));
let piece = { x: 4, y: 0, shape: [[1,1],[1,1]], color: '#0ff' };

function drawGrid() {
	for (let r = 0; r < gridH; r++) {
		for (let c = 0; c < gridW; c++) {
			if (grid[r][c]) {
				ctx.fillStyle = '#0ff';
				ctx.fillRect(c * blockSize, r * blockSize, blockSize-2, blockSize-2);
			}
		}
	}
}

function drawPiece() {
	ctx.fillStyle = piece.color;
	for (let r = 0; r < piece.shape.length; r++) {
		for (let c = 0; c < piece.shape[r].length; c++) {
			if (piece.shape[r][c]) {
				ctx.fillRect((piece.x + c) * blockSize, (piece.y + r) * blockSize, blockSize-2, blockSize-2);
			}
		}
	}
}

function canMove(dx, dy) {
	for (let r = 0; r < piece.shape.length; r++) {
		for (let c = 0; c < piece.shape[r].length; c++) {
			if (piece.shape[r][c]) {
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
				grid[piece.y + r][piece.x + c] = 1;
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
	piece = { x: 4, y: 0, shape: [[1,1],[1,1]], color: '#0ff' };
}

canvas.addEventListener('touchstart', function(e) {
	const touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
	if (touchX < canvas.width / 2 && canMove(-1,0)) piece.x--;
	else if (touchX > canvas.width / 2 && canMove(1,0)) piece.x++;
});

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
		}
	}

	setTimeout(update, 400);
}

update();