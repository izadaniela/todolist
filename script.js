document.addEventListener("DOMContentLoaded", loadTasks);

const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");

addTaskButton.addEventListener("click", addTask);
taskInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

function addTask() {
  const taskText = taskInput.value.trim();

  if (taskText !== "") {
    const li = document.createElement("li");
    li.setAttribute("draggable", "true");
    li.innerHTML = `${taskText} <button class="delete">X</button>`;

    li.querySelector(".delete").addEventListener("click", () => {
      li.remove();
      saveTasks();
    });

    taskList.appendChild(li);
    taskInput.value = "";
    saveTasks();
    addDragAndTouchEvents(li);
  }
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll(".task-list li").forEach((taskItem) => {
    tasks.push(taskItem.firstChild.textContent.trim());
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  if (tasks) {
    tasks.forEach((taskText) => {
      const li = document.createElement("li");
      li.setAttribute("draggable", "true");
      li.innerHTML = `${taskText} <button class="delete">X</button>`;

      li.querySelector(".delete").addEventListener("click", () => {
        li.remove();
        saveTasks();
      });

      taskList.appendChild(li);
      addDragAndTouchEvents(li);
    });
  }
}

function addDragAndTouchEvents(li) {
  li.addEventListener("dragstart", dragStart);
  li.addEventListener("dragover", dragOver);
  li.addEventListener("dragenter", dragEnter);
  li.addEventListener("dragleave", dragLeave);
  li.addEventListener("drop", drop);
  li.addEventListener("dragend", dragEnd);

  li.addEventListener("touchstart", touchStart, { passive: false });
  li.addEventListener("touchmove", touchMove, { passive: false });
  li.addEventListener("touchend", touchEnd);
}

let draggingElement = null;
let touchOffsetY = 0;

function dragStart(e) {
  draggingElement = this;
  this.classList.add("dragging");
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
  this.style.borderTop = "2px dashed #ccc";
}

function dragLeave() {
  this.style.borderTop = "none";
}

function drop() {
  this.style.borderTop = "none";
  taskList.insertBefore(draggingElement, this);
  saveTasks();
}

function dragEnd() {
  this.classList.remove("dragging");
}

function touchStart(e) {
  draggingElement = e.target.closest("li");
  if (!draggingElement) return;
  touchOffsetY = e.touches[0].clientY - draggingElement.getBoundingClientRect().top;
  draggingElement.classList.add("dragging");
}

function touchMove(e) {
  if (!draggingElement) return;
  e.preventDefault();
  let touchY = e.touches[0].clientY - touchOffsetY;
  let items = [...taskList.children];

  items.forEach((item) => {
    if (item !== draggingElement) {
      let box = item.getBoundingClientRect();
      let middle = box.top + box.height / 2;
      if (touchY < middle) {
        taskList.insertBefore(draggingElement, item);
      }
    }
  });
}

function touchEnd() {
  if (draggingElement) {
    draggingElement.classList.remove("dragging");
    saveTasks();
  }
}
