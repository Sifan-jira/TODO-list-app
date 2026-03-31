import { EventEmitter } from '../utils/EventEmitter.js';

/**
 * DashboardView - UI rendering layer for the dashboard
 * Follows Single Responsibility Principle: Only handles dashboard UI rendering
 * Open/Closed Principle: Can be extended with new widgets without modifying code
 */
export class DashboardView extends EventEmitter {
    constructor() {
        super();
        this.container = null;
    }

    /**
     * Initialize the dashboard view
     * @param {HTMLElement} container - Container element
     */
    init(container) {
        this.container = container;
        this.render();
        this.attachEventListeners();
    }

    /**
     * Render the dashboard
     */
    render() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="dashboard">
                <header class="dashboard-header">
                    <h1>📊 Dashboard</h1>
                    <p class="dashboard-subtitle">Overview of your tasks and projects</p>
                </header>
                
                <div class="stats-grid">
                    <div class="stat-card stat-total">
                        <div class="stat-icon">📝</div>
                        <div class="stat-content">
                            <span class="stat-value" id="stat-total-tasks">0</span>
                            <span class="stat-label">Total Tasks</span>
                        </div>
                    </div>
                    <div class="stat-card stat-active">
                        <div class="stat-icon">⏳</div>
                        <div class="stat-content">
                            <span class="stat-value" id="stat-active-tasks">0</span>
                            <span class="stat-label">Active Tasks</span>
                        </div>
                    </div>
                    <div class="stat-card stat-completed">
                        <div class="stat-icon">✅</div>
                        <div class="stat-content">
                            <span class="stat-value" id="stat-completed-tasks">0</span>
                            <span class="stat-label">Completed</span>
                        </div>
                    </div>
                    <div class="stat-card stat-projects">
                        <div class="stat-icon">📁</div>
                        <div class="stat-content">
                            <span class="stat-value" id="stat-total-projects">0</span>
                            <span class="stat-label">Projects</span>
                        </div>
                    </div>
                </div>

