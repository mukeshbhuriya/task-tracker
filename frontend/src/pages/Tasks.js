import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Modal, Button } from "react-bootstrap";

const COLUMNS = [
  { id: "todo", title: "To Do" },
  { id: "doing", title: "Doing" },
  { id: "done", title: "Done" },
];

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [cats, setCats] = useState([]);
  const [view, setView] = useState("kanban");
  const [msg, setMsg] = useState(null);
  const [editingStatusId, setEditingStatusId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    due_date: "",
    category_id: "",
  });

  const [editTask, setEditTask] = useState(null);

  const openEdit = (task) => setEditTask(task);

  const closeEdit = () => setEditTask(null);

  const saveEdit = async () => {
    try {
      const payload = {
        title: editTask.title,
        description: editTask.description,
        due_date: editTask.due_date,
        category_id: editTask.category_id,
      };

      await axios.put(`/tasks/${editTask.id}`, payload);

      closeEdit();
      loadTasks();
    } catch (err) {
      alert(err.response?.data?.error || "Update failed");
    }
  };

  const updateStatus = async (taskId, newStatus) => {
    try {
      await axios.patch(`/tasks/${taskId}/status`, { status: newStatus });
      setEditingStatusId(null);
      loadTasks();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update");
      setEditingStatusId(null);
    }
  };

  const now = new Date();

  useEffect(() => {
    loadTasks();
    loadCategories();
  }, []);

  const loadTasks = async () => {
    const res = await axios.get("/tasks/my");
    setTasks(res.data || []);
  };

  const loadCategories = async () => {
    const res = await axios.get("/categories");
    setCats(res.data || []);
  };

  // -------------------- CREATE NEW TASK --------------------
  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/tasks", form);
      setForm({ title: "", description: "", due_date: "", category_id: "" });
      setMsg("Task Created");
      loadTasks();
    } catch (err) {
      setMsg(err.response?.data?.error || "Error");
    }
  };

  // -------------------- DRAG AND DROP --------------------
  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;

    const task = tasks.find((t) => t.id == taskId);

    // prevent status change after due date
    if (new Date(task.due_date) < now) {
      alert("You cannot change the status after the due date!");
      return;
    }

    // Optimistic UI
    setTasks((prev) =>
      prev.map((t) => (t.id == taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await axios.patch(`/tasks/${taskId}/status`, { status: newStatus });
      loadTasks();
    } catch (err) {
      loadTasks(); // rollback
    }
  };

  // -------------------- GROUPING --------------------
  const grouped = COLUMNS.reduce((res, col) => {
    res[col.id] = tasks.filter((t) => t.status === col.id);
    return res;
  }, {});

  const isOverdue = (due) => new Date(due) < now;

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>My Tasks</h4>
        <div>
          <button
            className={`btn btn-sm btn-outline-primary me-2 ${
              view === "kanban" ? "active" : ""
            }`}
            onClick={() => setView("kanban")}
          >
            Kanban
          </button>
          <button
            className={`btn btn-sm btn-outline-secondary ${
              view === "list" ? "active" : ""
            }`}
            onClick={() => setView("list")}
          >
            List
          </button>
        </div>
      </div>

      <div className="row">
        {/* MAIN VIEW */}
        <div className="col-lg-9">
          {view === "list" ? (
            <div className="list-group">
              {tasks.map((t) => (
                <div
                  key={t.id}
                  className={`list-group-item mb-2 shadow-sm ${
                    isOverdue(t.due_date) ? "border-danger" : ""
                  }`}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    {/* LEFT SIDE (Title + description) */}
                    <div
                      className="flex-grow-1"
                      style={{ cursor: "pointer" }}
                      onClick={() => openEdit(t)}
                    >
                      <strong>{t.title}</strong>
                      <div className="small text-muted">{t.description}</div>
                      <div className="small">
                        Category:{" "}
                        {cats.find((c) => c.id == t.category_id)?.name || "—"}
                      </div>
                    </div>

                    {/* RIGHT SIDE (Status + Due date + Edit button) */}
                    <div className="text-end ms-3">
                      {/* STATUS INLINE DROPDOWN */}
                      {editingStatusId === t.id ? (
                        <select
                          className="form-select form-select-sm"
                          value={t.status}
                          onChange={(e) => updateStatus(t.id, e.target.value)}
                          onBlur={() => setEditingStatusId(null)}
                          autoFocus
                        >
                          <option value="todo">Todo</option>
                          <option value="doing">Doing</option>
                          <option value="done">Done</option>
                        </select>
                      ) : (
                        <span
                          className={
                            "badge me-2 " +
                            (t.status === "done"
                              ? "bg-success"
                              : t.status === "doing"
                              ? "bg-primary"
                              : "bg-secondary")
                          }
                          style={{ cursor: "pointer" }}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent modal open
                            if (new Date(t.due_date) < new Date()) {
                              alert("Cannot change status after due date!");
                              return;
                            }
                            setEditingStatusId(t.id);
                          }}
                        >
                          {t.status}
                        </span>
                      )}

                      {/* DUE DATE */}
                      <div
                        className={`small ${
                          isOverdue(t.due_date) ? "text-danger fw-bold" : ""
                        }`}
                      >
                        {new Date(t.due_date).toLocaleDateString()}
                      </div>

                      {/* EDIT BUTTON (opens modal safely) */}
                      <button
                        className="btn btn-sm btn-outline-secondary mt-2"
                        onClick={() => openEdit(t)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // ----------- KANBAN BOARD -----------
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="d-flex gap-3">
                {COLUMNS.map((col) => (
                  <div key={col.id} className="flex-fill">
                    <h6>{col.title}</h6>
                    <Droppable droppableId={col.id}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{
                            minHeight: 300,
                            background: "#f8f9fa",
                            padding: "8px",
                          }}
                        >
                          {grouped[col.id].map((task, index) => (
                            <Draggable
                              draggableId={String(task.id)}
                              index={index}
                              key={task.id}
                              isDragDisabled={isOverdue(task.due_date)} // LOCK
                            >
                              {(prov) => (
                                <div
                                  ref={prov.innerRef}
                                  {...prov.draggableProps}
                                  {...prov.dragHandleProps}
                                  className={`card mb-2 shadow-sm ${
                                    isOverdue(task.due_date)
                                      ? "border-danger"
                                      : ""
                                  }`}
                                >
                                  <div
                                    className="card-body"
                                    onClick={() => openEdit(task)}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <strong>{task.title}</strong>
                                    <div className="small text-muted">
                                      {task.description}
                                    </div>
                                    <div className="small">
                                      Category:{" "}
                                      {
                                        cats.find(
                                          (c) => c.id == task.category_id
                                        )?.name
                                      }
                                    </div>

                                    <div
                                      className={`small mt-1 ${
                                        isOverdue(task.due_date)
                                          ? "text-danger fw-bold"
                                          : ""
                                      }`}
                                    >
                                      {new Date(
                                        task.due_date
                                      ).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}

                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </DragDropContext>
          )}
        </div>

        {/* CREATE FORM */}
        <div className="col-lg-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5>Create Task</h5>

              {msg && <div className="alert alert-info">{msg}</div>}

              <form onSubmit={submit}>
                <input
                  className="form-control mb-2"
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />

                <input
                  type="date"
                  className="form-control mb-2"
                  value={form.due_date}
                  onChange={(e) =>
                    setForm({ ...form, due_date: e.target.value })
                  }
                  required
                />

                <textarea
                  className="form-control mb-2"
                  placeholder="Description"
                  rows="3"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                ></textarea>

                <select
                  className="form-select mb-3"
                  value={form.category_id}
                  onChange={(e) =>
                    setForm({ ...form, category_id: e.target.value })
                  }
                  required
                >
                  <option value="">Select category</option>
                  {cats.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <button className="btn btn-primary w-100">Create Task</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT TASK MODAL */}
      <Modal show={editTask !== null} onHide={closeEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {editTask && (
            <>
              <div className="mb-2">
                <label className="form-label">Title</label>
                <input
                  className="form-control"
                  value={editTask.title}
                  onChange={(e) =>
                    setEditTask({ ...editTask, title: e.target.value })
                  }
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={editTask.description}
                  onChange={(e) =>
                    setEditTask({ ...editTask, description: e.target.value })
                  }
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={editTask.due_date?.substring(0, 10)}
                  onChange={(e) =>
                    setEditTask({ ...editTask, due_date: e.target.value })
                  }
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={editTask.category_id}
                  onChange={(e) =>
                    setEditTask({ ...editTask, category_id: e.target.value })
                  }
                >
                  <option value="">Select</option>
                  {cats.map((c) => (
                    <option value={c.id} key={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeEdit}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
