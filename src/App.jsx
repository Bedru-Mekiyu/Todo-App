import { useState, useEffect } from "react";

export default function App() {
  // 🧠 1️⃣ Load saved tasks from localStorage when the app starts
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {

    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]); // 👈 empty = only on mount
  

  const addTask = (e) => {
    e.preventDefault();
    const text = newTask.trim();
    if (!text) return;
    setTasks([...tasks, { id: Date.now(), text, completed: false }]);
    setNewTask("");
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    return true;
  });

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Todo List</h1>

      <form onSubmit={addTask}>
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
        />
        <button type="submit">Add</button>
      </form>

      <div style={{ marginTop: 12 }}>
        <button onClick={() => setFilter("all")} disabled={filter === "all"}>
          All
        </button>
        <button
          onClick={() => setFilter("completed")}
          disabled={filter === "completed"}
          style={{ marginLeft: 6 }}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter("pending")}
          disabled={filter === "pending"}
          style={{ marginLeft: 6 }}
        >
          Pending
        </button>
      </div>

      <ul style={{ marginTop: 12 }}>
        {filteredTasks.map((task) => (
          <li key={task.id} style={{ margin: "8px 0" }}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />
            <span
              style={{
                marginLeft: 8,
                textDecoration: task.completed ? "line-through" : "none",
              }}
            >
              {task.text}
            </span>
            <button onClick={() => deleteTask(task.id)} style={{ marginLeft: 12 }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
