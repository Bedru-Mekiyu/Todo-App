# Todo List App

A modern, responsive task management application built with **React 19**, **Vite**, and **Tailwind CSS**. Featuring interactive drag-and-drop task reordering, status filtering, category & priority tagging, search capabilities, dark mode support, and persistent state in `localStorage`.

---

## Key Features

- **Task Management**: Create, edit, toggle completion, and delete tasks.
- **Drag-and-Drop Reordering**: Intuitively reorder tasks using `@hello-pangea/dnd`.
- **Search & Filtering**: Search tasks by text and filter by status (`All`, `Active`, `Completed`).
- **Prioritization & Categorization**: Tag tasks with priorities (`High`, `Medium`, `Low`) and categories (`General`, `Work`, `Personal`).
- **Sorting**: Flexible sorting by creation date, priority level, or completion status.
- **Batch Operations**: Select multiple tasks for batch deletion or completion.
- **Dark Mode**: Toggleable dark mode theme with persisted user preferences.
- **Persistence**: Automatically syncs tasks and theme state with `localStorage`.

---

## Tech Stack

- **Frontend Library**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & [PostCSS](https://postcss.org/)
- **Drag & Drop**: [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)
- **Linting**: [ESLint 9](https://eslint.org/)

---

## Project Structure

```text
├── .github/
│   └── workflows/
│       └── ci.yml          # Continuous Integration workflow
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images and SVG assets
│   ├── components/         # Reusable React components
│   │   ├── FilterBar.jsx   # Status filter options
│   │   ├── TaskItem.jsx    # Individual task row item
│   │   └── TaskList.jsx    # Container component for task list
│   ├── App.css
│   ├── App.jsx             # Main Application root component
│   ├── TodoListApp.jsx     # Feature-rich todo list implementation
│   ├── index.css           # Global styles and Tailwind imports
│   └── main.jsx            # Application entry point
├── eslint.config.js        # ESLint flat config
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.js          # Vite configuration
```

---

## Getting Started

### Prerequisites

Ensure you have **Node.js** (version 18 or higher recommended) and **npm** installed.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

## Available Scripts

In the project directory, you can run:

### `npm run dev`
Runs the app in development mode with HMR (Hot Module Replacement). Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

### `npm run lint`
Runs ESLint across all `.js` and `.jsx` files to ensure code quality and consistency.

### `npm run build`
Builds the app for production to the `dist` folder. It correctly bundles React in production mode and optimizes the build for performance.

### `npm run preview`
Locally serves the production build from the `dist` directory for previewing.

---

## CI/CD Pipeline

Automated checks are configured via **GitHub Actions** (`.github/workflows/ci.yml`). On every push or pull request to `main` or `master`, the workflow executes:
1. Environment setup with Node.js 20.
2. Clean dependency installation (`npm ci`).
3. Code quality inspection (`npm run lint`).
4. Production build verification (`npm run build`).
