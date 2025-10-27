import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export function TodoListApp() {
  // --- STATES ---
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [deletedStack, setDeletedStack] = useState([]);
  const [selected, setSelected] = useState([]);
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("general");
  const [sortBy, setSortBy] = useState("date");
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  // --- LOCAL STORAGE ---
  useEffect(() => localStorage.setItem("tasks", JSON.stringify(tasks)), [tasks]);
  useEffect(() => setHistory((h) => [...h, tasks]), [tasks]);
  useEffect(() => localStorage.setItem("darkMode", JSON.stringify(darkMode)), [darkMode]);

  // --- NOTIFICATIONS ---
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      tasks.forEach((task) => {
        if (!task.completed && task.dueDate && new Date(task.dueDate) <= now) {
          alert(`Task "${task.text}" is due!`);
        }
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [tasks]);

  // --- HANDLERS ---
  const handleInput = (e) => setNewTask(e.target.value);
  const handleKeyPress = (e) => {
    if (e.key === "Enter") addTask();
    else if (e.key === "Escape") setNewTask("");
  };

  function addTask() {
    const text = newTask.trim();
    if (!text || tasks.some((t) => t.text === text)) return;
    setTasks([...tasks, { id: Date.now() + Math.random(), text, completed: false, priority, category, recurrence: "none", dueDate: null }]);
    setNewTask("");
  }

  function deleteTask(i) {
    setDeletedStack([...deletedStack, tasks[i]]);
    setTasks(tasks.filter((_, idx) => idx !== i));
  }

  const undoDelete = () => {
    if (!deletedStack.length) return;
    const last = deletedStack.pop();
    setTasks([...tasks, last]);
  };

  const fullUndo = () => {
    if (history.length <= 1) return;
    const prev = history[history.length - 2];
    setTasks(prev);
    setHistory(history.slice(0, -1));
  };

  const toggleCompleted = (i) => {
    const updated = tasks.map((t, idx) => (idx === i ? { ...t, completed: !t.completed } : t));
    const task = updated[i];
    if (task.completed && task.recurrence !== "none") updated.push({ ...task, id: Date.now() + Math.random(), completed: false });
    setTasks(updated);
  };

  const editTask = (index, text) => setTasks(tasks.map((t, i) => (i === index ? { ...t, text } : t)));
  const clearCompleted = () => setTasks(tasks.filter((t) => !t.completed));
  const deleteSelected = () => { setTasks(tasks.filter((t) => !selected.includes(t.id))); setSelected([]); };
  const completeSelected = () => { setTasks(tasks.map((t) => selected.includes(t.id) ? { ...t, completed: true } : t)); setSelected([]); };
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(tasks);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setTasks(reordered);
  };

  // --- FILTER & SORT ---
  const filteredTasks = tasks
    .filter((t) => (filter === "active" ? !t.completed : filter === "completed" ? t.completed : true))
    .filter((t) => t.text.toLowerCase().includes(search.toLowerCase()));

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "priority") return { high: 1, medium: 2, low: 3 }[a.priority] - { high: 1, medium: 2, low: 3 }[b.priority];
    if (sortBy === "completed") return a.completed - b.completed;
    return a.id - b.id;
  });

  const remainingCount = tasks.filter((t) => !t.completed).length;

  // --- JSX ---
  return (
    <div className={`${darkMode ? "bg-gray-900 text-gray-200" : "bg-gradient-to-br from-blue-50 to-purple-100 text-gray-900"} h-screen p-6 flex flex-col transition-colors duration-500`}>
      
      {/* Header + Dark Mode Toggle */}
      <div className="flex justify-between items-center mb-4">
        <h1 className={`text-4xl font-extrabold ${darkMode ? "text-yellow-300" : "text-blue-700"}`}>✨ My Todo App</h1>
        <button onClick={() => setDarkMode(!darkMode)} className="px-3 py-1 border rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* Add Task */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input type="text" placeholder="Enter your task..." value={newTask} onChange={handleInput} onKeyDown={handleKeyPress}
          className={`flex-1 border rounded-lg px-3 py-2 outline-none transition-colors duration-300 ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-yellow-400" : "bg-white border-gray-300 focus:ring-blue-400"}`} />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}
          className={`border rounded-lg px-2 py-2 transition-colors duration-300 ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300"}`}>
          <option value="high">🔥 High</option>
          <option value="medium">⚡ Medium</option>
          <option value="low">🌱 Low</option>
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className={`border rounded-lg px-2 py-2 transition-colors duration-300 ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300"}`}>
          <option value="general">📦 General</option>
          <option value="work">💼 Work</option>
          <option value="personal">🏡 Personal</option>
        </select>
        <button onClick={addTask} className={`px-5 py-2 rounded-lg shadow transition-colors duration-300 ${darkMode ? "bg-yellow-500 text-gray-900 hover:bg-yellow-600" : "bg-blue-600 text-white hover:bg-blue-700"}`}>➕ Add</button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
        <input type="text" placeholder="🔍 Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)}
          className={`flex-1 border rounded-lg px-3 py-2 transition-colors duration-300 ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300"}`} />
        <div className="flex gap-2">
          {["all", "active", "completed"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg border transition-colors duration-300 ${filter === f ? (darkMode ? "bg-yellow-500 text-gray-900 border-yellow-500" : "bg-blue-600 text-white border-blue-600") : (darkMode ? "hover:bg-gray-700" : "hover:bg-blue-100")}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Task List (scrollable) */}
      <div className="flex-1 overflow-y-auto mb-24">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                {sortedTasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided) => (
                      <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                        className={`flex items-center gap-2 border rounded-lg p-3 transition-colors duration-300 ${darkMode ? (task.completed ? "bg-gray-700" : "bg-gray-800 hover:bg-gray-700") : (task.completed ? "bg-green-100" : "bg-gray-50 hover:bg-gray-100")}`}>
                        <input type="checkbox" checked={selected.includes(task.id)} onChange={() =>
                          setSelected(sel => sel.includes(task.id) ? sel.filter(id => id !== task.id) : [...sel, task.id])
                        } />
                        <input type="checkbox" checked={task.completed} onChange={() => toggleCompleted(index)} />

                        {editingIndex === index ? (
                          <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)}
                            onBlur={() => { editTask(index, editText); setEditingIndex(null); }}
                            onKeyDown={(e) => { if (e.key === "Enter") { editTask(index, editText); setEditingIndex(null); } else if (e.key === "Escape") { setEditingIndex(null); } }}
                            className={`flex-1 border rounded px-2 py-1 transition-colors duration-300 ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300"}`} />
                        ) : (
                          <span onDoubleClick={() => { setEditingIndex(index); setEditText(task.text); }}
                            className={`flex-1 ml-2 font-medium transition-colors duration-300 ${task.completed ? "line-through text-gray-400" : task.priority === "high" ? "text-red-500" : task.priority === "medium" ? "text-yellow-500" : "text-green-500"}`}>
                            [{task.priority}] [{task.category}] {task.text}
                          </span>
                        )}

                        <button onClick={() => deleteTask(index)} className={`px-2 py-1 rounded-lg transition-colors duration-300 ${darkMode ? "bg-red-600 text-white hover:bg-red-700" : "bg-red-500 text-white hover:bg-red-600"}`}>✖</button>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Bottom Action Bar */}
      <div className="w-full fixed bottom-0 left-0 p-4 bg-white dark:bg-gray-800 shadow-t flex flex-wrap justify-between items-center gap-2 md:flex-nowrap md:px-10">
        {/* Sort Buttons */}
        <div className="flex gap-2 flex-wrap">
          {["date", "priority", "completed"].map((s) => (
            <button key={s} onClick={() => setSortBy(s)}
              className={`px-3 py-1 rounded-lg border transition-colors duration-300 ${sortBy === s ? (darkMode ? "bg-yellow-500 text-gray-900 border-yellow-500" : "bg-purple-600 text-white border-purple-600") : (darkMode ? "hover:bg-gray-700" : "hover:bg-purple-100")}`}>
              Sort by {s}
            </button>
          ))}
        </div>

        {/* Remaining Tasks */}
        <div className="text-center md:text-left px-2">{remainingCount} tasks remaining</div>

        {/* Batch Actions */}
        <div className="flex gap-2 flex-wrap">
          <button onClick={deleteSelected} className={`px-3 py-1 rounded-lg transition-transform transform hover:scale-105 ${darkMode ? "bg-red-600 text-white hover:bg-red-700" : "bg-red-500 text-white hover:bg-red-600"}`}>🗑 Delete Selected</button>
          <button onClick={completeSelected} className={`px-3 py-1 rounded-lg transition-transform transform hover:scale-105 ${darkMode ? "bg-green-600 text-white hover:bg-green-700" : "bg-green-500 text-white hover:bg-green-600"}`}>✅ Complete Selected</button>
        </div>
      </div>

    </div>
  );
}
