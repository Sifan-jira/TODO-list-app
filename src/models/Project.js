/**
 * Project Model
 * Represents a collection of tasks
 */
export default class Project {
  constructor(id, name, color = '#3b82f6', createdAt = new Date()) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.createdAt = createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      createdAt: this.createdAt instanceof Date ? this.createdAt.toISOString() : this.createdAt,
    };
  }

  static fromJSON(data) {
    return new Project(
      data.id,
      data.name,
      data.color,
      new Date(data.createdAt)
    );
  }
}
