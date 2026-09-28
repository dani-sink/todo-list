import { loadTodos, saveTodos } from "./storage.js";
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
        saveTodos(id, todos);
        return newTodo.id;
    }
    
    const removeTodo = (todoId) => {
        todos = todos.filter(todo => todo.id !== todoId);
        saveTodos(id, todos);
    }

    const toggleTodo = (todoId) => {
        todos.find(todo => todo.id === todoId).toggleComplete();
        saveTodos(id, todos);
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
        toggleTodo,
        removeTodo,
        getTodo,
        getTodos,
    }

}