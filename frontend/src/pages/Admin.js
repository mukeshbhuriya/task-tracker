import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Admin() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const [filters, setFilters] = useState({
    user_id: "all",
    status: "all",
    due_date: "",
  });

  const [stats, setStats] = useState({
    todo: 0,
    doing: 0,
    done: 0,
  });

  useEffect(() => {
    loadUsers();
    loadTasks();
  }, []);

  // ---------------- LOAD ALL USERS ----------------
  const loadUsers = async () => {
    try {
      const res = await axios.get("/admin/list-users");
      setUsers(res.data || []);
    } catch (e) {
      console.error("User load error:", e);
    }
  };

  // ---------------- LOAD FILTERED TASKS ----------------
  const loadTasks = async () => {
    try {
      const res = await axios.get("/admin/tasks", { params: filters });
      const data = res.data || [];
      setTasks(data);

      // compute stats
      const s = { todo: 0, doing: 0, done: 0 };
      data.forEach((task) => {
        if (task.status && s[task.status] !== undefined) {
          s[task.status]++;
        }
      });
      setStats(s);
    } catch (e) {
      console.error("Admin tasks load error:", e);
    }
  };

  const pieData = {
    labels: ["Todo", "Doing", "Done"],
    datasets: [
      {
        data: [stats.todo, stats.doing, stats.done],
        backgroundColor: ["#6c757d", "#0d6efd", "#198754"],
      },
    ],
  };

  const updateFilter = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => loadTasks();

  const clearFilters = () => {
    setFilters({ user_id: "all", status: "all", due_date: "" });
    loadTasks();
  };

  return (
    <div className="container-fluid">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Admin Dashboard</h3>
        <div className="text-muted">Full visibility into all tasks</div>
      </div>

      {/* -------- FILTER BAR -------- */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            {/* User filter */}
            <div className="col-md-4">
              <label className="form-label fw-bold">Filter by User</label>
              <select
                className="form-select"
                value={filters.user_id}
                onChange={(e) => updateFilter("user_id", e.target.value)}
              >
                <option value="all">All Users</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Status filter */}
            <div className="col-md-4">
              <label className="form-label fw-bold">Status</label>
              <select
                className="form-select"
                value={filters.status}
                onChange={(e) => updateFilter("status", e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="todo">Todo</option>
                <option value="doing">Doing</option>
                <option value="done">Done</option>
              </select>
            </div>

            {/* Due date */}
            <div className="col-md-4">
              <label className="form-label fw-bold">Due Date</label>
              <input
                type="date"
                className="form-control"
                value={filters.due_date}
                onChange={(e) => updateFilter("due_date", e.target.value)}
              />
            </div>

            {/* Buttons */}
            <div className="col-md-12 d-flex gap-2 mt-2">
              <button className="btn btn-primary" onClick={applyFilters}>
                Apply Filters
              </button>
              <button className="btn btn-secondary" onClick={clearFilters}>
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* -------- STATS CARDS -------- */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm text-center p-3">
            <h6>To Do</h6>
            <div className="display-6">{stats.todo}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm text-center p-3">
            <h6>Doing</h6>
            <div className="display-6">{stats.doing}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm text-center p-3">
            <h6>Done</h6>
            <div className="display-6">{stats.done}</div>
          </div>
        </div>
      </div>

      {/* -------- CHART + TASK TABLE -------- */}
      <div className="row">
        {/* Pie chart */}
        <div className="col-md-5">
          <div className="card shadow-sm p-3 mb-4">
            <h5>Task Overview</h5>
            <Pie data={pieData} />
          </div>
        </div>

        {/* Task list */}
        <div className="col-md-7">
          <div className="card shadow-sm p-3 mb-4">
            <h5>All Tasks</h5>

            <table className="table table-hover mt-3">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>User</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <strong>{task.title}</strong>
                    </td>
                    <td>{task.User ? task.User.name : "—"}</td>
                    <td>
                      {task.due_date
                        ? new Date(task.due_date).toLocaleDateString()
                        : "—"}
                    </td>
                    <td>
                      <span
                        className={
                          "badge " +
                          (task.status === "done"
                            ? "bg-success"
                            : task.status === "doing"
                            ? "bg-primary"
                            : "bg-secondary")
                        }
                      >
                        {task.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {tasks.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-3 text-muted">
                      No tasks found for selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
