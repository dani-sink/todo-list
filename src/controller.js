import "./styles.css";
import { createProject } from "./project.js";
import { loadProjects, removeTodos, saveProjects } from "./storage.js";

export const AppController = function(){
    let projects = [createProject("Default")];
    let currentProject = projects[0];
    saveProjects(projects);

    const init = () => {
        projects = loadProjects() !== null ? loadProjects() : [createProject("Default")];
        currentProject = projects[0];
        saveProjects(projects);
    }

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
    }

    const deleteProject = function (id) {
        if (projects.length > 1) {
            projects = projects.filter(project => project.id !== id);
            currentProject = projects[0];
            removeTodos(id);
            saveProjects(projects);
        }
    }

    const findProjectIndex = (id) => projects.findIndex(proj => proj.id === id);

    const setCurrentProject = (id) => {
        const targetIndex = findProjectIndex(id);

        if (targetIndex > -1) {
            const [targetProject] = projects.splice(targetIndex, 1);
            projects.unshift(targetProject);
            currentProject = projects[0];
        }
    }


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
        deleteProject,
        getCurrentProject,
        setCurrentProject,
        getProjects,
    }
}

const controller = AppController();

export default controller;