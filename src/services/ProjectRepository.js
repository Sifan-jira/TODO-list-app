import { EventEmitter } from '../utils/EventEmitter.js';
import Project from '../models/Project.js';
import ProjectList from '../models/ProjectList.js';

/**
 * ProjectRepository - Data access layer for projects
 * Follows Single Responsibility Principle: Only handles project data persistence
 * Depends on abstraction (StorageInterface) following Dependency Inversion
 */
export class ProjectRepository extends EventEmitter {
    constructor(storageService, storageKey = 'todo_projects') {
        super();
        this.storageService = storageService;
        this.storageKey = storageKey;
    }

    /**
     * Get all projects from storage
     * @returns {ProjectList} List of all projects
     */
    getAll() {
        try {
            const data = this.storageService.get(this.storageKey);
            if (!data) {
                return new ProjectList();
            }
            return ProjectList.fromJSON(data);
        } catch (error) {
            this.emit('error', { type: 'read', message: error.message });
            return new ProjectList();
        }
    }

    /**
     * Save project list to storage
     * @param {ProjectList} projectList - Project list to save
     */
    save(projectList) {
        try {
            this.storageService.set(this.storageKey, projectList.toJSON());
            this.emit('change', { type: 'save' });
        } catch (error) {
            this.emit('error', { type: 'write', message: error.message });
        }
    }

    /**
     * Add a new project
     * @param {Project} project - Project to add
     */
    add(project) {
        const projectList = this.getAll();
        projectList.add(project);
        this.save(projectList);
        this.emit('projectAdded', { project });
    }

    /**
     * Remove a project by ID
     * @param {string} projectId - Project ID to remove
     * @returns {boolean} True if removed
     */
    remove(projectId) {
        const projectList = this.getAll();
        const removed = projectList.remove(projectId);
        if (removed) {
            this.save(projectList);
            this.emit('projectRemoved', { projectId });
        }
        return removed;
    }

    /**
     * Get a project by ID
     * @param {string} projectId - Project ID
     * @returns {Project|null} Project or null if not found
     */
    getById(projectId) {
        const projectList = this.getAll();
        return projectList.getById(projectId) || null;
    }
}
