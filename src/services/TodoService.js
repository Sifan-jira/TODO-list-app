import { TodoList } from '../models/TodoList.js';

/**
 * TodoService - Business logic layer for todo operations
 * Follows Single Responsibility Principle: Only handles business logic
 * Follows Dependency Inversion Principle: Depends on repository abstraction
 */
export class TodoService {
    /**
     * @param {TodoRepository} repository - Repository instance
     */
    constructor(repository) {
        this.repository = repository;
        this.todoList = this.repository.loadTodos();
    }

    /**
     * Add a new todo
     * @param {string} text - Todo text content
     * @returns {Todo} Created todo
     */
    addTodo(text) {
        if (!text || text.trim() === '') {
            throw new Error('Todo text cannot be empty');
        }
        const todo = this.repository.createTodo(text.trim());
        this.todoList.addTodo(todo);
        this._persist();
        return todo;
    }

    /**
     * Remove a todo by ID
     * @param {string} id - Todo ID to remove
     * @returns {boolean} Success status
     */
    removeTodo(id) {
        const removed = this.todoList.removeTodo(id);
        if (removed) {
            this._persist();
        }
        return removed;
    }

    /**
     * Toggle todo completion status
     * @param {string} id - Todo ID to toggle
     * @returns {boolean} Success status
     */
    toggleTodo(id) {
        const toggled = this.todoList.toggleTodo(id);
        if (toggled) {
            this._persist();
        }
        return toggled;
    }

    /**
     * Update todo text
     * @param {string} id - Todo ID to update
     * @param {string} newText - New text content
     * @returns {boolean} Success status
     */
    updateTodo(id, newText) {
        if (!newText || newText.trim() === '') {
            throw new Error('Todo text cannot be empty');
        }
        const updated = this.todoList.updateTodo(id, newText.trim());
        if (updated) {
            this._persist();
        }
        return updated;
    }

    /**
     * Get all todos
     * @returns {Todo[]} Array of todos
     */
    getAllTodos() {
        return this.todoList.getAllTodos();
    }

    /**
     * Get filtered todos
     * @param {string} filter - 'all', 'active', or 'completed'
     * @returns {Todo[]} Filtered array of todos
     */
    getFilteredTodos(filter) {
        return this.todoList.getFilteredTodos(filter);
    }

    /**
     * Get active todo count
     * @returns {number} Number of active todos
     */
    getActiveCount() {
        return this.todoList.getActiveCount();
    }

    /**
     * Clear all completed todos
     * @returns {number} Number of cleared todos
     */
    clearCompleted() {
        const beforeCount = this.todoList.getAllTodos().length;
        this.todoList.clearCompleted();
        const afterCount = this.todoList.getAllTodos().length;
        if (beforeCount !== afterCount) {
            this._persist();
        }
        return beforeCount - afterCount;
    }

    /**
     * Persist current state to storage
     * @private
     */
    _persist() {
        this.repository.saveTodos(this.todoList);
    }
}
