export default function TaskItem({ task, onToggle, onDelete }) {
    return (
      <li style={{ margin: "8px 0" }}>
        <input type="checkbox" checked={task.completed} onChange={() => onToggle(task.id)} />
        <span style={{ marginLeft: 8, textDecoration: task.completed ? "line-through" : "none" }}>
          {task.text}
        </span>
        <button onClick={() => onDelete(task.id)} style={{ marginLeft: 12 }}>
          Delete
        </button>
      </li>
    );
  }
  