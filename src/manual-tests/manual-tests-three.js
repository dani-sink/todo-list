import controller from "../controller.js";
import { loadProjects } from "../storage.js";

const check = (label, condition) =>
  console.log(`${condition ? "✅" : "❌"} ${label}`);

const KEY = "odin-todo-app"; // ← must match storage.js

console.log("===== CONTROLLER + STORAGE INTEGRATION =====");

// Start clean so results are predictable
localStorage.removeItem(KEY);

// ---- CONTROLLER ACTIONS SHOULD PERSIST AUTOMATICALLY ----

// 1. Creating a project through the controller writes to storage
const work = controller.addProject("Work");
check("addProject persisted", localStorage.getItem(KEY) !== null);
check(
  "saved data has the new project",
  loadProjects().some((p) => p.name === "Work"),
);

// // 2. Creating a todo through the controller persists too
controller.setCurrentProject(work.id);
controller.addTodoToCurrent(
  "Finish report",
  "Q3 numbers",
  "2026-09-30",
  "high",
);
check(
  "addTodo persisted",
  loadProjects().find((p) => p.id === work.id).todos.length === 1,
);

// // 3. Toggling complete through the app persists the new state
const todo = controller.getCurrentProject().getTodos()[0];
controller.toggleTodo(todo.id);
check(
  "completed state persisted",
  loadProjects().find((p) => p.id === work.id).todos[0].completed === true,
);

// 4. Deleting a todo persists the removal
controller.removeTodoFromCurrent(todo.id);
check(
  "todo removal persisted",
  loadProjects().find((p) => p.id === work.id).todos.length === 0,
);

// // 5. Deleting a project persists
controller.deleteProject(work.id);
check(
  "project removal persisted",
  !loadProjects()?.some((p) => p.id === work.id),
);

// // ---- RELOAD SIMULATION: does the controller rehydrate correctly? ----

// 6. Seed some data, then ask the controller to reload from storage
controller.addProject("Personal");
controller.setCurrentProject(
  controller.getProjects().find((p) => p.name === "Personal").id,
);
controller.addTodoToCurrent("Book flights", "", "2026-10-05", "low");

controller.init(); // ← your startup/rehydrate method (reads storage, rebuilds objects)

const reloadedProject = controller
  .getProjects()
  .find((p) => p.name === "Personal");
check("project survived reload", reloadedProject !== undefined);
console.log(reloadedProject.getTodos());
console.log(reloadedProject.todos);
check("todo survived reload", reloadedProject.getTodos().length === 1);
check(
  "methods intact after reload",
  typeof reloadedProject.addTodo === "function",
  typeof reloadedProject.removeTodo === "function",
  typeof reloadedProject.getTodo === "function",
  typeof reloadedProject.getTodos === "function",
);

// // 7. Fresh start: no saved data → controller should create a default project, not crash
localStorage.clear();
controller.init();
check("default project on empty storage", controller.getProjects().length >= 1);
check(
  "current project is set after fresh init",
  controller.getCurrentProject() !== undefined,
);

// console.log("===== DONE =====");
