const formNewTodo = document.querySelector('[data-form-new-todo]');
const inputNewTodo = document.querySelector('[data-input-new-todo]');
const containerSavedTodos = document.querySelector('[data-container-todos]');
const LOCAL_STORAGE_KEY = 'todo.lists';
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];

const clearElement = element => {
	while (element.firstChild) element.removeChild(element.firstChild);
};

const save = () => {
	localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(lists));
};

const render = () => {
	clearElement(containerSavedTodos);
	if (lists.length) {
		lists.forEach(list => {
			const template = document.querySelector('#template');
			const cloned = document.importNode(template.content, true);
			const li = cloned.querySelector('[data-list-item]');
			const checkbox = cloned.querySelector('[data-checkbox]');
			const task = cloned.querySelector('[data-text-task]');
			li.setAttribute('data-id', list.id);
			checkbox.checked = list.isCompleted;
			task.innerText = list.task;
			containerSavedTodos.append(cloned);
		});
	}
};

const createList = task => {
	return {
		id: Date.now().toString(),
		task: task,
		isCompleted: false,
	};
};

const submitNewTask = e => {
	e.preventDefault();
	const task = inputNewTodo.value;
	lists.push(createList(task));
	save();
	render();
	inputNewTodo.value = '';
};

const completeTask = (id, element) => {
	let state = element.checked ? true : false;
	const list = lists.find(list => list.id === id);
	list.isCompleted = state;
	element.closest('li').setAttribute('data-completed', state);
};

const deleteTask = id => {
	lists = lists.filter(list => list.id != id);
	save();
	render();
};

const handleClick = event => {
	const element = event.target;
	const id = element.closest('li').getAttribute('data-id');
	if (element.hasAttribute('data-checkbox')) completeTask(id, element);
	else if (element.hasAttribute('data-delete')) deleteTask(id);
	else return;
};

formNewTodo.addEventListener('submit', e => submitNewTask(e));
containerSavedTodos.addEventListener('click', e => handleClick(e));
render();
