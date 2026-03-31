import { EventEmitter } from '../utils/EventEmitter.js';

/**
 * TodoView - Handles UI rendering and user interactions
 * Follows Single Responsibility Principle: Only handles view logic
 * Follows Dependency Inversion Principle: Emits events instead of calling service directly
 */
export class TodoView extends EventEmitter {
    constructor() {
        super();
        this.container = null;
        this.filter = 'all';
    }

    /**
     * Initialize the view with container element
     * @param {HTMLElement} container - Main container element
     */
    init(container) {
        this.container = container;
        this.render();
        this.attachEventListeners();
    }

    /**
     * Render the entire todo app
     */
    render() {
        this.container.innerHTML = `
            <div class="todo-app">
                <h1>Todo List</h1>
                <div class="todo-input-container">
                    <input 
                        type="text" 
                        id="todo-input" 
                        placeholder="Add a new todo..." 
                        autocomplete="off"
                    />
                    <button id="add-btn" class="add-btn">Add</button>
                </div>
                <div class="todo-filters">
                    <button class="filter-btn active" data-filter="all">All</button>
                    <button class="filter-btn" data-filter="active">Active</button>
                    <button class="filter-btn" data-filter="completed">Completed</button>
                </div>
                <ul id="todo-list" class="todo-list"></ul>
                <div class="todo-footer">
                    <span id="items-left" class="items-left">0 items left</span>
                    <button id="clear-completed" class="clear-btn">Clear Completed</button>
                </div>
            </div>
        `;
    }

    /**
     * Attach event listeners to interactive elements
     */
    attachEventListeners() {
        // Add todo button
        const addBtn = this.container.querySelector('#add-btn');
        const todoInput = this.container.querySelector('#todo-input');

        addBtn.addEventListener('click', () => {
            const text = todoInput.value.trim();
            if (text) {
                this.emit('addTodo', text);
                todoInput.value = '';
            }
        });

        // Enter key to add todo
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const text = todoInput.value.trim();
                if (text) {
                    this.emit('addTodo', text);
                    todoInput.value = '';
                }
            }
        });

        // Filter buttons
        const filterBtns = this.container.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filter = e.target.dataset.filter;
                this.emit('filterChange', this.filter);
            });
        });

        // Clear completed button
        const clearBtn = this.container.querySelector('#clear-completed');
        clearBtn.addEventListener('click', () => {
            this.emit('clearCompleted');
        });

        // Delegate events for todo list items
        const todoList = this.container.querySelector('#todo-list');
        todoList.addEventListener('click', (e) => {
            const todoItem = e.target.closest('.todo-item');
            if (!todoItem) return;

            const id = todoItem.dataset.id;

            // Toggle completion
            if (e.target.classList.contains('todo-checkbox')) {
                this.emit('toggleTodo', id);
            }

            // Delete todo
            if (e.target.classList.contains('delete-btn')) {
                this.emit('deleteTodo', id);
            }

            // Edit todo
            if (e.target.classList.contains('edit-btn')) {
                this.startEditing(todoItem, id);
            }
        });

        // Handle double click to edit
        todoList.addEventListener('dblclick', (e) => {
            const todoText = e.target.closest('.todo-text');
            if (todoText) {
                const todoItem = todoText.closest('.todo-item');
                const id = todoItem.dataset.id;
                this.startEditing(todoItem, id);
            }
        });
    }

    /**
     * Start editing a todo item
     * @param {HTMLElement} todoItem - Todo item element
     * @param {string} id - Todo ID
     */
    startEditing(todoItem, id) {
        const textSpan = todoItem.querySelector('.todo-text');
        const currentText = textSpan.textContent;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'edit-input';
        input.value = currentText;

        textSpan.style.display = 'none';
        todoItem.insertBefore(input, textSpan.nextSibling);
        input.focus();

        const saveEdit = () => {
            const newText = input.value.trim();
            if (newText && newText !== currentText) {
                this.emit('updateTodo', { id, newText });
            }
            input.remove();
            textSpan.style.display = '';
        };

        input.addEventListener('blur', saveEdit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveEdit();
            } else if (e.key === 'Escape') {
                input.remove();
                textSpan.style.display = '';
            }
        });
    }

    /**
     * Render todos list
     * @param {Todo[]} todos - Array of todos to render
     */
    renderTodos(todos) {
        const todoList = this.container.querySelector('#todo-list');
        
        if (todos.length === 0) {
            todoList.innerHTML = '<li class="empty-message">No todos yet. Add one above!</li>';
            return;
        }

        todoList.innerHTML = todos.map(todo => `
            <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                />
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                <button class="edit-btn" title="Edit">✏️</button>
                <button class="delete-btn" title="Delete">🗑️</button>
            </li>
        `).join('');
    }

    /**
     * Update items left counter
     * @param {number} count - Number of active items
     */
    updateItemsLeft(count) {
        const itemsLeft = this.container.querySelector('#items-left');
        itemsLeft.textContent = `${count} item${count !== 1 ? 's' : ''} left`;
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    showError(message) {
        alert(message);
    }
}
