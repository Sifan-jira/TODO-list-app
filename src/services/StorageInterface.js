/**
 * Storage Interface - Defines contract for storage implementations
 * Follows Interface Segregation Principle: Small, focused interface
 * Follows Dependency Inversion Principle: High-level modules depend on abstractions
 */
export class StorageInterface {
    /**
     * Save data to storage
     * @param {string} key - Storage key
     * @param {any} data - Data to save
     * @throws {Error} Must be implemented by subclass
     */
    save(key, data) {
        throw new Error('Method "save" must be implemented');
    }

    /**
     * Load data from storage
     * @param {string} key - Storage key
     * @returns {any} Loaded data
     * @throws {Error} Must be implemented by subclass
     */
    load(key) {
        throw new Error('Method "load" must be implemented');
    }

    /**
     * Remove data from storage
     * @param {string} key - Storage key
     * @throws {Error} Must be implemented by subclass
     */
    remove(key) {
        throw new Error('Method "remove" must be implemented');
    }
}
