const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addButton = document.getElementById("add-button");
const alertMessage = document.getElementById("alert-message");
const todosBody = document.querySelector("tbody");
const DeleteAllButton = document.getElementById("delete");
const editButton = document.getElementById("edit-button");
const filterButtons = document.querySelectorAll(".filter-todos")


let todos = JSON.parse(localStorage.getItem("todos")) || [];

const generateId = () => {
   const id = Math.round(
    Math.random() * Math.random() * Math.pow(10, 15)
    ).toString();
   return id
 };

 generateId();
const showAlert = (message, type) => {
    alertMessage.innerHTML = "";
    const alert = document.createElement("p");
    alert.innerText = message ;
    alert.classList.add("alert");
    alert.classList.add(`alert-${type}`);
    alertMessage.append(alert);
    setTimeout( () => { alert.style.display = "none"}, 2000)
};
    const displayTodos = (data) => {
        const todoList = data || todos;
        todosBody.innerHTML = "";

            if (!todoList.length){
            todosBody.innerHTML = "<tr><td colspan= '4'> no task found! </td></tr>";
            return
        }
        todoList.forEach( (todo) => {
            todosBody.innerHTML= todosBody.innerHTML += `
            <tr> 
            <td>${todo.task}</td>
            <td>${todo.date || "no Date"}</td>
            <td>${todo.completed ? "completed" : "pending"}</td>
            <td>
            <button onclick = "editHandler('${todo.id}')"> Edit</button>
            <button onclick="toggleHandler('${todo.id}')"> ${todo.completed ? "undo" : "do"}</button>
            <button onclick="deleteHandler('${todo.id}')"> Delete</button>
            </td>
            </tr>
            `;
        });
    };
    displayTodos();
const saveToLocalStorage = () =>{
    localStorage.setItem("todos", JSON.stringify(todos))
};
const addHandler = () => {
    const task = taskInput.value;
    const date = dateInput.value;
    const todo = {
        id : generateId(),
        completed : false,
        task,
        date, 
    }
    if (task) {
        todos.push(todo);
        saveToLocalStorage();
        displayTodos() ;
        taskInput.value = "" ;
        dateInput.value = "" ;
        showAlert("todo added successfully", "success")
    } else {
        showAlert( "please enter a task", "error")
    }
};
const deleteAllHandler = () => {
    if (todos.length) {
    todos = [];
    saveToLocalStorage();
    displayTodos();
    showAlert ("all todos are cleared successfully","success") }
        else { showAlert("No todos to clear!", "error")}
}
const deleteHandler = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    todos = newTodos;
    saveToLocalStorage();
    displayTodos();
    showAlert("todo deleted successfuly", "success");
};
const toggleHandler = (id) => {
    // const newTodos = todos.map( (todo) => {
    //     if (todo.id === id) {
    //         return{
    //             ...todo,
    //             completed: !todo.completed,
    //         }
    //     }
    //     else {
    //         return todo;
    //     }
    // })}
        const todo = todos.find( (todo) => todo.id === id);
        todo.completed = !todo.completed;
        console.log(todo);
        saveToLocalStorage();
        displayTodos();
        showAlert("todo status changed successfully", "success");
    };
     const editHandler = (id) => {
        const todo = todos.find((todo) => todo.id === id);
        taskInput.value = todo.task;
        dateInput.value = todo.date;
        addButton.style.display = "none";
        editButton.style.display = "inline-block";
        editButton.dataset.id = id;
    };
    const applyEditHandler = event => {
        const id = event.target.dataset.id;
        const todo = todos.find( todo => todo.id === id);
        todo.task = taskInput.value;
        todo.date = dateInput.value;
        taskInput.value = "";
        dateInput.value = "";
        addButton.style.display = "inline-block";
        editButton.style.display = "none";
        saveToLocalStorage();
        displayTodos();
    };
    const filterHandler = event => {
        let filteredTodos  ;
        const filter = event.target.dataset.filter;
        switch (filter) {
            case "pending":
            filteredTodos = todos.filter(todo => todo.completed === false);
            break;

            case "completed":
            filteredTodos = todos.filter(todo => todo.completed === true);
            break;

            default:
            filteredTodos = todos;
            break;
        }
         displayTodos(filteredTodos)
    };
    
    window.addEventListener("load", () => displayTodos());
    addButton.addEventListener("click", addHandler);
    DeleteAllButton.addEventListener("click", deleteAllHandler);
    editButton.addEventListener("click",applyEditHandler );
    filterButtons.forEach( button => {
        button.addEventListener("click", filterHandler)
    });