import { Todo } from '../models/Todo.js';
import { TodoList } from '../models/TodoList.js';

/**
 * TodoRepository - Handles data operations between models and storage
 * Follows Single Responsibility Principle: Only handles data persistence logic
 * Follows Dependency Inversion Principle: Depends on StorageInterface abstraction
 */
export class TodoRepository {
    /**
     * @param {StorageInterface} storageService - Storage service implementation
     * @param {string} storageKey - Key for localStorage
     */
    constructor(storageService, storageKey = 'todoApp_data') {
        this.storageService = storageService;
        this.storageKey = storageKey;
    }

    /**
     * Load todos from storage
     * @returns {TodoList} Loaded todo list
     */
    loadTodos() {
        const data = this.storageService.load(this.storageKey);
        if (data && Array.isArray(data)) {
            return TodoList.fromJSON(data);
        }
        return new TodoList();
    }

    /**
     * Save todos to storage
     * @param {TodoList} todoList - Todo list to save
     */
    saveTodos(todoList) {
        const data = todoList.toJSON();
        this.storageService.save(this.storageKey, data);
    }

    /**
     * Generate unique ID for new todos
     * @returns {string} Unique identifier
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Create a new todo with generated ID
     * @param {string} text - Todo text content
     * @returns {Todo} New todo instance
     */
    createTodo(text) {
        const id = this.generateId();
        return new Todo(id, text);
    }
}
