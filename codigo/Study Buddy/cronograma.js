const daysTag = document.querySelector(".days"),
    currentDate = document.querySelector(".current-date"),
    prevNextIcon = document.querySelectorAll(".icons span");
const taskList = document.querySelector(".task-list");
const modalEdit = document.getElementsByClassName("modal-edit")[0];
modalEdit.style.display = "none";
document.querySelector(".lista").style.display = "none";
document.querySelector(".lista").style.display = "block";
const taskEditName = document.getElementById("edit-task-name");
const taskEditDate = document.getElementById("edit-task-date");
const saveEdit = document.getElementById("edit-task");
let IDS = 0;

let date = new Date(),
    currYear = date.getFullYear(),
    currMonth = date.getMonth();

document.addEventListener("DOMContentLoaded", () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'login.html';
        return;
    }

    renderTaskList();
    renderCalendar();
});

const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(),
        lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),
        lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(),
        lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
    let liTag = "";

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    const userTasks = tasks[loggedInUser.email] || [];

    for (let i = firstDayofMonth; i > 0; i--) {
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) {
        let isToday = i === date.getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear() ? "active" : "";

        let hasTask = userTasks.some(task => {
            const taskDate = new Date(task.date);
            return taskDate.getFullYear() === currYear && taskDate.getMonth() === currMonth && taskDate.getDate() === i;
        });

        let taskClass = "";
        if (hasTask) {
            let task = userTasks.find(task => {
                const taskDate = new Date(task.date);
                return taskDate.getFullYear() === currYear && taskDate.getMonth() === currMonth && taskDate.getDate() === i;
            });
            taskClass = task.done ? "done" : "task";
        }

        liTag += `<li class="${isToday} ${taskClass}">${i}</li>`;
    }

    for (let i = lastDayofMonth; i < 6; i++) {
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
    }
    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    daysTag.innerHTML = liTag;
}


prevNextIcon.forEach(icon => {
    icon.addEventListener("click", () => {
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if (currMonth < 0 || currMonth > 11) {
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear();
            currMonth = date.getMonth();
        } else {
            date = new Date();
        }
        renderCalendar();
    });
});

function renderTaskList() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    const userTasks = tasks[loggedInUser.email] || [];

    const taskList = document.querySelector('.task-list');
    taskList.innerHTML = ''; // Limpa a lista de tarefas

    userTasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task');
        taskItem.innerHTML = `
            <p>${task.name}</p>
            <div>
                <span class="material-symbols-rounded finish" onclick="finishTask(${task.id})">check</span>
                <span class="material-symbols-rounded edit" onclick="editTask(${task.id})">edit</span>
                <span class="material-symbols-rounded delete" onclick="deleteTask(${task.id})">delete</span>
            </div>
        `;
        taskList.appendChild(taskItem);
    });
}

function createTask() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    let tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    let userTasks = tasks[loggedInUser.email] || [];

    const taskName = document.getElementById('task-name').value;
    const taskDate = document.getElementById('task-date').value;

    if (taskName === "" || taskDate === "") {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    const task = {
        id: IDS++,
        name: taskName,
        date: taskDate,
        done: false
    };

    userTasks.push(task);
    tasks[loggedInUser.email] = userTasks;
    localStorage.setItem('tasks', JSON.stringify(tasks));

    renderTaskList();
    renderCalendar();

    document.getElementById('task-name').value = "";
    document.getElementById('task-date').value = "";
}

function deleteTask(taskId) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    let tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    tasks[loggedInUser.email] = tasks[loggedInUser.email].filter(task => task.id != taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTaskList();
    renderCalendar();
}

function editTask(taskId) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    let tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    let userTasks = tasks[loggedInUser.email] || [];
    let task = userTasks.find(task => task.id == taskId);

    taskEditName.value = task.name;
    taskEditDate.value = task.date;

    modalEdit.style.display = "block";
    const listfinal = document.querySelector(".task-list");
    listfinal.style.display = "none";
    const lista = document.querySelector(".lista");
    lista.style.display = "none";

    saveEdit.onclick = () => {
        task.name = taskEditName.value;
        task.date = taskEditDate.value;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTaskList();
        renderCalendar();

        modalEdit.style.display = "none";
        lista.style.display = "block";
        listfinal.style.display = "block";
    };
}

function finishTask(taskId) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    let tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    let userTasks = tasks[loggedInUser.email] || [];
    let task = userTasks.find(task => task.id == taskId);
    task.done = !task.done;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTaskList();
    renderCalendar();
}

document.getElementById("add-task").addEventListener("click", createTask);
