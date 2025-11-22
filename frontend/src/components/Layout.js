import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Layout({ user, onLogout, children }) {
  const location = useLocation();
  const isActive = (path) =>
    location.pathname === path ? "active fw-bold text-primary" : "text-dark";

  return (
    <div className="d-flex">
      <div
        style={{ width: 240, minHeight: "100vh" }}
        className="bg-white border-end"
      >
        <div className="p-3">
          <h4 className="fw-bold mb-3">Task Tracker</h4>
          <ul className="nav flex-column">
            <li className="nav-item mb-1">
              <Link className={`nav-link ${isActive("/tasks")}`} to="/tasks">
                <i className="bi bi-list-task me-2"></i> Tasks
              </Link>
            </li>
            {user?.role === "admin" && (
              <>
                <li className="nav-item mb-1">
                  <Link
                    className={`nav-link ${isActive("/categories")}`}
                    to="/categories"
                  >
                    <i className="bi bi-tags me-2"></i> Categories
                  </Link>
                </li>
                <li className="nav-item mb-1">
                  <Link
                    className={`nav-link ${isActive("/admin")}`}
                    to="/admin"
                  >
                    <i className="bi bi-speedometer2 me-2"></i> Admin
                  </Link>
                </li>
                <li className="nav-item mb-1">
                  <Link
                    className={`nav-link ${isActive("/users")}`}
                    to="/users"
                  >
                    <i className="bi bi-people me-2"></i> Users
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      <div className="flex-grow-1">
        <header className="d-flex justify-content-between align-items-center p-3 border-bottom bg-light">
          <div />
          <div>
            <span className="me-3">
              {user?.name} ({user?.role})
            </span>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        </header>

        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
