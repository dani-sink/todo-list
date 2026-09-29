import { format } from "date-fns";
import { CHECKED_SVG_STRING, CHEVRON_DOWN_STRING, CHEVRON_UP_STRING, NOTEBOOK_SVG_STRING, TRASHCAN_STRING, UNCHECKED_SVG_STRING } from "./svg-strings.js";

export const ScreenController = function(appController) {
    const sidebarSection = document.querySelector("#sidebar-section");
    const todoSection = document.querySelector("#todo-section");
    const projectDialog = document.querySelector("#project-dialog");
    const todoDialog = document.querySelector("#todo-dialog");
    const projectForm = document.querySelector("#project-form");
    const todoForm = document.querySelector("#todo-form");
    const projectCancelBtn = document.querySelector("#project-cancel-btn");
    const todoCancelBtn = document.querySelector("#todo-cancel-btn");
    const projectConfirmBtn = document.querySelector("#project-confirm-btn");
    const todoConfirmBtn = document.querySelector("#todo-confirm-btn");
    const deleteTodoDialog = document.querySelector("#delete-todo-dialog");
    const deleteTodoForm = document.querySelector("#delete-todo-form");
    const deleteTodoCancelBtn = document.querySelector("#delete-cancel-btn");
    const deleteTodoConfirmBtn = document.querySelector("#delete-confirm-btn");

    let targetDeleteTodoId = "";


    projectCancelBtn.addEventListener("click", function(e) {
        e.preventDefault();

        projectDialog.close();
        projectForm.reset();
    });

    todoCancelBtn.addEventListener("click", function(e) {
        e.preventDefault();

        todoDialog.close();
        todoForm.reset();
    });

    deleteTodoCancelBtn.addEventListener("click", function(e) {
        e.preventDefault();
        
        targetDeleteTodoId = "";
        deleteTodoDialog.close();
        deleteTodoForm.reset();
    });

    projectConfirmBtn.addEventListener("click", function(e){
        e.preventDefault(); // We don't want to submit this fake form

        if (projectForm.checkValidity()) {
            const projectName = projectForm.querySelector("#project-name").value;
            appController.addProject(projectName);
            updateRender();

            projectDialog.close(); 
            projectForm.reset();
            
        } else {
            projectForm.reportValidity();
        }
    });

    todoConfirmBtn.addEventListener("click", function(e) {
        e.preventDefault();

        if (todoForm.checkValidity()) {
            const todoTitle = todoForm.querySelector("#title").value;
            const todoDescription = todoForm.querySelector("#description").value;
            const todoDueDate = todoForm.querySelector("#due-date").value;
            const todoPriority = todoForm.querySelector('input[name="priority"]:checked').value;
            appController.addTodoToCurrent(todoTitle, todoDescription, todoDueDate, todoPriority);
            updateRender();

            todoDialog.close();
            todoForm.reset();
            
        } else {
            todoForm.reportValidity();
        }
    });

    deleteTodoConfirmBtn.addEventListener("click", function(e) {
        e.preventDefault();

        appController.getCurrentProject().removeTodo(targetDeleteTodoId);
        updateRender();
        targetDeleteTodoId = "";
        deleteTodoDialog.close();
        deleteTodoForm.reset();
    });
    
    const capitalizeFirstLetter = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const formatDate = (dateString) => {
        const arr = dateString.split("-").map(num => Number(num))
        const date = new Date(arr[0], arr[1] - 1, arr[2]);
        const wordsFormat = format(date, "dd MMM");
        return wordsFormat;
    }

    const isOverdue = (dateString) => {
        const todayDateString = new Date().toISOString().split('T')[0];

        const todayDate = new Date(todayDateString);
        const targetDate = new Date(dateString);

        return targetDate < todayDate;
    }

    const clearSidebar = () => {
        sidebarSection.replaceChildren();
    }

    const clearTodoSection = () => {
        todoSection.replaceChildren();
    }

    const updateRender = () => {
        const allProjects = appController.getProjects();
        const currentProject = appController.getCurrentProject();
        render(allProjects, currentProject);
    }

    const renderSidebar = (projects) => {
        clearSidebar();

        const sidebarHeader = document.createElement("h1");
        sidebarHeader.classList.add("sidebar-header");
        sidebarHeader.textContent = "Dashboard";

        const projectsContainer = document.createElement("div");
        projectsContainer.classList.add("projects-container");
        
        const projectsHeaderTxt = document.createElement("p");
        projectsHeaderTxt.classList.add("projects-header-txt");
        projectsHeaderTxt.textContent = "PROJECTS";

        const projectList = document.createElement("ul");
        projectList.classList.add("projectList");

        projects.forEach(proj => {
            const projectItem = document.createElement("li");
            projectItem.classList.add("project-item");

            const projectName = document.createElement("p");
            projectName.classList.add("project-name");
            projectName.textContent = proj.name;

            const todosCount = proj.getTodos().length;
            const numTodos = document.createElement("span");
            numTodos.classList.add("num-todos");
            numTodos.textContent = String(todosCount);

            projectItem.appendChild(projectName);
            projectItem.appendChild(numTodos);
            projectList.appendChild(projectItem);
        });
        
        const sideBarButton = document.createElement("button");
        sideBarButton.classList.add("show-proj-dialog");
        sideBarButton.textContent = "+ New Project";
        sideBarButton.addEventListener("click", function(){
            projectDialog.showModal();
        });

        projectsContainer.appendChild(projectsHeaderTxt);
        projectsContainer.appendChild(projectList);

        sidebarSection.appendChild(sidebarHeader);
        sidebarSection.appendChild(projectsContainer);
        sidebarSection.appendChild(sideBarButton);        
    } 

    const renderSVG = function (svgString) {
        // Initialize the DOMParser
        const parser = new DOMParser();

        // Parse the string into an XML Document object
        const doc = parser.parseFromString(svgString, "image/svg+xml");

        // Extract the SVG element node
        const svgElement = doc.documentElement;

        return svgElement;
    }

    const renderNotesSVG = function () {
        const notesSVG = renderSVG(NOTEBOOK_SVG_STRING);
        notesSVG.setAttribute("width", "40px");
        notesSVG.setAttribute("height", "40px");
        return notesSVG;
    }

    const renderUncheckedSVG = function () {
        const uncheckedSVG = renderSVG(UNCHECKED_SVG_STRING);
        uncheckedSVG.setAttribute("width", "40px");
        uncheckedSVG.setAttribute("height", "40px");
        uncheckedSVG.style.pointerEvents = "none";
        return uncheckedSVG;
    }

    const renderCheckedSVG = function () {
        const checkedSVG = renderSVG(CHECKED_SVG_STRING);
        checkedSVG.setAttribute("width", "40px");
        checkedSVG.setAttribute("height", "40px");
        checkedSVG.setAttribute("fill", "#4BB543");
        checkedSVG.style.pointerEvents = "none";
        return checkedSVG;
    }

    const renderChevronDownSVG = function () {
        const chevronDownSVG = renderSVG(CHEVRON_DOWN_STRING);
        chevronDownSVG.setAttribute("width", "40px");
        chevronDownSVG.setAttribute("height", "40px");
        chevronDownSVG.style.pointerEvents = "none";
        return chevronDownSVG;
    }
    
    const renderChevronUpSVG = function () {
        const chevronUpSVG = renderSVG(CHEVRON_UP_STRING);
        chevronUpSVG.setAttribute("width", "40px");
        chevronUpSVG.setAttribute("height", "40px");
        chevronUpSVG.style.pointerEvents = "none";
        return chevronUpSVG;
    }
    const renderTrashcanSVG = function () {
        const trashcanSVG = renderSVG(TRASHCAN_STRING);
        trashcanSVG.setAttribute("width", "40px");
        trashcanSVG.setAttribute("height", "40px");
        trashcanSVG.style.pointerEvents = "none";
        return trashcanSVG;
    }
    

    const renderTodoSection = function (project) {
        clearTodoSection();

        const topContainer = document.createElement("div");
        topContainer.classList.add("todo-top-container");

        const projectNameContainer = document.createElement("div");
        projectNameContainer.classList.add("project-name-container");
        
        const projectName = document.createElement("p");
        projectName.classList.add("todo-section-project-name");
        projectName.textContent = project.name;

        const addTodoButton = document.createElement("button");
        addTodoButton.classList.add("add-todo-btn");
        addTodoButton.textContent = "+ Add task";
        addTodoButton.addEventListener("click", function() {
            todoDialog.showModal();
        });

        projectNameContainer.appendChild(projectName);

        topContainer.appendChild(projectNameContainer);
        topContainer.appendChild(addTodoButton);

        todoSection.appendChild(topContainer);

        if (project.getTodos().length === 0) {
            const notesSVG = renderNotesSVG();
            
            const blankProjectText = document.createElement("p");
            blankProjectText.classList.add("blank-project-txt");
            blankProjectText.textContent = "No tasks yet — add your first one.";

            todoSection.appendChild(notesSVG);
            todoSection.appendChild(blankProjectText);
        } else {
            const todos = project.getTodos();
            const todoList = document.createElement("ul");
            todoList.classList.add("todo-items-container");
            todos.forEach((todo) => {
                const todoItem = document.createElement("li");
                todoItem.classList.add("todo-item");
                todoItem.dataset.expanded = "false";
                todoItem.dataset.todoId = todo.id;
                todoItem.dataset.completed = String(todo.completed);

                // Left container
                const todoItemLeftContainer = document.createElement("div");
                todoItemLeftContainer.classList.add("todo-item-left-container");

                const todoItemCompletedButton = document.createElement("button");
                todoItemCompletedButton.classList.add("todo-item-completed-btn");

                const completedSVG = todo.completed ? renderCheckedSVG() : renderUncheckedSVG();
                todoItemCompletedButton.appendChild(completedSVG);
                todoItemCompletedButton.addEventListener("click", function(e) {
                    e.preventDefault();

                    const todo_item = e.target.parentElement.parentElement;
                    const todo_id = todo_item.dataset.todoId;
                    appController.getCurrentProject().toggleTodo(todo_id);
                    updateRender();

                    if (todo_item.dataset.completed === "false") {
                        todoItemCompletedButton.replaceChildren(renderCheckedSVG());
                    } else if (todo_item.dataset.completed === "true") {
                        todoItemCompletedButton.replaceChildren(renderUncheckedSVG());
                    }
                })


                todoItemLeftContainer.appendChild(todoItemCompletedButton);
                todoItem.appendChild(todoItemLeftContainer);


                // Middle container
                const todoItemMiddleContainer = document.createElement("div");
                todoItemMiddleContainer.classList.add("todo-item-middle-container");

                const todoTitle = document.createElement("p");
                todoTitle.classList.add("todo-item-title");
                todoTitle.textContent = todo.title;

                const todoDescription = document.createElement("p");
                todoDescription.classList.add("todo-item-description");
                todoDescription.textContent = "";

                todoItemMiddleContainer.appendChild(todoTitle);
                todoItemMiddleContainer.appendChild(todoDescription);
                todoItem.appendChild(todoItemMiddleContainer);


                // Right container
                const todoItemRightContainer = document.createElement("div");
                todoItemRightContainer.classList.add("todo-item-right-container");

                const todoItemPriority = document.createElement("span");
                todoItemPriority.classList.add("todo-item-priority");
                todoItemPriority.classList.add(todo.priority);
                todoItemPriority.textContent = capitalizeFirstLetter(todo.priority);

                const todoItemDate = document.createElement("span");
                todoItemDate.classList.add("todo-item-date");
                if (isOverdue(todo.dueDate)) {
                    todoItemDate.classList.add("overdue");
                    todoItemDate.textContent = `Overdue · ${formatDate(todo.dueDate)}`
                } else {
                    todoItemDate.textContent = formatDate(todo.dueDate);
                }
                
                const todoItemChevronBtn = document.createElement("button");
                todoItemChevronBtn.classList.add("chevron-btn");
                const chevronDownSVG = renderChevronDownSVG();
                todoItemChevronBtn.appendChild(chevronDownSVG);
                todoItemChevronBtn.addEventListener("click", function(e) {
                    e.preventDefault();

                    if (e.target.parentElement.parentElement.dataset.expanded === "false") {
                        e.target.parentElement.parentElement.dataset.expanded = "true";
                        e.target.replaceChildren(renderChevronUpSVG());
                        todoDescription.textContent = todo.description;
                    } else if (e.target.parentElement.parentElement.dataset.expanded === "true") {
                        e.target.parentElement.parentElement.dataset.expanded = "false";
                        e.target.replaceChildren(renderChevronDownSVG());
                        todoDescription.textContent = "";
                    }                    
                });

                const todoItemDeleteBtn = document.createElement("button");
                todoItemDeleteBtn.classList.add("todo-delete-btn");
                const trashcanSVG = renderTrashcanSVG();
                todoItemDeleteBtn.appendChild(trashcanSVG);
                todoItemDeleteBtn.addEventListener("click", function(e) {
                    e.preventDefault();

                    targetDeleteTodoId = e.target.parentElement.parentElement.dataset.todoId;
                    deleteTodoDialog.showModal();
                });


                todoItemRightContainer.appendChild(todoItemPriority);
                todoItemRightContainer.appendChild(todoItemDate);
                todoItemRightContainer.appendChild(todoItemChevronBtn);
                todoItemRightContainer.appendChild(todoItemDeleteBtn);

                todoItem.appendChild(todoItemRightContainer);
                todoList.appendChild(todoItem);
            });

            todoSection.appendChild(todoList);
        }
    }

    const render = (projects, currentProject) => {
        renderSidebar(projects);
        renderTodoSection(currentProject);
    }

    return {
        render,
    }
}