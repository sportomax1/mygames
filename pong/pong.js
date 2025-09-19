

const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 320;
canvas.height = 480;

let paddleH = 60, paddleW = 10;
let leftPaddleY = (canvas.height - paddleH) / 2;
let rightPaddleY = (canvas.height - paddleH) / 2;
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballRadius = 8;
let ballDX = 3, ballDY = 2;
let leftPressed = false, rightPressed = false;
let playerSide = null;
let playerScore = 0, aiScore = 0, winScore = 5;

function askOptions() {
	playerSide = prompt('Play as left or right paddle? (left/right)', 'left');
	winScore = parseInt(prompt('Game length: points to win?', '5')) || 5;
}
askOptions();

function drawPaddles() {
	ctx.fillStyle = '#0f0';
	ctx.fillRect(0, leftPaddleY, paddleW, paddleH);
	ctx.fillStyle = '#00f';
	ctx.fillRect(canvas.width - paddleW, rightPaddleY, paddleW, paddleH);
}

function drawBall() {
	ctx.beginPath();
	ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
	ctx.fillStyle = '#fff';
	ctx.fill();
	ctx.closePath();
}

function drawScore() {
	ctx.font = '20px Arial';
	ctx.fillStyle = '#fff';
	ctx.fillText(`${playerScore} : ${aiScore}`, canvas.width / 2 - 20, 30);
}

let draggingPaddle = false;
canvas.addEventListener('touchstart', function(e) {
	draggingPaddle = true;
	const touchY = e.touches[0].clientY - canvas.getBoundingClientRect().top;
	if (playerSide === 'left') leftPaddleY = Math.max(0, Math.min(canvas.height - paddleH, touchY - paddleH / 2));
	else rightPaddleY = Math.max(0, Math.min(canvas.height - paddleH, touchY - paddleH / 2));
});

canvas.addEventListener('touchmove', function(e) {
	if (!draggingPaddle) return;
	const touchY = e.touches[0].clientY - canvas.getBoundingClientRect().top;
	if (playerSide === 'left') leftPaddleY = Math.max(0, Math.min(canvas.height - paddleH, touchY - paddleH / 2));
	else rightPaddleY = Math.max(0, Math.min(canvas.height - paddleH, touchY - paddleH / 2));
});

canvas.addEventListener('touchend', function(e) {
	draggingPaddle = false;
});

function resetBall() {
	ballX = canvas.width / 2;
	ballY = canvas.height / 2;
	ballDX = 3 * (Math.random() > 0.5 ? 1 : -1);
	ballDY = 2 * (Math.random() > 0.5 ? 1 : -1);
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawPaddles();
	drawBall();
	drawScore();

	// Ball movement
	ballX += ballDX;
	ballY += ballDY;

	// Wall collision
	if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) ballDY = -ballDY;

	// Left paddle collision
	if (
		ballX - ballRadius < paddleW &&
		ballY > leftPaddleY && ballY < leftPaddleY + paddleH
	) {
		ballDX = -ballDX;
		ballX = paddleW + ballRadius;
	}
	// Right paddle collision
	if (
		ballX + ballRadius > canvas.width - paddleW &&
		ballY > rightPaddleY && ballY < rightPaddleY + paddleH
	) {
		ballDX = -ballDX;
		ballX = canvas.width - paddleW - ballRadius;
	}

	// Score
	if (ballX - ballRadius < 0) {
		aiScore++;
		if (aiScore >= winScore) {
			setTimeout(() => alert('AI wins!'), 100);
			playerScore = 0; aiScore = 0;
		}
		resetBall();
	}
	if (ballX + ballRadius > canvas.width) {
		playerScore++;
		if (playerScore >= winScore) {
			setTimeout(() => alert('You win!'), 100);
			playerScore = 0; aiScore = 0;
		}
		resetBall();
	}

	// AI paddle movement
	if (playerSide === 'left') {
		if (rightPaddleY + paddleH / 2 < ballY) rightPaddleY += 2;
		else if (rightPaddleY + paddleH / 2 > ballY) rightPaddleY -= 2;
	} else {
		if (leftPaddleY + paddleH / 2 < ballY) leftPaddleY += 2;
		else if (leftPaddleY + paddleH / 2 > ballY) leftPaddleY -= 2;
	}

	requestAnimationFrame(draw);
}

draw();