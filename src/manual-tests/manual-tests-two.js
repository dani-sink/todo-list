import controller from "../controller.js";

// ============ CONTROLLER TESTS ============
console.log("===== CONTROLLER: INIT =====");

// 1. On load, there should already be a default project
console.log("all projects:", controller.getProjects());
console.log("has default on init:", controller.getProjects().length === 1);  // expect: true

// 2. Current project should default to that first project (not undefined)
console.log("current on init:", controller.getCurrentProject());
console.log("current is set:", controller.getCurrentProject() !== undefined); // expect: true


console.log("===== CREATE / LIST PROJECTS =====");

// 3. Add projects, confirm the list grows
const work_ = controller.addProject("Work");
const personal = controller.addProject("Personal");
console.log("count after 2 adds:", controller.getProjects().length);         // expect: 3 (default + 2)

// 4. New projects get unique ids
console.log("project ids differ:", work_.id !== personal.id);                 // expect: true


console.log("===== SWITCH CURRENT =====");

// 5. Switch the active project, confirm it actually changed
controller.setCurrentProject(work_.id);                 // ← your method may take id or the object
console.log("current is Work:", controller.getCurrentProject().name === "Work"); // expect: true

// 6. Switching to a bogus id should NOT blow away current (no crash, current unchanged)
controller.setCurrentProject("nope");
console.log("current still valid:", controller.getCurrentProject() !== undefined); // expect: true


console.log("===== TODOS THROUGH THE CONTROLLER =====");

// 7. Add a todo to the CURRENT project via the controller (the path the DOM will use)
controller.addTodoToCurrent("Finish report", "Q3 numbers", "2026-09-30", "high");                        // ← or addTodo(currentId, todo), etc.
console.log("current project todo count:", controller.getCurrentProject().getTodos().length); // expect: 1

// 8. The todo landed in Work, NOT in the default project (isolation between projects)
controller.setCurrentProject(personal.id);
console.log("other project unaffected:", controller.getCurrentProject().getTodos().length);   // expect: 0


console.log("===== DELETE PROJECT (the tricky one) =====");

// 9. Delete a NON-current project — count drops, current untouched
controller.setCurrentProject(work_.id);       // current = Work
controller.deleteProject(personal.id);       // delete a different one
console.log("count after delete:", controller.getProjects().length);         // expect: 2
console.log("current survived:", controller.getCurrentProject().name === "Work"); // expect: true

// 10. Delete the CURRENT project — current must fall back to a real project, never dangle
controller.deleteProject(work_.id);           // deleting the active one
console.log("count now:", controller.getProjects().length);                  // expect: 1
console.log("current still valid after deleting it:",
  controller.getCurrentProject() !== undefined &&
  controller.getProjects().includes(controller.getCurrentProject()));        // expect: true


console.log("===== EDGE CASES =====");

// 11. Deleting a bogus id is a safe no-op
controller.deleteProject("does-not-exist");
console.log("survived bogus delete:", controller.getProjects().length);      // expect: 1

// 12. Should you be allowed to delete the LAST/default project? Decide your rule.
//     Common choice: block it, so there's always at least one project.
controller.deleteProject(controller.getProjects()[0].id);
console.log("projects never empty:", controller.getProjects().length >= 1);  // expect: true IF you block it