import { createProject } from "./project.js";

const STORAGE_KEY = "odin-todo-app";

export const saveProjects = function (projects) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

const restoreProject = function (plainProject) {
    const project = createProject(plainProject.name);
    project.id = plainProject.id;
    project.todos = plainProject.todos;
    project.todos.forEach((todo) => {
        todo.toggleComplete = function() {
            this.completed = !this.completed;
        }
    });
    return project;
}


export const loadProjects = function() {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) return null;
    const plainObjects = JSON.parse(rawData);
    return plainObjects.map(restoreProject); 
}