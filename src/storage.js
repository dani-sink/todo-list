import { createProject } from "./project.js";
import { createTodo } from "./todo.js";

const STORAGE_KEY = "odin-todo-app";

export const saveProjects = function (projects) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export const removeTodos = function(projectId) {
    localStorage.removeItem(projectId);
}

export const saveTodos = function (projectId, todos) {
    localStorage.setItem(projectId, JSON.stringify(todos));
}

const restoreTodo = function (plainTodo) {
    const todo = createTodo(
        plainTodo.title,
        plainTodo.description,
        plainTodo.dueDate,
        plainTodo.priority
    );
    todo.id = plainTodo.id;
    todo.completed = plainTodo.completed;
    return todo;
}

const restoreProject = function (plainProject) {
    const project = createProject(plainProject.name);
    project.id = plainProject.id;
    return project;
}


export const loadTodos = function (projectId) {
    const rawData = localStorage.getItem(projectId);
    if (!rawData) return null;
    const plainTodos = JSON.parse(rawData);
    return plainTodos.map(restoreTodo);
}

export const loadProjects = function() {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) return null;
    const plainObjects = JSON.parse(rawData);
    return plainObjects.map(restoreProject); 
}