/**
 * Todo Model - Represents a single todo item
 * Follows Single Responsibility Principle: Only handles todo data structure
 */
export class Todo {
    /**
     * @param {string} id - Unique identifier
     * @param {string} text - Todo text content
     * @param {boolean} completed - Completion status
     * @param {Date} createdAt - Creation timestamp
     */
    constructor(id, text, completed = false, createdAt = new Date()) {
        this.id = id;
        this.text = text;
        this.completed = completed;
        this.createdAt = createdAt;
    }

    /**
     * Toggle the completion status
     * @returns {Todo} New Todo instance with toggled status (Immutability)
     */
    toggle() {
        return new Todo(this.id, this.text, !this.completed, this.createdAt);
    }

    /**
     * Update the todo text
     * @param {string} newText - New text content
     * @returns {Todo} New Todo instance with updated text
     */
    updateText(newText) {
        return new Todo(this.id, newText, this.completed, this.createdAt);
    }

    /**
     * Serialize todo to plain object
     * @returns {Object} Plain object representation
     */
    toJSON() {
        return {
            id: this.id,
            text: this.text,
            completed: this.completed,
            createdAt: this.createdAt.toISOString()
        };
    }

    /**
     * Deserialize from plain object
     * @param {Object} data - Plain object data
     * @returns {Todo} Todo instance
     */
    static fromJSON(data) {
        return new Todo(
            data.id,
            data.text,
            data.completed,
            new Date(data.createdAt)
        );
    }
}
