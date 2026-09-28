import "./styles.css";
import { createProject } from "./project.js";
import { createTodo } from "./todo.js";

// // ============ TODO TESTS ============
// console.log("===== TODO =====");

// // 1. Create a todo — check all 6 properties exist and are set correctly
// let t1 = createTodo("Buy groceries", "Milk, eggs, bread", "2026-09-30", "medium");
// console.log("created todo:", t1);
// // expect: { id: <some unique string>, title: "Buy groceries",
// //           description: "Milk, eggs, bread", dueDate: "2026-09-30",
// //           priority: "medium", completed: false }

// // 2. Does it start incomplete?
// console.log("starts incomplete:", t1.completed === false);   // expect: true

// // 3. Is the id actually there and unique? Make a second one and compare.
// let t2 = createTodo("Call dentist", "", "2026-09-25", "high");
// console.log("ids differ:", t1.id !== t2.id);                 // expect: true

// // 4. Toggle complete — the core state change
// t1.toggleComplete();                       // ← your method name may differ
// console.log("after toggle:", t1.completed);                  // expect: true
// t1.toggleComplete();
// console.log("toggled back:", t1.completed);                  // expect: false


// // ============ PROJECT TESTS ============
// console.log("===== PROJECT =====");

// // 5. Create a project — check name + empty todos list
// const work = createProject("Work");
// console.log("created project:", work);
// // expect: { id/name: "Work", todos: [] }
// console.log("starts empty:", work.getTodos().length === 0);  // expect: true  (or work.todos.length)

// // 6. Add todos, confirm the list grows
// t1 = work.addTodo("Buy groceries", "Milk, eggs, bread", "2026-09-30", "medium");
// t2 = work.addTodo("Call dentist", "", "2026-09-25", "high");
// console.log("after 2 adds:", work.getTodos().length);        // expect: 2

// // 7. Get all todos — confirm they're the ones you added
// console.log("all todos:", work.getTodos());                  // expect: array containing t1 and t2

// // 8. Find a single todo by id (the lookup the expand/edit flow will need)
// console.log("find by id:", work.getTodo(t2));             // expect: the t2 object
// console.log("find missing id:", work.getTodo("nope"));       // expect: undefined (should NOT crash)

// // 9. Remove a todo by id — confirm count drops and the RIGHT one is gone
// work.removeTodo(t1);
// console.log("after remove:", work.getTodos().length);        // expect: 1
// console.log("removed the correct one:", work.getTodo(t1) === undefined); // expect: true
// console.log("kept the other one:", work.getTodo(t2) !== undefined);      // expect: true


// // ============ EDGE / SANITY ============
// console.log("===== EDGE CASES =====");

// // 10. Remove something that isn't there — should be a no-op, not a crash
// work.removeTodo("does-not-exist");
// console.log("survived bogus remove:", work.getTodos().length); // expect: 1

// // 11. Empty project still behaves
// const empty = createProject("Empty");
// console.log("empty getTodos:", empty.getTodos());              // expect: []  (not undefined, no error)

export const AppController = function(){
    let projects = [createProject("Default")];
    let currentProject = projects[0];

    const addProject = (name) => {
        const newProject = createProject(name);
        projects.unshift(newProject);
        currentProject = projects[0];
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
        addProject,
        addTodoToCurrent,
        deleteProject,
        getCurrentProject,
        setCurrentProject,
        getProjects,
    }
}

const controller = AppController();

// // ============ CONTROLLER TESTS ============
// console.log("===== CONTROLLER: INIT =====");

// // 1. On load, there should already be a default project
// console.log("all projects:", controller.getProjects());
// console.log("has default on init:", controller.getProjects().length === 1);  // expect: true

// // 2. Current project should default to that first project (not undefined)
// console.log("current on init:", controller.getCurrentProject());
// console.log("current is set:", controller.getCurrentProject() !== undefined); // expect: true


// console.log("===== CREATE / LIST PROJECTS =====");

// // 3. Add projects, confirm the list grows
// const work = controller.addProject("Work");
// const personal = controller.addProject("Personal");
// console.log("count after 2 adds:", controller.getProjects().length);         // expect: 3 (default + 2)

// // 4. New projects get unique ids
// console.log("project ids differ:", work.id !== personal.id);                 // expect: true


// console.log("===== SWITCH CURRENT =====");

// // 5. Switch the active project, confirm it actually changed
// controller.setCurrentProject(work.id);                 // ← your method may take id or the object
// console.log("current is Work:", controller.getCurrentProject().name === "Work"); // expect: true

// // 6. Switching to a bogus id should NOT blow away current (no crash, current unchanged)
// controller.setCurrentProject("nope");
// console.log("current still valid:", controller.getCurrentProject() !== undefined); // expect: true


// console.log("===== TODOS THROUGH THE CONTROLLER =====");

// // 7. Add a todo to the CURRENT project via the controller (the path the DOM will use)
// controller.addTodoToCurrent("Finish report", "Q3 numbers", "2026-09-30", "high");                        // ← or addTodo(currentId, todo), etc.
// console.log("current project todo count:", controller.getCurrentProject().getTodos().length); // expect: 1

// // 8. The todo landed in Work, NOT in the default project (isolation between projects)
// controller.setCurrentProject(personal.id);
// console.log("other project unaffected:", controller.getCurrentProject().getTodos().length);   // expect: 0


// console.log("===== DELETE PROJECT (the tricky one) =====");

// // 9. Delete a NON-current project — count drops, current untouched
// controller.setCurrentProject(work.id);       // current = Work
// controller.deleteProject(personal.id);       // delete a different one
// console.log("count after delete:", controller.getProjects().length);         // expect: 2
// console.log("current survived:", controller.getCurrentProject().name === "Work"); // expect: true

// // 10. Delete the CURRENT project — current must fall back to a real project, never dangle
// controller.deleteProject(work.id);           // deleting the active one
// console.log("count now:", controller.getProjects().length);                  // expect: 1
// console.log("current still valid after deleting it:",
//   controller.getCurrentProject() !== undefined &&
//   controller.getProjects().includes(controller.getCurrentProject()));        // expect: true


// console.log("===== EDGE CASES =====");

// // 11. Deleting a bogus id is a safe no-op
// controller.deleteProject("does-not-exist");
// console.log("survived bogus delete:", controller.getProjects().length);      // expect: 1

// // 12. Should you be allowed to delete the LAST/default project? Decide your rule.
// //     Common choice: block it, so there's always at least one project.
// controller.deleteProject(controller.getProjects()[0].id);
// console.log("projects never empty:", controller.getProjects().length >= 1);  // expect: true IF you block it