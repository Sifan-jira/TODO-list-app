import { Todo } from '../models/Todo.js';

/**
 * TodoList Model - Manages a collection of Todo items
 * Follows Single Responsibility Principle: Only handles todo collection logic
 * Open/Closed Principle: Can be extended without modifying existing code
 */
export class TodoList {
    constructor(todos = []) {
        this.todos = todos;
    }
    
    /**
     * Add a new todo to the list
     * @param {Todo} todo - Todo item to add
     */
    addTodo(todo) {
        this.todos.push(todo);
    }

    /**
     * Remove a todo by ID
     * @param {string} id - Todo ID to remove
     * @returns {boolean} True if removed, false if not found
     */
    removeTodo(id) {
        const index = this.todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
            this.todos.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * Toggle todo completion status
     * @param {string} id - Todo ID to toggle
     * @returns {boolean} True if toggled, false if not found
     */
    toggleTodo(id) {
        const index = this.todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
            this.todos[index] = this.todos[index].toggle();
            return true;
        }
        return false;
    }

    /**
     * Update todo text
     * @param {string} id - Todo ID to update
     * @param {string} newText - New text content
     * @returns {boolean} True if updated, false if not found
     */
    updateTodo(id, newText) {
        const index = this.todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
            this.todos[index] = this.todos[index].updateText(newText);
            return true;
        }
        return false;
    }

    /**
     * Get all todos
     * @returns {Todo[]} Array of all todos
     */
    getAllTodos() {
        return [...this.todos];
    }

    /**
     * Get todos by filter
     * @param {string} filter - 'all', 'active', or 'completed'
     * @returns {Todo[]} Filtered array of todos
     */
    getFilteredTodos(filter) {
        switch (filter) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return [...this.todos];
        }
    }

    /**
     * Get todos by project ID
     * @param {string|null} projectId - Project ID to filter by (null for no project)
     * @returns {Todo[]} Filtered array of todos
     */
    getTodosByProject(projectId) {
        if (projectId === null || projectId === undefined) {
            return this.todos.filter(todo => !todo.projectId);
        }
        return this.todos.filter(todo => todo.projectId === projectId);
    }

    /**
     * Get todo by ID
     * @param {string} id - Todo ID
     * @returns {Todo|null} Todo item or null if not found
     */
    getTodoById(id) {
        return this.todos.find(todo => todo.id === id) || null;
    }

    /**
     * Get count of active todos
     * @returns {number} Number of active todos
     */
    getActiveCount() {
        return this.todos.filter(todo => !todo.completed).length;
    }

    /**
     * Clear all completed todos
     */
    clearCompleted() {
        this.todos = this.todos.filter(todo => !todo.completed);
    }

    /**
     * Serialize todolist to plain array
     * @returns {Object[]} Array of plain objects
     */
    toJSON() {
        return this.todos.map(todo => todo.toJSON());
    }

    /**
     * Deserialize from plain array
     * @param {Object[]} data - Array of plain objects
     * @returns {TodoList} TodoList instance
     */
    static fromJSON(data) {
        const todos = data.map(item => Todo.fromJSON(item));
        return new TodoList(todos);
    }
}
