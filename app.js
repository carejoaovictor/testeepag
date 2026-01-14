const taskForm = document.querySelector("#task-form");
const taskList = document.querySelector("#task-list");
const filterTabs = document.querySelectorAll(".filter-tab");
const countAll = document.querySelector("#count-all");
const countPending = document.querySelector("#count-pending");
const countDone = document.querySelector("#count-done");
const progressText = document.querySelector("#progress-text");
const progressFill = document.querySelector("#progress-fill");
const taskTemplate = document.querySelector("#task-template");
const emptyTemplate = document.querySelector("#empty-template");

const tasks = [
  {
    id: crypto.randomUUID(),
    title: "Revisar documentação do projeto",
    description: "Verificar se todas as seções estão atualizadas",
    priority: "high",
    date: "10 de jan. de 2024",
    done: false,
  },
  {
    id: crypto.randomUUID(),
    title: "Responder e-mails pendentes",
    description: "",
    priority: "medium",
    date: "11 de jan. de 2024",
    done: false,
  },
  {
    id: crypto.randomUUID(),
    title: "Atualizar dependências",
    description: "Verificar versões desatualizadas e fazer upgrade",
    priority: "low",
    date: "09 de jan. de 2024",
    done: true,
  },
];

let activeFilter = "all";

const priorityLabels = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};

const formatDate = (value) => {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const updateProgress = () => {
  const total = tasks.length;
  const done = tasks.filter((task) => task.done).length;
  countAll.textContent = total;
  countPending.textContent = total - done;
  countDone.textContent = done;
  progressText.textContent = `${done} de ${total} concluídas`;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  progressFill.style.width = `${percent}%`;
};

const matchesFilter = (task) => {
  if (activeFilter === "all") {
    return true;
  }
  if (activeFilter === "pending") {
    return !task.done;
  }
  return task.done;
};

const createTaskCard = (task) => {
  const fragment = taskTemplate.content.cloneNode(true);
  const card = fragment.querySelector(".task-card");
  const checkbox = fragment.querySelector(".task-checkbox");
  const title = fragment.querySelector(".task-title");
  const badge = fragment.querySelector(".priority-badge");
  const description = fragment.querySelector(".task-description");
  const date = fragment.querySelector(".task-date");
  const reopenButton = fragment.querySelector(".btn-reopen");
  const deleteButton = fragment.querySelector(".btn-delete");

  card.dataset.id = task.id;
  title.textContent = task.title;
  badge.textContent = priorityLabels[task.priority];
  badge.classList.add(`priority-${task.priority}`);
  date.textContent = task.date;

  if (task.description) {
    description.textContent = task.description;
  } else {
    description.remove();
  }

  if (task.done) {
    card.classList.add("completed");
    checkbox.classList.add("checked");
    checkbox.setAttribute("aria-label", "Reabrir tarefa");
  } else {
    reopenButton.remove();
  }

  checkbox.addEventListener("click", () => toggleTask(task.id));
  if (reopenButton) {
    reopenButton.addEventListener("click", () => toggleTask(task.id));
  }
  deleteButton.addEventListener("click", () => removeTask(task.id));

  return fragment;
};

const renderTasks = () => {
  taskList.innerHTML = "";
  const visibleTasks = tasks.filter(matchesFilter);

  if (visibleTasks.length === 0) {
    taskList.appendChild(emptyTemplate.content.cloneNode(true));
    updateProgress();
    return;
  }

  visibleTasks.forEach((task) => {
    taskList.appendChild(createTaskCard(task));
  });

  updateProgress();
};

const toggleTask = (id) => {
  const task = tasks.find((item) => item.id === id);
  if (!task) {
    return;
  }
  task.done = !task.done;
  renderTasks();
};

const removeTask = (id) => {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    return;
  }
  tasks.splice(index, 1);
  renderTasks();
};

const setActiveTab = (tab) => {
  filterTabs.forEach((button) => button.classList.remove("active"));
  tab.classList.add("active");
};

filterTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activeFilter = tab.dataset.filter;
    setActiveTab(tab);
    renderTasks();
  });
});

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(taskForm);
  const title = formData.get("title").trim();
  const description = formData.get("description").trim();

  if (!title) {
    return;
  }

  const task = {
    id: crypto.randomUUID(),
    title,
    description,
    priority: formData.get("priority"),
    date: formatDate(new Date()),
    done: false,
  };

  tasks.unshift(task);
  taskForm.reset();
  renderTasks();
});

renderTasks();
