import { EventEmitter } from './utils/EventEmitter.js';
import { Todo } from './models/Todo.js';
import { TodoList } from './models/TodoList.js';
import { LocalStorageService } from './services/LocalStorageService.js';
import { TodoRepository } from './services/TodoRepository.js';
import { TodoService } from './services/TodoService.js';
import { ProjectRepository } from './services/ProjectRepository.js';
import { ProjectService } from './services/ProjectService.js';
import { TodoView } from './ui/TodoView.js';
import { TodoController } from './ui/TodoController.js';
import { DashboardView } from './ui/DashboardView.js';
import './styles.css';

/**
 * Main Application Class
 * Follows Dependency Inversion Principle: All dependencies are injected
 * Single Responsibility: Only coordinates application components
 */
class App extends EventEmitter {
    constructor() {
        super();
        this.currentView = 'dashboard'; // 'dashboard' or 'todos'
        this.currentProjectId = 'all';
        this.init();
    }

    init() {
        // Initialize storage service
        this.storageService = new LocalStorageService();

        // Initialize todo layer
        this.todoRepository = new TodoRepository(this.storageService);
        this.todoService = new TodoService(this.todoRepository);

        // Initialize project layer
        this.projectRepository = new ProjectRepository(this.storageService);
        this.projectService = new ProjectService(this.projectRepository);

        // Initialize views
        this.todoView = new TodoView();
        this.dashboardView = new DashboardView();

        // Get container
        const appContainer = document.getElementById('app');
        if (!appContainer) {
            console.error('App container not found');
            return;
        }

        // Create navigation
        this.renderNavigation(appContainer);

        // Create main content area
        this.mainContent = document.createElement('main');
        this.mainContent.id = 'main-content';
        this.mainContent.className = 'main-content';
        appContainer.appendChild(this.mainContent);

        // Initialize dashboard
        this.dashboardView.init(this.mainContent);
        this.setupDashboardEvents();
        this.setupTodoEvents();

        // Initial render
        this.refreshDashboard();
    }

    /**
     * Render top navigation
     */
    renderNavigation(container) {
        const nav = document.createElement('nav');
        nav.className = 'top-nav';
        nav.innerHTML = `
            <div class="nav-brand">✅ TaskFlow</div>
            <div class="nav-links">
                <button class="nav-link ${this.currentView === 'dashboard' ? 'active' : ''}" data-view="dashboard">
                    📊 Dashboard
                </button>
                <button class="nav-link ${this.currentView === 'todos' ? 'active' : ''}" data-view="todos">
                    📋 Tasks
                </button>
            </div>
        `;
        container.appendChild(nav);

        // Nav click handlers
        nav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                const view = link.dataset.view;
                this.switchView(view);
            });
        });
    }

    /**
     * Switch between views
     */
    switchView(viewName) {
        this.currentView = viewName;
        
        // Update nav active state
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.view === viewName);
        });

        // Render appropriate view
        if (viewName === 'dashboard') {
            this.dashboardView.init(this.mainContent);
            this.setupDashboardEvents();
            this.refreshDashboard();
        } else if (viewName === 'todos') {
            this.todoView.init(this.mainContent, this.currentProjectId);
            this.setupTodoEvents();
            this.todoView.renderTodos(this.todoService.getAllTodos(this.currentProjectId));
        }
    }

    /**
     * Setup dashboard event listeners
     */
    setupDashboardEvents() {
        // Add project
        this.dashboardView.on('addProject', () => {
            const name = prompt('Enter project name:');
            if (name && name.trim()) {
                const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                try {
                    this.projectService.createProject(name, color);
                    this.refreshDashboard();
                } catch (error) {
                    alert(error.message);
                }
            }
        });

        // Delete project
        this.dashboardView.on('deleteProject', ({ projectId, projectName }) => {
            if (confirm(`Delete project "${projectName}"? Tasks will remain but won't be associated with any project.`)) {
                this.projectService.deleteProject(projectId);
                this.refreshDashboard();
            }
        });

        // Select project
        this.dashboardView.on('selectProject', ({ projectId }) => {
            this.currentProjectId = projectId;
            this.dashboardView.selectProjectCard(projectId);
        });

        // View all tasks
        this.dashboardView.on('viewAllTasks', () => {
            this.switchView('todos');
        });

        // Toggle task from recent list
        this.dashboardView.on('toggleTask', ({ taskId }) => {
            const todo = this.todoService.getTodoById(taskId);
            if (todo) {
                this.todoService.toggleTodo(taskId);
                this.refreshDashboard();
            }
        });
    }

    /**
     * Setup todo view event listeners
     */
    setupTodoEvents() {
        this.todoView.on('addTodo', ({ text, projectId }) => {
            try {
                this.todoService.addTodo(text, projectId !== 'none' ? projectId : null);
                this.todoView.renderTodos(this.todoService.getAllTodos(this.currentProjectId));
                if (this.currentView === 'dashboard') {
                    this.refreshDashboard();
                }
            } catch (error) {
                alert(error.message);
            }
        });

        this.todoView.on('toggleTodo', ({ todoId }) => {
            this.todoService.toggleTodo(todoId);
            this.todoView.renderTodos(this.todoService.getAllTodos(this.currentProjectId));
            if (this.currentView === 'dashboard') {
                this.refreshDashboard();
            }
        });

        this.todoView.on('deleteTodo', ({ todoId }) => {
            this.todoService.deleteTodo(todoId);
            this.todoView.renderTodos(this.todoService.getAllTodos(this.currentProjectId));
            if (this.currentView === 'dashboard') {
                this.refreshDashboard();
            }
        });

        this.todoView.on('updateTodo', ({ todoId, newText }) => {
            this.todoService.updateTodo(todoId, newText);
            this.todoView.renderTodos(this.todoService.getAllTodos(this.currentProjectId));
        });

        this.todoView.on('filterChange', ({ filter }) => {
            const todos = this.todoService.getFilteredTodos(filter, this.currentProjectId);
            this.todoView.renderTodos(todos);
        });

        this.todoView.on('clearCompleted', () => {
            this.todoService.clearCompleted(this.currentProjectId);
            this.todoView.renderTodos(this.todoService.getAllTodos(this.currentProjectId));
            if (this.currentView === 'dashboard') {
                this.refreshDashboard();
            }
        });
    }

    /**
     * Refresh dashboard data
     */
    refreshDashboard() {
        const projects = this.projectService.getAllProjects().getAll();
        const allTodos = this.todoService.getAllTodos('all');
        
        // Calculate stats
        const stats = {
            totalTasks: allTodos.length,
            activeTasks: allTodos.filter(t => !t.completed).length,
            completedTasks: allTodos.filter(t => t.completed).length,
            totalProjects: projects.length
        };

        // Calculate task counts per project
        const taskCounts = {
            all: allTodos.length,
            none: allTodos.filter(t => !t.projectId).length
        };
        projects.forEach(project => {
            taskCounts[project.id] = allTodos.filter(t => t.projectId === project.id).length;
        });

        // Get recent tasks (last 5)
        const recentTasks = allTodos
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map(task => {
                let projectName = null;
                let projectColor = null;
                if (task.projectId) {
                    const project = this.projectService.getProjectById(task.projectId);
                    if (project) {
                        projectName = project.name;
                        projectColor = project.color;
                    }
                }
                return {
                    ...task,
                    projectName,
                    projectColor
                };
            });

        // Update dashboard view
        this.dashboardView.updateStats(stats);
        this.dashboardView.renderProjects(projects, taskCounts);
        this.dashboardView.renderRecentTasks(recentTasks);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
