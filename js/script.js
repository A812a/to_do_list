
let newTaskBtn = document.getElementById('newTask')
let model = document.getElementById('modal');
let addBtnModel = document.getElementById('addBtn');
let inputsModel = document.querySelectorAll('.form-floating')
let taskStatusInput = document.getElementById('status');
let taskCategoryInput = document.getElementById('category');
let taskTitleInput = document.getElementById('title');
let taskDescriptionInput = document.getElementById('description');
let toDoContainer = document.getElementById('toDo');
let inProgressContainer = document.getElementById('inProgress');
let doneContainer = document.getElementById('done');
let searchInput = document.getElementById('searchInput');
let nextUpCounterElement = document.getElementById('nextUpCount');
let inProgressCounterElement = document.getElementById('inProgressCount');
let doneCounterElement = document.getElementById('doneCount');
let gridBtn = document.getElementById('gridBtn')
let barsBtn = document.getElementById('barsBtn')
let modeBtn = document.getElementById('mode')
let sections = document.querySelectorAll("section");
let tasksContainer = document.querySelectorAll(".tasks");
let rootElement = document.querySelector(":root");

// ^ ========> App vairabals
let taskArr = [];
var taskHTML;
let toDoCounter = 0
let inProgressCounter = 0
let doneCounter = 0
let updatedIndex;
// ! ========> Functions

if(localStorage.getItem('tasks')) {
    taskArr = JSON.parse(localStorage.getItem('tasks'))
    for(var i =0 ; i<taskArr.length ; i++) {
        displayTask(i)
    }
}

newTaskBtn.addEventListener('click' , showModel)
function showModel() {
    model.classList.replace('d-none','d-flex')
    document.body.style.overflow = 'hidden'
    scroll(0,0)
}

model.addEventListener('click', function(eventInfo){
        if(eventInfo.target.id == 'modal') {
            hideModel(eventInfo)
        }
    }
)

function hideModel() {
    model.classList.replace('d-flex','d-none')
    document.body.style.overflow = 'auto'
}

addBtnModel.addEventListener('click' , addTasks)
function addTasks() {
    if(validation(regexTitle , taskTitleInput) && validation(regexDescription , taskDescriptionInput)) {
        if( addBtnModel.innerHTML.trim() == 'Add Task' ) {
            var task = {
                status: taskStatusInput.value,
                category: taskCategoryInput.value,
                title: taskTitleInput.value,
                description: taskDescriptionInput.value
            };
        
            taskArr.push(task);
            saveTasksToLocal()
            displayTask(taskArr.length - 1)
            resetInputs()
            hideModel()
        } else if (addBtn.innerHTML == "Update Task") {
            updateTask(updatedIndex)
        }
    }
}

function displayTask(index) {
    taskHTML = `
    <div class="task">
          <h3 class="text-capitalize">${taskArr[index].title}</h3>
          <p class="description text-capitalize">${taskArr[index].description}</p>
          <h4 class="category ${taskArr[index].category} text-capitalize">${taskArr[index].category}</h4>
          <ul class="text-options list-unstyled d-flex gap-3 fs-5 m-0">
            <li><i class="fa fa-pencil-square" onclick="getTaskInfo(${index})"></i></li>
            <li><i class="fa fa-trash" onclick="deleteTask(${index})"></i></li>
            <li><i class="fa fa-paint-brush" onclick="changeColor(event)"></i></li>
          </ul>
        </div>
        `;
        setTMLLocation(taskArr[index].status)
}

function resetInputs() {
    taskStatusInput.value = "nextUp";
    taskCategoryInput.value = "education";
    taskTitleInput.value = "";
    taskDescriptionInput.value = "";
}

function updateTask(index) {
    taskArr[index].status = taskStatusInput.value;
    taskArr[index].category = taskCategoryInput.value;
    taskArr[index].title = taskTitleInput.value;
    taskArr[index].description = taskDescriptionInput.value;
    console.log('ahmed');
    saveTasksToLocal();
    resetContainers();
    resetCounter();
  
    for (var i = 0; i < taskArr.length; i++) {
      displayTask(i);
    }

    resetInputs();
    addBtnModel.innerHTML = "Add Task";
    addBtnModel.classList.remove("btn-update");
    addBtnModel.classList.add("btn-new-task");
    hideModel();
} 

function getTaskInfo(index) {
    showModel()
    taskStatusInput.value = taskArr[index].status
    taskCategoryInput.value = taskArr[index].category
    taskTitleInput.value = taskArr[index].title
    taskDescriptionInput.value = taskArr[index].description

    addBtnModel.innerHTML = "Update Task";
    addBtnModel.classList.remove("btn-new-task");
    addBtnModel.classList.add("btn-update");
    updatedIndex = index;
}

