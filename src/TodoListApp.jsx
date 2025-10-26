import { useState, useEffect } from "react";

export function TodoListApp() {
  // Initialize tasks from localStorage
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all"); // all / active / completed
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [lastDeleted, setLastDeleted] = useState(null);

  // Persist tasks in localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Input handlers
  function handleInput(e) {
    setNewTask(e.target.value);
  }

  function handleKeyPress(e) {
    if (e.key === "Enter") addTask();
  }

  // CRUD operations
  function addTask() {
    const text = newTask.trim();
    if (!text) return; // prevent empty tasks
    if (tasks.some((task) => task.text === text)) return; // prevent duplicates
    setTasks([...tasks, { id: Date.now(), text, completed: false }]);
    setNewTask("");
  }

  function deleteTask(i) {
    setLastDeleted(tasks[i]);
    setTasks(tasks.filter((_, index) => index !== i));
  }

  function undoDelete() {
    if (lastDeleted) {
      setTasks([...tasks, lastDeleted]);
      setLastDeleted(null);
    }
  }

  function toggleCompleted(i) {
    setTasks(
      tasks.map((task, index) =>
        index === i ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function moveUp(index) {
    if (index > 0) {
      const moved = [...tasks];
      [moved[index], moved[index - 1]] = [moved[index - 1], moved[index]];
      setTasks(moved);
    }
  }

  function moveDown(index) {
    if (index < tasks.length - 1) {
      const moved = [...tasks];
      [moved[index], moved[index + 1]] = [moved[index + 1], moved[index]];
      setTasks(moved);
    }
  }

  function clearCompleted() {
    setTasks(tasks.filter((task) => !task.completed));
  }

  function editTask(index, text) {
    setTasks(
      tasks.map((task, i) => (i === index ? { ...task, text } : task))
    );
  }

  // Filtering logic
  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const remainingCount = tasks.filter((task) => !task.completed).length;

  return (
    <>
      <h1>Todo List App</h1>

      <input
        type="text"
        placeholder="Enter your todo..."
        value={newTask}
        onChange={handleInput}
        onKeyDown={handleKeyPress}
      />
      <button onClick={addTask}>Add</button>

      <div>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("active")}>Active</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
      </div>

      <div>
        <p>{remainingCount} tasks remaining</p>
      </div>

      <ul>
        {filteredTasks.map((task, index) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleCompleted(index)}
            />

            {editingIndex === index ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={() => {
                  editTask(index, editText);
                  setEditingIndex(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    editTask(index, editText);
                    setEditingIndex(null);
                  }
                }}
              />
            ) : (
              <span
                onDoubleClick={() => {
                  setEditingIndex(index);
                  setEditText(task.text);
                }}
              >
                {task.text}
              </span>
            )}

            <button onClick={() => deleteTask(index)}>Delete</button>
            <button onClick={() => moveUp(index)}>Up</button>
            <button onClick={() => moveDown(index)}>Down</button>
          </li>
        ))}
      </ul>

      {lastDeleted && <button onClick={undoDelete}>Undo Delete</button>}
      <button onClick={clearCompleted}>Clear Completed</button>
    </>
  );
}
