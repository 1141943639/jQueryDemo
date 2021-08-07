import '../reset/reset.css';
import './swipe.scss';
import render from '../commonTemplate/nav/nav.js';

render('.nav');

const content = $('.content');
const width = content.width();
const swipe = $('.swipe');
const swipeItemList = [1, 2, 3, 4];
const autoInterval = 1000;
const speed = 300;
let rightLimit = 0;
let leftLimit = 0;
let autoTimer = 0;
let index = 1;

init();

function init() {
	setElementInit();
	autoMaticCarousel();
	setStopTimer();
	setBtnClick();
}

function setElementInit() {
	swipe.css({
		width: (swipeItemList.length + 2) * width,
		left: `-${width}px`,
	});

	for (const item of swipeItemList) {
		const swipeItem = $(document.createElement('div'));

		swipeItem.addClass('swipe-item');
		swipeItem.text(item);

		swipe.append(swipeItem);
	}

	swipe.prepend($(swipe.children()[swipeItemList.length - 1]).clone());
	swipe.append($(swipe.children()[1]).clone());

	rightLimit = swipe.children().get(swipeItemList.length).offsetLeft;
	leftLimit = swipe.children().get(1).offsetLeft;

	swipe.addClass('swipe-transition');
}

function setBtnClick() {
	$('.left-btn').click(() => {
		changeSwipe(index - 1);
	});
	$('.right-btn').click(() => {
		changeSwipe(index + 1);
	});
}

function autoMaticCarousel() {
	autoTimer = setInterval(() => {
		changeSwipe(index + 1);
	}, autoInterval);
}

function setStopTimer() {
	content.mouseenter(() => {
		clearInterval(autoTimer);
		autoTimer = 0;
	});

	content.mouseleave(() => {
		if (autoTimer) return;

		autoMaticCarousel();
	});
}

function changeSwipe(i, noTransition) {
	if (i > swipeItemList.length + 1) i = swipeItemList.length + 1;
	if (i < 0) i = 0;

	index = i;

	const left = getSwipePos();

	if (noTransition) {
		swipe.animate(
			{
				left: `${-left}px`,
			},
			0,
			'swing',
			checkBeyondLimit
		);

		return;
	}

	swipe.animate(
		{
			left: `${-left}px`,
		},
		300,
		'swing',
		checkBeyondLimit
	);
}

function checkBeyondLimit() {
	if (index > swipeItemList.length) {
		changeSwipe(1, true);
		return;
	} else if (index < 1) {
		changeSwipe(swipeItemList.length, true);
		return;
	}
}

function getSwipePos(i = index) {
	return swipe.children().get(i).offsetLeft;
}
