import { formatDate, isOverdue } from "./helpers/date.js";
import { capitalizeFirstLetter } from "./helpers/string.js";
import { 
    renderCheckedSVG, 
    renderChevronDownSVG, 
    renderChevronUpSVG, 
    renderNotesSVG, 
    renderTrashcanSVG, 
    renderUncheckedSVG 
} from "./helpers/svg.js";

export const ScreenController = function(appController) {
    const sidebarSection = document.querySelector("#sidebar-section");
    const todoSection = document.querySelector("#todo-section");

    // Add new Project Modal
    const projectDialog = document.querySelector("#project-dialog");
    const projectForm = document.querySelector("#project-form");
    const projectCancelBtn = document.querySelector("#project-cancel-btn");
    const projectConfirmBtn = document.querySelector("#project-confirm-btn");
    
    // Add new Todo Modal
    const todoDialog = document.querySelector("#todo-dialog");
    const todoForm = document.querySelector("#todo-form");
    const todoCancelBtn = document.querySelector("#todo-cancel-btn");
    const todoConfirmBtn = document.querySelector("#todo-confirm-btn");

    // Cannot Delete Project Modal
    const cannotDeleteDialog = document.querySelector("#cannot-delete-project-dialog");
    const cannotDeleteOkBtn = document.querySelector("#cannot-delete-project-dialog-btn");

    // Delete Project Modal
    const deleteProjectDialog = document.querySelector("#delete-project-dialog");
    const deleteProjectForm = document.querySelector("#delete-project-form");
    const deleteProjectCancelBtn = document.querySelector("#delete-project-cancel-btn");
    const deleteProjectConfirmBtn = document.querySelector("#delete-project-confirm-btn");

    // Delete Todo Modal
    const deleteTodoDialog = document.querySelector("#delete-todo-dialog");
    const deleteTodoForm = document.querySelector("#delete-todo-form");
    const deleteTodoCancelBtn = document.querySelector("#delete-todo-cancel-btn");
    const deleteTodoConfirmBtn = document.querySelector("#delete-todo-confirm-btn");

    let targetDeleteProjectId = "";
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

    cannotDeleteOkBtn.addEventListener("click", function(e) {
        e.preventDefault();
        cannotDeleteDialog.close();
    });

    deleteProjectCancelBtn.addEventListener("click", function(e) {
        e.preventDefault();
        
        targetDeleteProjectId = "";
        deleteProjectDialog.close();
        deleteProjectForm.reset();
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

    deleteProjectConfirmBtn.addEventListener("click", function(e) {
        e.preventDefault();

        appController.deleteProject(targetDeleteProjectId);
        updateRender();
        targetDeleteProjectId = "";
        deleteProjectDialog.close();
        deleteProjectForm.reset(); 
    }); 
 

    deleteTodoConfirmBtn.addEventListener("click", function(e) {
        e.preventDefault();

        appController.removeTodoFromCurrent(targetDeleteTodoId);
        updateRender();
        targetDeleteTodoId = "";
        deleteTodoDialog.close();
        deleteTodoForm.reset();
    }); 

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
        sidebarHeader.textContent = "Dashboard";

        const projectsContainer = document.createElement("div");
        projectsContainer.classList.add("projects-container");
        
        const projectsHeaderTxt = document.createElement("p");
        projectsHeaderTxt.classList.add("projects-header-txt");
        projectsHeaderTxt.textContent = "PROJECTS";

        const projectList = document.createElement("ul");
        projectList.classList.add("project-list");

        projects.forEach(proj => {
            const projectItem = document.createElement("li");
            projectItem.classList.add("project-item");
            projectItem.dataset.id = proj.id;
            if (proj.id === appController.getCurrentProject().id) {
                projectItem.classList.add("selected");
            } else {
                projectItem.classList.remove(".selected");
            }

            projectItem.addEventListener("click", function(e){
                e.preventDefault();
                const currentProjectId = appController.getCurrentProject().id;
                const targetId = e.currentTarget.dataset.id;
                if (currentProjectId !== targetId) {
                    appController.setCurrentProject(targetId);
                    updateRender();
                }
            });

            const projectName = document.createElement("p");
            projectName.classList.add("project-name");
            projectName.textContent = proj.name;

            const projectItemRightContainer = document.createElement("div");
            projectItemRightContainer.classList.add("project-item-right-container");
            
            // const todosCount = proj.getTodos().length;
            const todosCount = proj.todos.length;
            const numTodos = document.createElement("span");
            numTodos.textContent = String(todosCount);

            const projectItemTrashSVG = document.createElement("button");
            projectItemTrashSVG.classList.add("project-item-trash-svg");
            const trashSVG = renderTrashcanSVG("20px", "20px");
            projectItemTrashSVG.appendChild(trashSVG);
            projectItemTrashSVG.addEventListener("click", function(e) {
                e.preventDefault();

                const numProjects = appController.getProjects().length;
                if (numProjects > 1) {
                    targetDeleteProjectId = e.target.parentElement.parentElement.dataset.id;
                    deleteProjectDialog.showModal();
                } else {
                    cannotDeleteDialog.showModal();
                }
            });

            projectItem.appendChild(projectName);
            projectItemRightContainer.appendChild(numTodos);
            projectItemRightContainer.appendChild(projectItemTrashSVG);
            projectItem.appendChild(projectItemRightContainer);
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

        // if (project.getTodos().length === 0) {
        if (project.todos.length === 0) {
            const notesSVG = renderNotesSVG();
            
            const blankProjectText = document.createElement("p");
            blankProjectText.classList.add("blank-project-txt");
            blankProjectText.textContent = "No tasks yet — add your first one.";

            todoSection.appendChild(notesSVG);
            todoSection.appendChild(blankProjectText);
        } else {
            // const todos = project.getTodos();
            const todos = project.todos;
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
                    appController.toggleTodo(todo_id);
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
                const trashcanSVG = renderTrashcanSVG("40px", "40px");
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