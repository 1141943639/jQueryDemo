if (!localStorage.getItem('todoList')) {
	localStorage.setItem('todoList', '[]');
}

const originTodoList = JSON.parse(localStorage.getItem('todoList'));

export const todoList = [...originTodoList];

if (todoList.length < 1) {
	addNewTodo('111');
}

// 添加新的代办事项
export function addNewTodo(text) {
	originTodoList.push({
		text,
		select: false,
		id: getTodoId(),
	});

	changeOriginTodoList();
}

// 删除一条信息
export function deleteItemData(id) {
	id = Number(id);

	const { index } = getTodoItemData(id);

	originTodoList.splice(index, 1);

	changeOriginTodoList();

	return index;
}

export function deleteCompletedData() {
	originTodoList.splice(
		0,
		originTodoList.length,
		...originTodoList.filter(({ select }) => !select)
	);

	changeOriginTodoList();
}

// 更改item的属性
export function changeItemProperty(id, key, value) {
	id = Number(id);

	let res;

	originTodoList.forEach((item) => {
		if (item.id === id) {
			item[key] = value;

			res = item.select;

			return;
		}
	});

	changeOriginTodoList();

	return res;
}

// 全选
export function selectAll(value) {
	todoList.forEach((item) => {
		item.select = value;
	});

	const newList = Object.assign(originTodoList, todoList);

	originTodoList.splice(0, originTodoList.length, ...newList);

	changeOriginTodoList();
}

// 检测是否全选
export function isSelectAll() {
	if (!todoList.length) return false;

	return todoList.every(({ select }) => select);
}

// 获取并更新未完成的列表
export function updateActiveList() {
	const activeList = originTodoList.filter(({ select }) => !select);

	todoList.splice(0, todoList.length, ...activeList);
}

// 获取并更新已完成的列表
export function updateCompletedList() {
	const completedList = originTodoList.filter(({ select }) => select);

	todoList.splice(0, todoList.length, ...completedList);
}

// 获取并更新全部事项列表
export function updateAllList() {
	todoList.splice(0);

	todoList.splice(0, todoList.length, ...originTodoList);
}

export function getActiveList() {
	return originTodoList.filter(({ select }) => !select);
}

// 更新local的todoList
function changeOriginTodoList() {
	localStorage.setItem('todoList', JSON.stringify(originTodoList));
}

// 获取一条信息的数据和索引
function getTodoItemData(todoId) {
	return {
		todo: todoList.find(({ id }) => id === todoId),
		index: todoList.findIndex(({ id }) => id === todoId),
	};
}

// 获取id并加一
function getTodoId() {
	const idList = originTodoList.map(({ id }) => id);

	if (!idList.length) return 1;

	return Math.max(...idList) + 1;
}