                <div class="dashboard-content">
                    <section class="dashboard-section projects-section">
                        <div class="section-header">
                            <h2>📁 Projects</h2>
                            <button class="btn btn-primary btn-sm" id="btn-add-project">
                                <span>+</span> New Project
                            </button>
                        </div>
                        <div class="projects-grid" id="projects-grid">
                            <div class="project-card project-all active" data-project-id="all">
                                <div class="project-color-bar" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"></div>
                                <div class="project-content">
                                    <h3>All Tasks</h3>
                                    <span class="project-count" id="project-all-count">0</span>
                                </div>
                            </div>
                            <div class="project-card" data-project-id="none">
                                <div class="project-color-bar" style="background: #9ca3af;"></div>
                                <div class="project-content">
                                    <h3>No Project</h3>
                                    <span class="project-count" id="project-none-count">0</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section class="dashboard-section recent-section">
                        <div class="section-header">
                            <h2>📋 Recent Tasks</h2>
                            <button class="btn btn-secondary btn-sm" id="btn-view-all-tasks">
                                View All →
                            </button>
                        </div>
                        <div class="recent-tasks" id="recent-tasks">
                            <p class="empty-state">No recent tasks</p>
                        </div>
                    </section>
                </div>
            </div>
        `;
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        if (!this.container) return;

        // Add project button
        const addProjectBtn = this.container.querySelector('#btn-add-project');
        if (addProjectBtn) {
            addProjectBtn.addEventListener('click', () => {
                this.emit('addProject');
            });
        }

        // View all tasks button
        const viewAllBtn = this.container.querySelector('#btn-view-all-tasks');
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', () => {
                this.emit('viewAllTasks');
            });
        }

        // Project cards
        this.container.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const projectId = card.dataset.projectId;
                this.emit('selectProject', { projectId });
            });
        });
    }

    /**
     * Update dashboard statistics
     * @param {Object} stats - Statistics object
     */
    updateStats(stats) {
        const totalEl = this.container?.querySelector('#stat-total-tasks');
        const activeEl = this.container?.querySelector('#stat-active-tasks');
        const completedEl = this.container?.querySelector('#stat-completed-tasks');
        const projectsEl = this.container?.querySelector('#stat-total-projects');

        if (totalEl) totalEl.textContent = stats.totalTasks || 0;
        if (activeEl) activeEl.textContent = stats.activeTasks || 0;
        if (completedEl) completedEl.textContent = stats.completedTasks || 0;
        if (projectsEl) projectsEl.textContent = stats.totalProjects || 0;
    }

    /**
     * Render projects grid
     * @param {Array} projects - Array of project objects
     * @param {Object} taskCounts - Task counts per project
     */
    renderProjects(projects, taskCounts) {
        const grid = this.container?.querySelector('#projects-grid');
        if (!grid) return;

        // Keep the "All Tasks" and "No Project" cards
        const fixedCards = grid.querySelectorAll('.project-card[data-project-id="all"], .project-card[data-project-id="none"]');
        grid.innerHTML = '';
        fixedCards.forEach(card => grid.appendChild(card));

        // Add project cards
        projects.forEach(project => {
            const count = taskCounts[project.id] || 0;
            const card = document.createElement('div');
            card.className = 'project-card';
            card.dataset.projectId = project.id;
            card.innerHTML = `
                <div class="project-color-bar" style="background: ${project.color};"></div>
                <div class="project-content">
                    <h3>${this._escapeHtml(project.name)}</h3>
                    <span class="project-count">${count}</span>
                </div>
                <button class="btn-delete-project" title="Delete project">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                    </svg>
                </button>
            `;
            
            // Delete button handler
            const deleteBtn = card.querySelector('.btn-delete-project');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.emit('deleteProject', { projectId: project.id, projectName: project.name });
            });

            // Card click handler
            card.addEventListener('click', () => {
                this.emit('selectProject', { projectId: project.id });
            });

            grid.appendChild(card);
        });

        // Update counts for fixed cards
        const allCount = this.container?.querySelector('#project-all-count');
        const noneCount = this.container?.querySelector('#project-none-count');
        if (allCount) allCount.textContent = taskCounts.all || 0;
        if (noneCount) noneCount.textContent = taskCounts.none || 0;
    }

    /**
     * Render recent tasks
     * @param {Array} tasks - Array of recent task objects
     */
    renderRecentTasks(tasks) {
        const container = this.container?.querySelector('#recent-tasks');
        if (!container) return;

        if (!tasks || tasks.length === 0) {
            container.innerHTML = '<p class="empty-state">No recent tasks</p>';
            return;
        }

        container.innerHTML = tasks.map(task => `
            <div class="recent-task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                <div class="task-checkbox">
                    <input type="checkbox" ${task.completed ? 'checked' : ''} />
                </div>
                <div class="task-info">
                    <span class="task-text">${this._escapeHtml(task.text)}</span>
                    ${task.projectName ? `<span class="task-project" style="color: ${task.projectColor}">• ${this._escapeHtml(task.projectName)}</span>` : ''}
                </div>
                <div class="task-date">${this._formatDate(task.createdAt)}</div>
            </div>
        `).join('');

        // Add checkbox handlers
        container.querySelectorAll('input[type="checkbox"]').forEach((checkbox, index) => {
            checkbox.addEventListener('change', () => {
                const taskId = tasks[index].id;
                this.emit('toggleTask', { taskId });
            });
        });
    }

    /**
     * Select a project card
     * @param {string} projectId - Project ID to select
     */
    selectProjectCard(projectId) {
        this.container?.querySelectorAll('.project-card').forEach(card => {
            card.classList.remove('active');
            if (card.dataset.projectId === projectId) {
                card.classList.add('active');
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

    /**
     * Format date
     * @private
     * @param {Date|string} date - Date to format
     * @returns {string} Formatted date
     */
    _formatDate(date) {
        const d = new Date(date);
        const now = new Date();
        const diff = now - d;
        
        // Less than 24 hours
        if (diff < 86400000) {
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        // Less than 7 days
        if (diff < 604800000) {
            return d.toLocaleDateString([], { weekday: 'short' });
        }
        return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
}
