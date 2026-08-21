const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const todoCount = document.getElementById("todo-count");
const searchInput = document.getElementById("search-input");
const filterButtons = document.querySelectorAll("[data-filter]");
const clearCompletedButton = document.getElementById("clear-completed");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

todoForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const task = todoInput.value.trim();

  if (!validateTodoText(task)) {
    return;
  }

  addTodo(task);

  todoInput.value = "";
});

function addTodo(task) {
  const todo = {
    id: Date.now(),
    text: task,
    completed: false,
  };

  todos.push(todo);

  saveTodos();
  renderTodos();
}

function toggleTodo(id, completed) {
  const todo = todos.find(function (item) {
    return item.id === id;
  });

  if (!todo) {
    return;
  }

  todo.completed = completed;

  saveTodos();
  renderTodos();
}

function updateTodo(id, text) {
  const todo = todos.find(function (item) {
    return item.id === id;
  });

  if (!todo) {
    return;
  }

  todo.text = text;

  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter(function (item) {
    return item.id !== id;
  });

  saveTodos();
  renderTodos();
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function validateTodoText(text) {
  if (text === "") {
    return false;
  }

  if (text.length > 100) {
    alert("Todo cannot be longer than 100 characters.");
    return false;
  }

  return true;
}

function updateTodoCount() {
  const activeTodos = todos.filter(function (todo) {
    return !todo.completed;
  });

  const itemText = activeTodos.length === 1 ? "item" : "items";

  todoCount.textContent = `${activeTodos.length} ${itemText} left`;
}

function renderTodos() {
  todoList.innerHTML = "";

  const searchTerm = searchInput.value.toLowerCase().trim();

  const filteredTodos = todos.filter(function (todo) {
    const matchesSearch = todo.text.toLowerCase().includes(searchTerm);

    const matchesFilter =
      currentFilter === "all" ||
      (currentFilter === "active" && !todo.completed) ||
      (currentFilter === "completed" && todo.completed);

    return matchesSearch && matchesFilter;
  });

  filteredTodos.forEach(function (todo) {
    const todoElement = createTodoElement(todo);

    todoList.appendChild(todoElement);
  });

  if (filteredTodos.length === 0) {
    const emptyMessage = document.createElement("li");

    if (todos.length === 0) {
      emptyMessage.textContent = "No tasks yet. Add your first task!";
    } else {
      emptyMessage.textContent = "No tasks found.";
    }

    emptyMessage.classList.add("empty-message");

    todoList.appendChild(emptyMessage);
  }

  updateTodoCount();
}

function createTodoElement(todo) {
  const todoItem = document.createElement("li");

  const todoCheckbox = document.createElement("input");
  todoCheckbox.type = "checkbox";
  todoCheckbox.checked = todo.completed;

  todoCheckbox.addEventListener("change", function () {
    toggleTodo(todo.id, todoCheckbox.checked);
  });

  const todoText = document.createElement("span");
  todoText.textContent = todo.text;

  if (todo.completed) {
    todoText.classList.add("completed");
  }

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.textContent = "Edit";

  editButton.addEventListener("click", function () {
    const updatedTask = prompt("Edit your task:", todo.text);

    if (updatedTask === null) {
      return;
    }

    const trimmedTask = updatedTask.trim();

    if (!validateTodoText(trimmedTask)) {
      return;
    }

    updateTodo(todo.id, trimmedTask);
  });

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";

  deleteButton.addEventListener("click", function () {
    const confirmed = confirm(`Delete "${todo.text}"?`);

    if (!confirmed) {
      return;
    }

    deleteTodo(todo.id);
  });

  todoItem.append(todoCheckbox, todoText, editButton, deleteButton);

  return todoItem;
}

searchInput.addEventListener("input", function () {
  renderTodos();
});

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentFilter = button.dataset.filter;

    renderTodos();
  });
});

clearCompletedButton.addEventListener("click", function () {
  const completedTodos = todos.filter(function (todo) {
    return todo.completed;
  });

  if (completedTodos.length === 0) {
    return;
  }

  const confirmed = confirm(
    "Are you sure you want to clear all completed tasks?",
  );

  if (!confirmed) {
    return;
  }

  todos = todos.filter(function (todo) {
    return !todo.completed;
  });

  saveTodos();
  renderTodos();
});

renderTodos();
