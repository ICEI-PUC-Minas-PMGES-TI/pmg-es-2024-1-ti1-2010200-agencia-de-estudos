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

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    for (let i = firstDayofMonth; i > 0; i--) { 
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) { 
        let isToday = i === date.getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear() ? "active" : "";

        let hasTask = tasks.some(task => {
            const taskDate = new Date(task.date);
            return taskDate.getFullYear() === currYear && taskDate.getMonth() === currMonth && taskDate.getDate() === i;
        });

        let taskClass = "";
        if (hasTask) {
            let task = tasks.find(task => {
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

        if(currMonth < 0 || currMonth > 11) { 
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
    const tasks = localStorage.getItem("tasks");

    if(tasks) {
        taskList.innerHTML = "";

        const tasksItens = JSON.parse(tasks);

        tasksItens.forEach(task => {
            const taskItem = document.createElement("div");
            taskItem.classList.add("task");

            const p = document.createElement("p");
            p.innerText = task.name;
            taskItem.appendChild(p);

            const div = document.createElement("div");
            div.id = task.id;

            const finish = document.createElement("span");
            finish.classList.add("material-symbols-rounded");
            finish.classList.add("finish");
            finish.innerText = "check";
            finish.id = task.id;

            const edit = document.createElement("span");
            edit.classList.add("material-symbols-rounded");
            edit.classList.add("edit");
            edit.innerText = "edit";
            edit.id = task.id;

            const del = document.createElement("span");
            del.classList.add("material-symbols-rounded");
            del.classList.add("delete");
            del.innerText = "delete";
            del.name = "delete";
            del.id = task.id;

            div.appendChild(finish);
            div.appendChild(edit);
            div.appendChild(del);
            taskItem.appendChild(div);
            taskList.appendChild(taskItem);
        
        });

        let deleteButtons = document.querySelectorAll(".delete");
        deleteButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                deleteTask(e.target.id);
            });
        });

        let editButtons = document.querySelectorAll(".edit");
        editButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                editTask(e.target.id);
            });
        });

        let finishButtons = document.querySelectorAll(".finish");
        finishButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                finishTask(e.target.id);
            });
        });  

    } 
}

function createTask() {
    let taskName = document.getElementById("task-name").value;
    let taskDate = document.getElementById("task-date").value;

    if (taskName === "" || taskDate === "") {
        alert("Por favor, preencha todos os campos!");
        return;
    } else{
        const task = {
            id: IDS++,
            name: taskName,
            date: taskDate,
            done: false
        };

        const taskDateObj = new Date(taskDate);
        taskDateObj.setDate(taskDateObj.getDate() + 1);
        task.date = taskDateObj.toISOString().split('T')[0];

        let tasks = localStorage.getItem("tasks");

        if(tasks) {
            tasks = JSON.parse(tasks);
            tasks.push(task);
        } else {
            tasks = [task];
        }

        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTaskList();
        renderCalendar(); 
    }

    document.getElementById("task-name").value = "";
    document.getElementById("task-date").value = "";
}

function deleteTask(taskId) {
    let tasks = localStorage.getItem("tasks");
    tasks = JSON.parse(tasks);
    tasks = tasks.filter(task => task.id != taskId);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTaskList();
    renderCalendar(); 
}


function editTask(taskId) {
    let tasks = localStorage.getItem("tasks");
    tasks = JSON.parse(tasks);
    let task = tasks.find(task => task.id == taskId);

    taskEditName.value = task.name;
    taskEditDate.value = task.date;

    modalEdit.style.display = "block";
        const listfinal = document.querySelector(".task-list");
        listfinal.style.display = "none";
        const lista = document.querySelector(".lista");
        lista.style.display = "none";

    saveEdit.addEventListener("click", () => {
        task.name = taskEditName.value;
        task.date = taskEditDate.value;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTaskList();
        renderCalendar(); 

        modalEdit.style.display = "none";
        lista.style.display = "block";
        listfinal.style.display = "block";
    });

}

function finishTask(taskId) {
    let tasks = localStorage.getItem("tasks");
    tasks = JSON.parse(tasks);
    let task = tasks.find(task => task.id == taskId);
    task.done = !task.done;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTaskList();
    renderCalendar(); 
}

document.getElementById("add-task").addEventListener("click", createTask);
