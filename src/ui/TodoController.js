import { TodoService } from '../services/TodoService.js';
import { TodoView } from '../ui/TodoView.js';

/**
 * TodoController - Connects the View and Service layers
 * Follows Single Responsibility Principle: Only handles coordination logic
 * Follows Dependency Inversion Principle: Depends on abstractions (service and view)
 */
export class TodoController {
    /**
     * @param {TodoService} service - Todo service instance
     * @param {TodoView} view - Todo view instance
     */
    constructor(service, view) {
        this.service = service;
        this.view = view;
    }

    /**
     * Initialize the controller and set up event handlers
     */
    init() {
        // Handle add todo event from view
        this.view.on('addTodo', (text) => {
            try {
                this.service.addTodo(text);
                this.refresh();
            } catch (error) {
                this.view.showError(error.message);
            }
        });

        // Handle toggle todo event from view
        this.view.on('toggleTodo', (id) => {
            this.service.toggleTodo(id);
            this.refresh();
        });

        // Handle delete todo event from view
        this.view.on('deleteTodo', (id) => {
            this.service.removeTodo(id);
            this.refresh();
        });

        // Handle update todo event from view
        this.view.on('updateTodo', ({ id, newText }) => {
            try {
                this.service.updateTodo(id, newText);
                this.refresh();
            } catch (error) {
                this.view.showError(error.message);
            }
        });

        // Handle filter change event from view
        this.view.on('filterChange', (filter) => {
            this.renderFilteredTodos(filter);
        });

        // Handle clear completed event from view
        this.view.on('clearCompleted', () => {
            this.service.clearCompleted();
            this.refresh();
        });

        // Initial render
        this.refresh();
    }

    /**
     * Refresh the view with current data
     */
    refresh() {
        const todos = this.service.getFilteredTodos(this.view.filter);
        const activeCount = this.service.getActiveCount();
        
        this.view.renderTodos(todos);
        this.view.updateItemsLeft(activeCount);
    }

    /**
     * Render filtered todos
     * @param {string} filter - Filter type
     */
    renderFilteredTodos(filter) {
        const todos = this.service.getFilteredTodos(filter);
        this.view.renderTodos(todos);
    }
}
