import { EventEmitter } from '../utils/EventEmitter.js';

/**
 * TodoView - UI rendering layer for todos
 * Follows Single Responsibility Principle: Only handles todo UI rendering
 * Open/Closed Principle: Can be extended with new UI components without modifying code
 */
export class TodoView extends EventEmitter {
    constructor() {
        super();
        this.container = null;
        this.currentFilter = 'all';
        this.currentProjectId = 'all';
    }

    /**
     * Initialize the view
     * @param {HTMLElement} container - Container element
     * @param {string} projectId - Current project ID filter
     */
    init(container, projectId = 'all') {
        this.container = container;
        this.currentProjectId = projectId;
        this.render();
        this.attachEventListeners();
    }

    /**
     * Render the todo interface
     */
    render() {
        if (!this.container) return;

        const projectName = this.getProjectName();

        this.container.innerHTML = `
            <div class="todo-app">
                <header class="todo-header">
                    <h1>${projectName} Tasks</h1>
                    <p class="todo-subtitle">Manage your tasks efficiently</p>
                </header>

                <div class="todo-input-section">
                    <form id="todo-form" class="todo-form">
                        <input 
                            type="text" 
                            id="todo-input" 
                            class="todo-input" 
                            placeholder="What needs to be done?" 
                            autocomplete="off"
                        />
                        <button type="submit" class="btn btn-primary">Add Task</button>
                    </form>
                </div>

                <div class="todo-controls">
                    <div class="filter-buttons">
                        <button class="filter-btn ${this.currentFilter === 'all' ? 'active' : ''}" data-filter="all">
                            All
                        </button>
                        <button class="filter-btn ${this.currentFilter === 'active' ? 'active' : ''}" data-filter="active">
                            Active
                        </button>
                        <button class="filter-btn ${this.currentFilter === 'completed' ? 'active' : ''}" data-filter="completed">
                            Completed
                        </button>
                    </div>
                    <button id="clear-completed" class="btn btn-secondary btn-sm">
                        Clear Completed
                    </button>
                </div>

                <ul id="todo-list" class="todo-list"></ul>

                <div id="empty-state" class="empty-state" style="display: none;">
                    <div class="empty-icon">📝</div>
                    <p>No tasks yet. Add one above!</p>
                </div>
            </div>
        `;
    }

    /**
     * Get project name for display
     * @private
     * @returns {string} Project name
     */
    getProjectName() {
        switch (this.currentProjectId) {
            case 'all': return 'All';
            case 'none': return 'No Project';
            default: return 'Project';
        }
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        if (!this.container) return;

        // Form submission
        const form = this.container.querySelector('#todo-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const input = this.container.querySelector('#todo-input');
                const text = input.value.trim();
                if (text) {
                    this.emit('addTodo', { text, projectId: this.currentProjectId });
                    input.value = '';
                }
            });
        }

        // Filter buttons
        const filterBtns = this.container.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentFilter = btn.dataset.filter;
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.emit('filterChange', { filter: this.currentFilter });
            });
        });

        // Clear completed button
        const clearBtn = this.container.querySelector('#clear-completed');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.emit('clearCompleted');
            });
        }
    }

    /**
     * Render todos
     * @param {Array} todos - Array of todo objects
     */
    renderTodos(todos) {
        const listEl = this.container?.querySelector('#todo-list');
        const emptyState = this.container?.querySelector('#empty-state');
        
        if (!listEl) return;

        if (!todos || todos.length === 0) {
            listEl.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        listEl.style.display = 'block';
        if (emptyState) emptyState.style.display = 'none';

        listEl.innerHTML = todos.map(todo => `
            <li class="todo-item ${todo.completed ? 'completed' : ''}" data-todo-id="${todo.id}">
                <div class="todo-checkbox">
                    <input 
                        type="checkbox" 
                        ${todo.completed ? 'checked' : ''} 
                        class="todo-checkbox-input"
                    />
                </div>
                <span class="todo-text">${this._escapeHtml(todo.text)}</span>
                <div class="todo-actions">
                    <button class="btn-edit" title="Edit">✏️</button>
                    <button class="btn-delete" title="Delete">🗑️</button>
                </div>
            </li>
        `).join('');

        // Attach event listeners to todo items
        this.attachTodoItemListeners();
    }

    /**
     * Attach event listeners to todo items
     * @private
     */
    attachTodoItemListeners() {
        if (!this.container) return;

        const todoItems = this.container.querySelectorAll('.todo-item');
        todoItems.forEach(item => {
            const todoId = item.dataset.todoId;

            // Checkbox change
            const checkbox = item.querySelector('.todo-checkbox-input');
            if (checkbox) {
                checkbox.addEventListener('change', () => {
                    this.emit('toggleTodo', { todoId });
                });
            }

            // Edit button
            const editBtn = item.querySelector('.btn-edit');
            if (editBtn) {
                editBtn.addEventListener('click', () => {
                    this.handleEdit(todoId);
                });
            }

            // Delete button
            const deleteBtn = item.querySelector('.btn-delete');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    this.emit('deleteTodo', { todoId });
                });
            }
        });
    }

    /**
     * Handle edit action
     * @private
     * @param {string} todoId - Todo ID to edit
     */
    handleEdit(todoId) {
        const item = this.container?.querySelector(`[data-todo-id="${todoId}"]`);
        if (!item) return;

        const textSpan = item.querySelector('.todo-text');
        const currentText = textSpan.textContent;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        input.className = 'edit-input';
        input.style.cssText = 'flex: 1; padding: 0.5rem; border: 1px solid #ddd; border-radius: 0.25rem; font-size: 1rem;';
        
        textSpan.replaceWith(input);
        input.focus();
        input.select();

        const saveEdit = () => {
            const newText = input.value.trim();
            if (newText && newText !== currentText) {
                this.emit('updateTodo', { todoId, newText });
            } else {
                this.renderTodos(this.todos || []); // Re-render to restore original
            }
        };

        input.addEventListener('blur', saveEdit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveEdit();
            }
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.renderTodos(this.todos || []);
            }
        });
    }

    /**
     * Escape HTML to prevent XSS
     * @private
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
