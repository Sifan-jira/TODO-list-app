import { LocalStorageService } from './services/LocalStorageService.js';
import { TodoRepository } from './services/TodoRepository.js';
import { TodoService } from './services/TodoService.js';
import { TodoView } from './ui/TodoView.js';
import { TodoController } from './ui/TodoController.js';

/**
 * Main entry point - Dependency Injection and Application Bootstrap
 * Follows Dependency Inversion Principle: High-level modules don't depend on low-level modules
 */
class App {
    constructor() {
        this.storageService = null;
        this.repository = null;
        this.service = null;
        this.view = null;
        this.controller = null;
    }

    /**
     * Initialize all dependencies using Dependency Injection
     */
    init() {
        // Create storage service (low-level module)
        this.storageService = new LocalStorageService();

        // Create repository with storage service (depends on abstraction)
        this.repository = new TodoRepository(this.storageService);

        // Create service with repository (business logic layer)
        this.service = new TodoService(this.repository);

        // Create view (UI layer)
        this.view = new TodoView();

        // Create controller with service and view (coordination layer)
        this.controller = new TodoController(this.service, this.view);

        // Initialize the view when DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
            const container = document.getElementById('content');
            if (container) {
                this.view.init(container);
                this.controller.init();
            } else {
                console.error('Container element #content not found');
            }
        });
    }
}

// Bootstrap the application
const app = new App();
app.init();
