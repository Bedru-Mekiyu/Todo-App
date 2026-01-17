export default function FilterBar({ filter, setFilter }) {
    return (
      <div style={{ marginTop: 12 }}>
        <button onClick={() => setFilter("all")} disabled={filter === "all"}>All</button>
        <button onClick={() => setFilter("completed")} disabled={filter === "completed"} style={{ marginLeft: 6 }}>Completed</button>
        <button onClick={() => setFilter("pending")} disabled={filter === "pending"} style={{ marginLeft: 6 }}>Pending</button>
      </div>
    );
  }
  