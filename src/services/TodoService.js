import { Todo } from '../models/Todo.js';

/**
 * TodoService - Business logic layer for todos
 * Follows Single Responsibility Principle: Only handles todo business rules
 * Open/Closed Principle: Can be extended without modifying existing code
 * Dependency Inversion: Depends on TodoRepository abstraction
 */
export class TodoService {
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }

    /**
     * Get all todos, optionally filtered by project
     * @param {string} projectId - Project ID to filter by ('all' for no filter)
     * @returns {Array} Array of todo objects
     */
    getAllTodos(projectId = 'all') {
        const allTodos = this.todoRepository.getAll().getAllTodos();
        
        if (projectId === 'all') {
            return allTodos.map(t => t.toJSON());
        } else if (projectId === 'none') {
            return allTodos.filter(t => !t.projectId).map(t => t.toJSON());
        } else {
            return allTodos.filter(t => t.projectId === projectId).map(t => t.toJSON());
        }
    }

    /**
     * Get filtered todos
     * @param {string} filter - Filter type ('all', 'active', 'completed')
     * @param {string} projectId - Project ID to filter by
     * @returns {Array} Filtered array of todo objects
     */
    getFilteredTodos(filter, projectId = 'all') {
        let todos = this.getAllTodos(projectId);
        
        if (filter === 'active') {
            todos = todos.filter(t => !t.completed);
        } else if (filter === 'completed') {
            todos = todos.filter(t => t.completed);
        }
        
        return todos;
    }

    /**
     * Add a new todo
     * @param {string} text - Todo text
     * @param {string|null} projectId - Project ID (null for no project)
     * @returns {Object} Created todo
     */
    addTodo(text, projectId = null) {
        if (!text || text.trim() === '') {
            throw new Error('Todo text is required');
        }

        const id = this._generateId();
        const todo = new Todo(id, text.trim(), false, new Date(), projectId);
        this.todoRepository.getAll().addTodo(todo);
        this.todoRepository.save(this.todoRepository.getAll());
        return todo.toJSON();
    }

    /**
     * Toggle todo completion status
     * @param {string} todoId - Todo ID to toggle
     * @returns {boolean} True if toggled
     */
    toggleTodo(todoId) {
        const result = this.todoRepository.getAll().toggleTodo(todoId);
        if (result) {
            this.todoRepository.save(this.todoRepository.getAll());
        }
        return result;
    }

    /**
     * Delete a todo
     * @param {string} todoId - Todo ID to delete
     * @returns {boolean} True if deleted
     */
    deleteTodo(todoId) {
        const result = this.todoRepository.getAll().removeTodo(todoId);
        if (result) {
            this.todoRepository.save(this.todoRepository.getAll());
        }
        return result;
    }

    /**
     * Update todo text
     * @param {string} todoId - Todo ID to update
     * @param {string} newText - New text content
     * @returns {boolean} True if updated
     */
    updateTodo(todoId, newText) {
        if (!newText || newText.trim() === '') {
            throw new Error('Todo text cannot be empty');
        }
        
        const result = this.todoRepository.getAll().updateTodo(todoId, newText.trim());
        if (result) {
            this.todoRepository.save(this.todoRepository.getAll());
        }
        return result;
    }

    /**
     * Get a todo by ID
     * @param {string} todoId - Todo ID
     * @returns {Object|null} Todo object or null
     */
    getTodoById(todoId) {
        const todo = this.todoRepository.getAll().getTodoById(todoId);
        return todo ? todo.toJSON() : null;
    }

    /**
     * Clear completed todos
     * @param {string} projectId - Project ID to clear from ('all' for all projects)
     */
    clearCompleted(projectId = 'all') {
        const todos = this.todoRepository.getAll();
        let cleared = 0;
        
        todos.getAllTodos().forEach(todo => {
            if (todo.completed) {
                if (projectId === 'all' || todo.projectId === projectId) {
                    todos.removeTodo(todo.id);
                    cleared++;
                }
            }
        });
        
        if (cleared > 0) {
            this.todoRepository.save(todos);
        }
    }

    /**
     * Generate unique ID
     * @private
     * @returns {string} Unique ID
     */
    _generateId() {
        return `todo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
