import { StorageInterface } from './StorageInterface.js';

/**
 * LocalStorageService - Concrete implementation of StorageInterface
 * Uses browser's localStorage for persistence
 * Follows Liskov Substitution Principle: Can replace parent interface without breaking app
 */
export class LocalStorageService extends StorageInterface {
    /**
     * Save data to localStorage
     * @param {string} key - Storage key
     * @param {any} data - Data to save (will be JSON stringified)
     */
    save(key, data) {
        try {
            const serializedData = JSON.stringify(data);
            localStorage.setItem(key, serializedData);
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    /**
     * Load data from localStorage
     * @param {string} key - Storage key
     * @returns {any|null} Parsed data or null if not found
     */
    load(key) {
        try {
            const serializedData = localStorage.getItem(key);
            if (serializedData === null) {
                return null;
            }
            return JSON.parse(serializedData);
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    }

    /**
     * Remove data from localStorage
     * @param {string} key - Storage key
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    }

    /**
     * Clear all data from localStorage
     */
    clear() {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }
}
