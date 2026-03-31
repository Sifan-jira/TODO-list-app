import { ProjectRepository } from './ProjectRepository.js';
import Project from '../models/Project.js';

/**
 * ProjectService - Business logic layer for projects
 * Follows Single Responsibility Principle: Only handles project business rules
 * Open/Closed Principle: Can be extended without modifying existing code
 * Dependency Inversion: Depends on ProjectRepository abstraction
 */
export class ProjectService {
    constructor(projectRepository) {
        this.projectRepository = projectRepository;
    }

    /**
     * Get all projects
     * @returns {ProjectList} List of all projects
     */
    getAllProjects() {
        return this.projectRepository.getAll();
    }

    /**
     * Create a new project
     * @param {string} name - Project name
     * @param {string} color - Project color
     * @returns {Project} Created project
     */
    createProject(name, color = '#3b82f6') {
        if (!name || name.trim() === '') {
            throw new Error('Project name is required');
        }

        const id = this._generateId();
        const project = new Project(id, name.trim(), color);
        this.projectRepository.add(project);
        return project;
    }

    /**
     * Delete a project
     * @param {string} projectId - Project ID to delete
     * @returns {boolean} True if deleted
     */
    deleteProject(projectId) {
        if (!projectId) {
            throw new Error('Project ID is required');
        }
        return this.projectRepository.remove(projectId);
    }

    /**
     * Get a project by ID
     * @param {string} projectId - Project ID
     * @returns {Project|null} Project or null
     */
    getProjectById(projectId) {
        return this.projectRepository.getById(projectId);
    }

    /**
     * Generate unique ID
     * @private
     * @returns {string} Unique ID
     */
    _generateId() {
        return `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
