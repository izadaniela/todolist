// Recupera as tarefas do localStorage, se houver
document.addEventListener("DOMContentLoaded", loadTasks);

const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");

// Adiciona uma tarefa à lista
addTaskButton.addEventListener("click", addTask);
taskInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

function addTask() {
  const taskText = taskInput.value.trim();

  if (taskText !== "") {
    // Cria um novo item da lista
    const li = document.createElement("li");
    li.setAttribute("draggable", "true");
    li.innerHTML = `${taskText} <button class="delete">X</button>`;

    // Adiciona o evento de exclusão
    li.querySelector(".delete").addEventListener("click", () => {
      li.remove();
      saveTasks();
    });

    // Adiciona a tarefa à lista no HTML
    taskList.appendChild(li);

    // Limpa o campo de entrada
    taskInput.value = "";

    // Salva as tarefas no localStorage
    saveTasks();

    // Adiciona a funcionalidade de arrastar
    li.addEventListener("dragstart", dragStart);
    li.addEventListener("dragover", dragOver);
    li.addEventListener("dragenter", dragEnter);
    li.addEventListener("dragleave", dragLeave);
    li.addEventListener("drop", drop);
    li.addEventListener("dragend", dragEnd);
  }
}

// Função para salvar as tarefas no localStorage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll(".task-list li").forEach((taskItem) => {
    tasks.push(taskItem.firstChild.textContent.trim());
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Função para carregar as tarefas do localStorage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks"));

  if (tasks) {
    tasks.forEach((taskText) => {
      const li = document.createElement("li");
      li.setAttribute("draggable", "true");
      li.innerHTML = `${taskText} <button class="delete">X</button>`;

      // Adiciona o evento de exclusão
      li.querySelector(".delete").addEventListener("click", () => {
        li.remove();
        saveTasks();
      });

      taskList.appendChild(li);

      // Adiciona a funcionalidade de arrastar
      li.addEventListener("dragstart", dragStart);
      li.addEventListener("dragover", dragOver);
      li.addEventListener("dragenter", dragEnter);
      li.addEventListener("dragleave", dragLeave);
      li.addEventListener("drop", drop);
      li.addEventListener("dragend", dragEnd);
    });
  }
}

let draggingElement = null;

// Função chamada quando o início do arrasto começa
function dragStart(e) {
  draggingElement = this;
  this.classList.add("dragging");
}

// Função chamada quando o item está sendo arrastado
function dragOver(e) {
  e.preventDefault();
}

// Função chamada quando o item entra na área de outro item
function dragEnter(e) {
  e.preventDefault();
  this.style.borderTop = "2px dashed #ccc";
}

// Função chamada quando o item sai da área de outro item
function dragLeave() {
  this.style.borderTop = "none";
}

// Função chamada quando o item é solto
function drop() {
  this.style.borderTop = "none";
  taskList.insertBefore(draggingElement, this);
  saveTasks();
}

// Função chamada quando o arrasto é finalizado
function dragEnd() {
  this.classList.remove("dragging");
}
