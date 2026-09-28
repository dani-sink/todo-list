import { createTodo } from "../todo.js";
import { createProject } from "../project.js";


// ============ TODO TESTS ============
console.log("===== TODO =====");

// 1. Create a todo — check all 6 properties exist and are set correctly
let t1 = createTodo("Buy groceries", "Milk, eggs, bread", "2026-09-30", "medium");
console.log("created todo:", t1);
// expect: { id: <some unique string>, title: "Buy groceries",
//           description: "Milk, eggs, bread", dueDate: "2026-09-30",
//           priority: "medium", completed: false }

// 2. Does it start incomplete?
console.log("starts incomplete:", t1.completed === false);   // expect: true

// 3. Is the id actually there and unique? Make a second one and compare.
let t2 = createTodo("Call dentist", "", "2026-09-25", "high");
console.log("ids differ:", t1.id !== t2.id);                 // expect: true

// 4. Toggle complete — the core state change
t1.toggleComplete();                       // ← your method name may differ
console.log("after toggle:", t1.completed);                  // expect: true
t1.toggleComplete();
console.log("toggled back:", t1.completed);                  // expect: false


// ============ PROJECT TESTS ============
console.log("===== PROJECT =====");

// 5. Create a project — check name + empty todos list
const work = createProject("Work");
console.log("created project:", work);
// expect: { id/name: "Work", todos: [] }
console.log("starts empty:", work.getTodos().length === 0);  // expect: true  (or work.todos.length)

// 6. Add todos, confirm the list grows
t1 = work.addTodo("Buy groceries", "Milk, eggs, bread", "2026-09-30", "medium");
t2 = work.addTodo("Call dentist", "", "2026-09-25", "high");
console.log("after 2 adds:", work.getTodos().length);        // expect: 2

// 7. Get all todos — confirm they're the ones you added
console.log("all todos:", work.getTodos());                  // expect: array containing t1 and t2

// 8. Find a single todo by id (the lookup the expand/edit flow will need)
console.log("find by id:", work.getTodo(t2));             // expect: the t2 object
console.log("find missing id:", work.getTodo("nope"));       // expect: undefined (should NOT crash)

// 9. Remove a todo by id — confirm count drops and the RIGHT one is gone
work.removeTodo(t1);
console.log("after remove:", work.getTodos().length);        // expect: 1
console.log("removed the correct one:", work.getTodo(t1) === undefined); // expect: true
console.log("kept the other one:", work.getTodo(t2) !== undefined);      // expect: true


// ============ EDGE / SANITY ============
console.log("===== EDGE CASES =====");

// 10. Remove something that isn't there — should be a no-op, not a crash
work.removeTodo("does-not-exist");
console.log("survived bogus remove:", work.getTodos().length); // expect: 1

// 11. Empty project still behaves
const empty = createProject("Empty");
console.log("empty getTodos:", empty.getTodos());              // expect: []  (not undefined, no error)