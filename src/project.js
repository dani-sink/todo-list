import { createTodo } from "./todo.js";

export const createProject =  function(name) {
    const id = crypto.randomUUID();
    let todos = [];

    const addTodo = (
        title,
        description,
        dueDate,
        priority,
    ) => {
        const newTodo = createTodo(title, description, dueDate, priority);
        todos.push(newTodo);
        return newTodo.id;
    }

    const removeTodo = (todoId) => {
        todos = todos.filter(todo => todo.id !== todoId);
    }

    const getTodo = (todoId) => {
        const targetTodo = todos.find(todo => todo.id === todoId);
        return targetTodo;
    }

    const getTodos = () => todos;

    return {
        name,
        id,
        addTodo,
        removeTodo,
        getTodo,
        getTodos,
    }

}