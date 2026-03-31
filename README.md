# Todo List Management System

A SOLID-compliant Todo List Management System built with Vanilla JavaScript and Webpack.

## Features

- ✅ Add, edit, and delete todos
- ✅ Mark todos as complete/incomplete
- ✅ Filter todos (All, Active, Completed)
- ✅ Clear completed todos
- ✅ Persistent storage using localStorage
- ✅ Responsive design
- ✅ Clean, modern UI

## SOLID Principles Applied

### Single Responsibility Principle (SRP)
Each class has one reason to change:
- `Todo` - Represents a single todo item
- `TodoList` - Manages collection of todos
- `TodoService` - Business logic operations
- `TodoRepository` - Data persistence logic
- `TodoView` - UI rendering and user interactions
- `TodoController` - Coordination between view and service

### Open/Closed Principle (OCP)
- `EventEmitter` can be extended without modification
- `StorageInterface` allows new storage implementations without changing existing code

### Liskov Substitution Principle (LSP)
- `LocalStorageService` extends `StorageInterface` and can replace it without breaking the app

### Interface Segregation Principle (ISP)
- `StorageInterface` provides small, focused methods

### Dependency Inversion Principle (DIP)
- High-level modules (`TodoService`, `TodoController`) depend on abstractions
- Dependency injection in `App` class

## Project Structure

```
/workspace
├── src/
│   ├── models/
│   │   ├── Todo.js          # Todo entity
│   │   └── TodoList.js      # Todo collection
│   ├── services/
│   │   ├── StorageInterface.js    # Storage abstraction
│   │   ├── LocalStorageService.js # localStorage implementation
│   │   ├── TodoRepository.js      # Data access layer
│   │   └── TodoService.js         # Business logic layer
│   ├── ui/
│   │   ├── TodoView.js      # UI component
│   │   └── TodoController.js # Controller (MVC pattern)
│   ├── utils/
│   │   └── EventEmitter.js  # Event handling utility
│   ├── index.js             # Application entry point
│   └── styles.css           # Application styles
├── dist/                    # Build output (generated)
├── index.html               # HTML template
├── webpack.config.js        # Webpack configuration
└── package.json             # Project dependencies
```

## Installation

```bash
npm install
```

## Development

Start the development server with hot reload:

```bash
npm run dev
```

or

```bash
npm start
```

## Production Build

Build for production:

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Usage

1. **Add a Todo**: Type in the input field and press Enter or click "Add"
2. **Complete a Todo**: Click the checkbox next to a todo
3. **Edit a Todo**: Double-click on the todo text or click the edit button (✏️)
4. **Delete a Todo**: Click the delete button (🗑️)
5. **Filter Todos**: Use the filter buttons (All, Active, Completed)
6. **Clear Completed**: Click "Clear Completed" to remove all completed todos

## Technologies Used

- Vanilla JavaScript (ES6+)
- Webpack 5
- HTML5
- CSS3
