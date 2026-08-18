const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const searchInput = document.getElementById("search-input");
const filterButtons = document.querySelectorAll("[data-filter]");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

todoForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const task = todoInput.value.trim();

  if (task === "") {
    return;
  }

  const todo = {
    id: Date.now(),
    text: task,
    completed: false,
  };

  todos.push(todo);
  saveTodos();
  renderTodos();

  todoInput.value = "";
});

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
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
    const todoItem = document.createElement("li");

    const todoText = document.createElement("span");
    todoText.textContent = todo.text;

    if (todo.completed) {
      todoText.classList.add("completed");
    }

    todoText.addEventListener("click", function () {
      todo.completed = !todo.completed;
      saveTodos();
      renderTodos();
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
      todos = todos.filter(function (item) {
        return item.id !== todo.id;
      });

      saveTodos();
      renderTodos();
    });

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Edit";

    editButton.addEventListener("click", function () {
      const updatedTask = prompt("Edit your task:", todo.text);

      if (updatedTask === null) {
        return;
      }

      const trimmedTask = updatedTask.trim();

      if (trimmedTask === "") {
        return;
      }

      todo.text = trimmedTask;

      saveTodos();
      renderTodos();
    });

    todoItem.append(todoText, editButton, deleteButton);
    todoList.appendChild(todoItem);
  });
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

renderTodos();
