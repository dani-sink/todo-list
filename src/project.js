import { createTodo } from "./todo.js";

export const createProject =  function(name) {
    const id = crypto.randomUUID();
    let todos = []; 

    // const init = () => {
    //     todos = loadTodos(id) !== null ? loadTodos(id) : [];
    //     // saveTodos(id, todos);
    // }

    const addTodo = function (
        title,
        description,
        dueDate,
        priority,
    ) {
        const newTodo = createTodo(title, description, dueDate, priority);
        this.todos.push(newTodo);
        return newTodo.id;
    }
    
    const removeTodo = function (todoId) {
        this.todos = this.todos.filter(todo => todo.id !== todoId);
    }

    const getTodo = function (todoId) {
        const targetTodo = this.todos.find(todo => todo.id === todoId);
        return targetTodo;
    }

    const getTodos = function () {
        return this.todos;
    }

    return {
        name,
        id,
        todos,
        addTodo,
        removeTodo,
        getTodo,
        getTodos,
    }

}