/**
 * Project List Model
 * Manages a collection of projects
 */
export default class ProjectList {
  constructor() {
    this.projects = [];
  }

  add(project) {
    this.projects.push(project);
    return project;
  }

  remove(projectId) {
    const index = this.projects.findIndex(p => p.id === projectId);
    if (index !== -1) {
      this.projects.splice(index, 1);
      return true;
    }
    return false;
  }

  getById(projectId) {
    return this.projects.find(p => p.id === projectId);
  }

  getAll() {
    return [...this.projects];
  }

  count() {
    return this.projects.length;
  }

  toJSON() {
    return this.projects.map(p => p.toJSON());
  }

  static fromJSON(data) {
    const projectList = new ProjectList();
    data.forEach(item => {
      projectList.add(Project.fromJSON(item));
    });
    return projectList;
  }
}
