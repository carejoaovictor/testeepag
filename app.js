const taskForm = document.querySelector("#task-form");
const taskList = document.querySelector("#task-list");
const emptyState = document.querySelector("#task-empty");
const activeCount = document.querySelector("#active-count");
const doneCount = document.querySelector("#done-count");
const chips = document.querySelectorAll(".chip");

const tasks = [];
let activeFilter = "all";

const formatDate = (value) => {
  const date = new Date(value);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const updateStats = () => {
  const activeTasks = tasks.filter((task) => !task.done);
  const doneTasks = tasks.filter((task) => task.done);
  activeCount.textContent = activeTasks.length;
  doneCount.textContent = doneTasks.length;
};

const renderTasks = () => {
  const visibleTasks = tasks.filter((task) => {
    if (activeFilter === "all") {
      return true;
    }
    return task.priority === activeFilter;
  });

  taskList.innerHTML = "";

  if (!visibleTasks.length) {
    taskList.appendChild(emptyState);
  }

  visibleTasks.forEach((task) => {
    const card = document.createElement("article");
    card.className = "task-card";

    card.innerHTML = `
      <div class="task-card__header">
        <div>
          <p class="task-card__title">${task.title}</p>
          <p>${task.description}</p>
        </div>
        <span class="task-card__badge badge--${task.priority}">${task.priority}</span>
      </div>
      <div class="task-card__meta">
        <span>Responsável: <strong>${task.owner}</strong></span>
        <span>Prazo: <strong>${formatDate(task.dueDate)}</strong></span>
      </div>
      <div class="task-card__footer">
        <label class="task-card__status">
          <input type="checkbox" ${task.done ? "checked" : ""} data-id="${task.id}" />
          ${task.done ? "Concluída" : "Em andamento"}
        </label>
        <span>Atualizado ${task.updatedAt}</span>
      </div>
    `;

    taskList.appendChild(card);
  });

  updateStats();
};

const refreshUpdatedAt = () =>
  new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

const setActiveChip = (chip) => {
  chips.forEach((button) => button.classList.remove("chip--active"));
  chip.classList.add("chip--active");
};

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    activeFilter = chip.dataset.filter;
    setActiveChip(chip);
    renderTasks();
  });
});

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(taskForm);

  const task = {
    id: crypto.randomUUID(),
    title: data.get("title"),
    owner: data.get("owner"),
    priority: data.get("priority"),
    dueDate: data.get("dueDate"),
    description: data.get("description"),
    done: false,
    updatedAt: refreshUpdatedAt(),
  };

  tasks.unshift(task);
  taskForm.reset();
  renderTasks();
});

taskList.addEventListener("change", (event) => {
  const checkbox = event.target;
  if (checkbox.matches("input[type='checkbox']")) {
    const task = tasks.find((item) => item.id === checkbox.dataset.id);
    if (task) {
      task.done = checkbox.checked;
      task.updatedAt = refreshUpdatedAt();
      renderTasks();
    }
  }
});

renderTasks();
