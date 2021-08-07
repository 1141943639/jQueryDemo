import {
	todoList,
	changeItemProperty,
	deleteItemData,
	selectAll,
	isSelectAll,
	addNewTodo,
	updateCompletedList,
	updateActiveList,
	updateAllList,
	deleteCompletedData,
	getActiveList,
} from '../localStorageOperation/todoList.js';

import navRender from '../commonTemplate/nav/nav.js';
import todoHeadRender from './todoHead/todoHead.js';
import todoItemRender from './todoItem/todoItem.js';
import todoFootRender from './todoFoot/todoFoot.js';

navRender('.nav');

export function initElement() {
	initTitle();
	initBody();
	initFoot();
}

function initBody() {
	todoItemRender('.todo-list-body', {
		todoList,
	});

	$('.todo-item').each(function (index) {
		$(this).attr('data-id', todoList[index].id);
	});

	setSelectEvent();
	setDeleteEvent();
	setClickInputEvent();
}

function initTitle() {
	todoHeadRender('.todo-list-head', {
		selectAll: isSelectAll(),
	});

	setSelectAllEvent();
	setAddTodo();
}

function initFoot() {
	todoFootRender('.todo-list-foot', {
		completedLength: getActiveList().length,
	});

	setChangeList();
	setClearCompletedEvent();
}

function setSelectEvent() {
	$('.todo-item-select').click(function () {
		const id = findElId(this);

		if (getChildrenEl(id, '.todo-item-input').attr('data-show') === 'false')
			return;

		const value = !($(this).attr('data-select') === 'false' ? false : true);

		changeSelectEl(id, value);
		checkSelectAll();
	});
}

function changeSelectEl(id, value) {
	const selectEl = getChildrenEl(id, '.todo-item-select');

	changeItemProperty(id, 'select', value);
	selectEl.attr('data-select', value);
	updateTodoList();
}

function setDeleteEvent() {
	$('.todo-item-delete').click(({ target }) => {
		const id = findElId(target);

		deleteEl(id);
	});
}

function deleteEl(id) {
	deleteItemData(id);
	$('.todo-item').remove(`[data-id=${id}]`);
}

function setAddTodo() {
	$('.todo-list-head-input-box').keydown(function ({ keyCode }) {
		if (keyCode !== 13) return;
		if (!this.value) return;

		addTodo(this.value);

		this.value = '';
	});
}

function addTodo(text) {
	addNewTodo(text);
	updateTodoList();
}

function setClickInputEvent() {
	let reductionSelect = false;

	$('.todo-item-input-text').dblclick(function () {
		const id = findElId(this);
		if (
			getChildrenEl(id, '.todo-item-select').attr('data-select') ===
			'true'
		) {
			getChildrenEl(id, '.todo-item-select').attr('data-select', false);

			reductionSelect = true;
		}

		const inputEl = $(this).parents('[data-show]');
		const inputBox = $(this).siblings('.todo-item-input-box')[0];
		const showBox = this;

		inputEl.attr('data-show', false);

		inputBox.value = $(this).text();
		inputBox.focus();

		$(document).click(function fn({ target }) {
			const id = findElId(inputEl);

			if (
				($(target).attr('data-show') ||
					$(target).parents('[data-show]').length) &&
				id === findElId(target)
			)
				return;

			if (!inputBox.value) {
				deleteEl(id);
			}

			$(showBox).text(inputBox.value);
			changeItemProperty(id, 'text', inputBox.value);

			if (reductionSelect) {
				changeSelectEl(id, true);

				reductionSelect = false;
			}

			inputEl.attr('data-show', true);
			$(document).off('click', fn);
		});
	});

	$('.todo-item-input-box').keydown(function ({ keyCode }) {
		if (keyCode !== 13) return;

		const id = findElId(this);
		const inputEl = $(this).parents('[data-show]');
		const showBox = $(this).siblings('.todo-item-input-text');

		changeItemProperty(id, 'text', this.value);
		showBox.text(this.value);

		if (!this.value) {
			deleteEl(id);
		}

		if (reductionSelect) {
			changeSelectEl(id, true);

			reductionSelect = false;
		}

		inputEl.attr('data-show', true);
	});
}

function setSelectAllEvent() {
	$('.todo-list-head-check-all').click(function () {
		selectAllEl();
	});
}

function selectAllEl(value = !isSelectAll()) {
	$('.todo-item').each(function () {
		const id = findElId(this);
		const selectEl = getChildrenEl(id, '.todo-item-select');

		selectEl.attr('data-select', value);
	});

	$('.todo-list-head-check-all').attr('data-select-all', value);
	selectAll(value);
	updateTodoList();
}

function checkSelectAll() {
	if (isSelectAll()) {
		$('.todo-list-head-check-all').attr('data-select-all', true);
	} else {
		$('.todo-list-head-check-all').attr('data-select-all', false);
	}
}

function setChangeList() {
	$('.todo-list-foot-center-item').click(function () {
		$(this)
			.siblings()
			.each(function () {
				$(this).removeClass('active');
			});

		$(this).addClass('active');
		$(this).parents('[data-active]').attr('data-active', $(this).text());
		updateTodoList();
	});
}

function updateTodoList() {
	const text = $('.todo-list-foot-center').attr('data-active');

	switch (text) {
		case 'All':
			updateAllList();
			initBody();
			changeItemLeft();
			break;
		case 'Active':
			updateActiveList();
			initBody();
			changeItemLeft();
			break;
		case 'Completed':
			updateCompletedList();
			initBody();
			changeItemLeft();
			break;
	}

	function changeItemLeft() {
		$('.todo-list-foot-left-item').text(
			`${getActiveList().length} item left`
		);
	}
}

function setClearCompletedEvent() {
	$('.todo-list-foot-right-item').click(deleteCompleted);
}

function deleteCompleted() {
	deleteCompletedData();
	updateTodoList();
	checkSelectAll();
}

// 工具函数

function findElId(target) {
	return (
		$(target).attr('data-id') ||
		$(target).parents('[data-id]').attr('data-id')
	);
}

function getChildrenEl(id, selector) {
	return $(`[data-id=${id}] ${selector}`);
}
