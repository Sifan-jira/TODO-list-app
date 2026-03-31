/**
 * EventEmitter - Simple event emitter for handling custom events
 * Follows Open/Closed Principle: Can be extended without modification
 */
export class EventEmitter {
    constructor() {
        this.events = new Map();
    }

    /**
     * Subscribe to an event
     * @param {string} eventName - Name of the event
     * @param {Function} callback - Callback function
     */
    on(eventName, callback) {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }
        this.events.get(eventName).push(callback);
    }

    /**
     * Unsubscribe from an event
     * @param {string} eventName - Name of the event
     * @param {Function} callback - Callback function to remove
     */
    off(eventName, callback) {
        if (!this.events.has(eventName)) {
            return;
        }
        const callbacks = this.events.get(eventName);
        const index = callbacks.indexOf(callback);
        if (index !== -1) {
            callbacks.splice(index, 1);
        }
    }

    /**
     * Emit an event
     * @param {string} eventName - Name of the event
     * @param {any} data - Data to pass to callbacks
     */
    emit(eventName, data) {
        if (!this.events.has(eventName)) {
            return;
        }
        this.events.get(eventName).forEach(callback => {
            callback(data);
        });
    }

    /**
     * Subscribe to an event once
     * @param {string} eventName - Name of the event
     * @param {Function} callback - Callback function
     */
    once(eventName, callback) {
        const wrapper = (data) => {
            this.off(eventName, wrapper);
            callback(data);
        };
        this.on(eventName, wrapper);
    }
}
