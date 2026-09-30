import "./styles.css";
import { createProject } from "./project.js";
import { loadProjects,  saveProjects } from "./storage.js";

export const AppController = function(){
    let projects = [createProject("Default")];
    let currentProject = projects[0];

    const init = () => {
        projects = loadProjects() !== null ? loadProjects() : [createProject("Default")];
        currentProject = projects[0];
        saveProjects(projects); 
    } 

    init();  

    const addProject = (name) => {
        const newProject = createProject(name);
        projects.unshift(newProject);
        currentProject = projects[0];
        saveProjects(projects);
        return newProject;
    }

    const addTodoToCurrent = (
        title,
        description,
        dueDate,
        priority,
    ) => {
        currentProject.addTodo(title, description, dueDate, priority);
        saveProjects(projects);
    }

    const removeTodoFromCurrent = (todoId) => {
        currentProject.removeTodo(todoId);
        saveProjects(projects);
    }

    const deleteProject = function (id) {
        if (projects.length > 1) {
            projects = projects.filter(project => project.id !== id);
            currentProject = projects[0];
            saveProjects(projects);
        }
    } 
    
    const setCurrentProject = (id) => {
        const targetIndex = findProjectIndex(id);
        
        if (targetIndex > -1) {
            currentProject = projects[targetIndex];
        }
    } 

    const toggleTodo = (todoId) => {
        currentProject.todos.find(todo => todo.id === todoId).toggleComplete();
        saveProjects(projects);
    }

    const findProjectIndex = (id) => projects.findIndex(proj => proj.id === id);

    const getCurrentProject = function() {
        return currentProject;
    }
    
    const getProjects = function() {
        return projects;
    }

    return {
        init,
        addProject,
        addTodoToCurrent,
        removeTodoFromCurrent,
        deleteProject,
        toggleTodo,
        getCurrentProject,
        setCurrentProject,
        getProjects,
    }
}


// for test purposes
// const controller = AppController();

// export default controller;