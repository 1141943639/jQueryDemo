import './nav.scss';
import html from './nav.html';

const list = [
	{
		url: 'snakeEating/snakeEating.html',
		text: '贪吃蛇',
	},
	{
		url: 'swipe/swipe.html',
		text: '轮播图',
	},
	{
		url: 'shopCart/shopCart.html',
		text: '购物车',
	},
	{
		url: 'todoList/todoList.html',
		text: 'TodoList',
	},
];

function render(el) {
	$(el).html(html);

	const nav = $('.nav-wrap');

	list.forEach(({ url, text }, index) => {
		const child = $(document.createElement('div'));

		child.addClass('nav-item');

		child.click(() => {
			location.pathname = url;
		});

		child.text(text);

		nav.append(child);
	});
}

export default render;
