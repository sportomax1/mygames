

const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 320;
canvas.height = 480;

let box = 20;
let snake = [{ x: 8 * box, y: 12 * box }];
let direction = 'RIGHT';
let food = {
	x: Math.floor(Math.random() * (canvas.width / box)) * box,
	y: Math.floor(Math.random() * (canvas.height / box)) * box
};

let started = false;

function showControls() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = '#fff';
	ctx.font = '20px Arial';
	ctx.textAlign = 'center';
	ctx.fillText('Snake Controls:', canvas.width / 2, 180);
	ctx.font = '16px Arial';
	ctx.fillText('Tap above/below/left/right of snake', canvas.width / 2, 210);
	ctx.fillText('to change direction.', canvas.width / 2, 235);
	ctx.fillText('Tap to start!', canvas.width / 2, 270);
}

showControls();

canvas.addEventListener('touchstart', function(e) {
	if (!started) {
		started = true;
		setInterval(update, 120);
		return;
	}
	const touchY = e.touches[0].clientY - canvas.getBoundingClientRect().top;
	const touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
	if (touchY < snake[0].y) direction = 'UP';
	else if (touchY > snake[0].y) direction = 'DOWN';
	else if (touchX < snake[0].x) direction = 'LEFT';
	else direction = 'RIGHT';
});

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// Draw snake
	for (let i = 0; i < snake.length; i++) {
		ctx.fillStyle = i === 0 ? '#0f0' : '#fff';
		ctx.fillRect(snake[i].x, snake[i].y, box, box);
	}
	// Draw food
	ctx.fillStyle = '#f00';
	ctx.fillRect(food.x, food.y, box, box);
}

function update() {
	let head = { x: snake[0].x, y: snake[0].y };
	if (direction === 'LEFT') head.x -= box;
	if (direction === 'RIGHT') head.x += box;
	if (direction === 'UP') head.y -= box;
	if (direction === 'DOWN') head.y += box;

	// Wall collision
	if (
		head.x < 0 || head.x >= canvas.width ||
		head.y < 0 || head.y >= canvas.height
	) {
		snake = [{ x: 8 * box, y: 12 * box }];
		direction = 'RIGHT';
		food.x = Math.floor(Math.random() * (canvas.width / box)) * box;
		food.y = Math.floor(Math.random() * (canvas.height / box)) * box;
		started = false;
		showControls();
		return;
	}

	// Food collision
	if (head.x === food.x && head.y === food.y) {
		snake.unshift(head);
		food.x = Math.floor(Math.random() * (canvas.width / box)) * box;
		food.y = Math.floor(Math.random() * (canvas.height / box)) * box;
	} else {
		snake.pop();
		snake.unshift(head);
	}

	draw();
}