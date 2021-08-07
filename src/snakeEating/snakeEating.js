import '../reset/reset.css';
import N from 'bignumber.js';
import './snakeEating.scss';
import render from '../commonTemplate/nav/nav.js';

render('.head');

const snakeEl = $('.snake');
const foodEl = $('.food');
const defaultNum = 5;
const snake = [];
const size = 20;
let direction = 'left';
let interval = null;
let stop = true;

init();

// 初始化生成初始蛇
function init() {
	// 设置容器高度为宽度的一半
	// 所以容器是1:0.5的宽高
	snakeEl.css('height', N(snakeEl.width()).div(2).toNumber());

	// 获取容器的中间值
	let x = N(snakeEl.width()).div(2).toNumber() - getFinalSize();
	let y = N(snakeEl.height()).div(2).toNumber() - getFinalSize();
	let num = defaultNum;

	// 生成初始蛇
	while (num) {
		const body = $(document.createElement('div'));

		if (num === defaultNum) {
			body.addClass('head');
		} else {
			body.addClass('body');
		}

		body.css({
			width: getFinalSize(),
			height: getFinalSize(),
			left: x,
			top: y,
		});

		foodEl.css({
			width: getFinalSize(),
			height: getFinalSize(),
		});

		snake.push(body);

		x += getFinalSize();

		num--;
	}

	snakeEl.append(snake);

	// 设置食物初始位置
	const { x: foodX, y: foodY } = generationFoodPos();

	foodEl.css({
		left: foodX,
		top: foodY,
	});

	// 设置键盘事件
	setKeyDownEvent();
}

// 获取蛇身大小
function getFinalSize() {
	return N(snakeEl.width()).div(size).toNumber();
}

// 设置键盘事件
function setKeyDownEvent() {
	const left = 37;
	const up = 38;
	const right = 39;
	const down = 40;
	const space = 32;

	$(window).keydown(({ keyCode: code }) => {
		// 设置方向
		// 禁止往反方向按
		switch (code) {
			case left:
				direction !== 'right' ? changeDir('left') : '';
				break;
			case up:
				direction !== 'down' ? changeDir('up') : '';
				break;

			case right:
				direction !== 'left' ? changeDir('right') : '';
				break;

			case down:
				direction !== 'up' ? changeDir('down') : '';
				break;

			case space:
				changeStopState();
				break;
		}
	});

	function changeDir(dir) {
		direction = dir;
	}
}

// 更改stop状态
function changeStopState(value) {
	stop = value | !stop;

	stop ? clearInterval(interval) : move();
}

// 移动
function move() {
	interval = setInterval(() => {
		// 获取蛇头xy值作为初始值
		let { x: oldX, y: oldY } = getBodyPos(0);
		let newX = 0;
		let newY = 0;

		// 根据方向更改蛇头将要移动的位置
		switch (direction) {
			case 'left':
				oldX = N(oldX).plus(-getFinalSize()).toNumber();
				break;
			case 'right':
				oldX = N(oldX).plus(getFinalSize()).toNumber();
				break;
			case 'up':
				oldY = N(oldY).plus(-getFinalSize()).toNumber();
				break;
			case 'down':
				oldY = N(oldY).plus(getFinalSize()).toNumber();
				break;
		}

		// 检测蛇头吃到了食物
		if (checkCollisionFood(oldX, oldY)) {
			// 更改食物位置信息
			const { x, y } = generationFoodPos();

			foodEl.css({
				left: x,
				top: y,
			});

			// 增加一个新的蛇身
			increaseSnakeBody();
		}

		if (checkCollisionBody(oldX, oldY) || checkCollisionWall(oldX, oldY)) {
			changeStopState(false);
			return;
		}

		for (const index in snake) {
			// 获取上一个蛇身的位置信息
			newX = oldX;
			newY = oldY;

			const { x, y } = getBodyPos(index);

			// 保存蛇身移动前的位置信息
			oldX = x;
			oldY = y;

			// 更改位置
			changeBodyPos(newX, newY, index);
		}
	}, 300);

	// 更改位置的函数
	function changeBodyPos(x, y, index) {
		const body = snake[index];
		body.css({
			left: x,
			top: y,
		});
	}
}

// 添加蛇身
function increaseSnakeBody() {
	const body = $(document.createElement('div'));

	body.addClass('body');

	body.css({
		width: getFinalSize(),
		height: getFinalSize(),
	});

	snake.push(body);

	snakeEl.append(snake);
}

// 获取蛇身某一个块的位置信息
function getBodyPos(index) {
	const body = snake[index];
	const x = Number(body.css('left').match(/(\d+\.\d+|\d+)/)[0]);
	const y = Number(body.css('top').match(/(\d+\.\d+|\d+)/)[0]);

	return { x, y };
}

// 获取食物位置信息
function getFoodPos() {
	const x = Number(foodEl.css('left').match(/(\d+\.\d+|\d+)/)[0]);
	const y = Number(foodEl.css('top').match(/(\d+\.\d+|\d+)/)[0]);

	return { x, y };
}

// 检测蛇是否吃到了食物
function checkCollisionFood(headX, headY) {
	const { x: foodX, y: foodY } = getFoodPos();

	// 可能是因为js的误差（也可能是我的代码有问题）导致经常会有0.0000000000000n的误差出现
	// 所以这里只比较整数部分
	if (foodX === headX && foodY === headY) {
		return true;
	}

	return false;
}

// 生成食物的位置信息
function generationFoodPos() {
	// 把容器分成20x10的格，每个格都代表了一个蛇身的大小
	// 随机生成xy坐标（比如说x：5（5个单位） y：3（3个单位））
	// 再乘以蛇身的大小得到最终的坐标值
	let nX = Math.floor(N(Math.random()).times(size)) * getFinalSize();
	let nY =
		Math.floor(N(Math.random()).times(N(size).div(2))) * getFinalSize();

	// 校验生成坐标是否和蛇重叠
	while (checkRepeatSnake(nX, nY)) {
		nX = Math.floor(N(Math.random()).times(size)) * getFinalSize();
		nY =
			Math.floor(N(Math.random()).times(N(size).div(2))) * getFinalSize();
	}

	return { x: nX, y: nY };

	// 校验函数
	function checkRepeatSnake(nX, nY) {
		return snake.some((body, index) => {
			const { x, y } = getBodyPos(index);

			return x === nX && y === nY;
		});
	}
}

// 检测蛇头是否碰撞了蛇身
function checkCollisionBody(x, y) {
	const body = snake.filter((body, index) => index !== 0);

	return body.some((body, index) => {
		const { x: bX, y: bY } = getBodyPos(index + 1);

		return bX === x && bY === y;
	});
}

// 检测蛇头是否碰撞了墙壁
function checkCollisionWall(x, y) {
	const rightLimit = snakeEl.width();
	const downLimit = snakeEl.height();

	if (x < 0 || y < 0 || x >= rightLimit || y >= downLimit) {
		return true;
	}

	return false;
}