barsBtn.addEventListener('click' , changeToBars)
function changeToBars() {
    gridBtn.classList.remove('active')
    barsBtn.classList.add('active')

    for (var i = 0; i < sections.length; i++) {
        sections[i].classList.remove("col-md-6", "col-lg-4");
        sections[i].style.overflow = "auto";
    }
    
    for (var j = 0; j < tasksContainer.length; j++) {
        tasksContainer[j].setAttribute("data-view", "bars");
    }
}

gridBtn.addEventListener("click", changeToGrid); 
function changeToGrid() {
    barsBtn.classList.remove("active");
    gridBtn.classList.add("active");
  
    for (var i = 0; i < sections.length; i++) {
      sections[i].classList.add("col-md-6", "col-lg-4");
    }
  
    for (var j = 0; j < tasksContainer.length; j++) {
      tasksContainer[j].removeAttribute("data-view");
    }
}

function setTMLLocation(status) {
    switch(status) {
        case 'nextUp':
            toDoContainer.innerHTML += taskHTML;
            toDoCounter++;
            nextUpCounterElement.innerHTML = toDoCounter
            break;
        case 'inProgress':
            inProgressContainer.innerHTML += taskHTML;
            inProgressCounter++;
            inProgressCounterElement.innerHTML = inProgressCounter
            break;
        case 'done':
            doneContainer.innerHTML += taskHTML;
            doneCounter++;
            doneCounterElement.innerHTML = doneCounter
            break;
    }
}

function saveTasksToLocal() {
    localStorage.setItem('tasks', JSON.stringify(taskArr))
}

function deleteTask(index) {
    taskArr.splice(index , 1);
    saveTasksToLocal();
    resetContainers()
    resetCounter()
    for(var i=0 ; i<taskArr.length ; i++) {
        displayTask(i)
    }
}

function resetCounter() {
    toDoCounter = 0
    inProgressCounter = 0
    doneCounter = 0

    nextUpCounterElement.innerHTML = toDoCounter
    inProgressCounterElement.innerHTML = inProgressCounter
    doneCounterElement.innerHTML = doneCounter
}

function resetContainers() {
    doneContainer.innerHTML = ''
    inProgressContainer.innerHTML = ''
    toDoContainer.innerHTML = ''
}

searchInput.addEventListener('input' , searchTask)
function searchTask() {
    var searchKey = searchInput.value
    resetContainers()
    resetCounter()
    for(var i=0 ; i<taskArr.length ; i++) {
        if(
            taskArr[i].title.toLowerCase().includes(searchKey.toLowerCase()) || 
            taskArr[i].category.toLowerCase().includes(searchKey.toLowerCase()) ) {
            displayTask(i)
        }
    }
}


function generateColor() {
    var color = '#'
    var char = [ 0, 1, 2, 3 , 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f']
    for(var i=0 ; i < 6 ; i++) {
        var roundomIndex = Math.trunc( Math.random() * 16)
        color += char[roundomIndex]
    }
    return color + '55'
}

function changeColor(event) {
    var taskElement = event.target.parentElement.parentElement.parentElement
    taskElement.style.backgroundColor = generateColor()
}

var regexTitle = /^\w{3,}(\s\w+)*$/
var regexDescription = /^(?=.{5,100}$)\w{1,}(\s\w*)*$/;

function validation(regex , element) {
    if(regex.test(element.value)) {
        element.classList.add('is-valid')
        element.classList.remove('is-invalid')
        element.parentElement.nextElementSibling.classList.add('d-none')
    } else {
        element.classList.add('is-invalid')
        element.classList.remove('is-valid')
        element.parentElement.nextElementSibling.classList.remove('d-none')
    }

    return regex.test(element.value)
}

taskTitleInput.addEventListener('input' , function() {
    validation(regexTitle , taskTitleInput)
})

taskDescriptionInput.addEventListener('input' , function() {
    validation(regexDescription , taskDescriptionInput)
})

modeBtn.addEventListener('click' , changeMode)
function changeMode() {
    if(modeBtn.dataset.mode == 'night') {
        rootElement.style.setProperty("--main-black" , "#f1f1f1");
        rootElement.style.setProperty("--sec-black" , "#ddd");
        rootElement.style.setProperty("--text-color" , "#222");
        rootElement.style.setProperty("--gray-color" , "#333");
        rootElement.style.setProperty("--mid-gray" , "#f1f1f1");
        modeBtn.dataset.mode = 'light'
        modeBtn.classList.replace('fa-moon' , 'fa-sun')
    } else if(modeBtn.dataset.mode == 'light') {
        rootElement.style.setProperty("--main-black" , "#0d1117");
        rootElement.style.setProperty("--sec-black" , "#161b22");
        rootElement.style.setProperty("--text-color" , "#a5a6a7");
        rootElement.style.setProperty("--gray-color" , "#dadada");
        rootElement.style.setProperty("--mid-gray" , "#474a4e");
        modeBtn.dataset.mode = 'night'
        modeBtn.classList.replace('fa-sun' , 'fa-moon')
    }
}