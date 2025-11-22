import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "./axiosConfig";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";
import Categories from "./pages/Categories";
import Users from "./pages/Users";
import Admin from "./pages/Admin";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    const saved = localStorage.getItem("token");
    if (saved)
      axios.defaults.headers.common["Authorization"] = "Bearer " + saved;
  }, []);

  useEffect(() => {
    if (token)
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    else delete axios.defaults.headers.common["Authorization"];
  }, [token]);

  const handleAuth = (t, u) => {
    setToken(t);
    setUser(u);
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u));
    axios.defaults.headers.common["Authorization"] = "Bearer " + t;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
  };

  return (
    <Routes>
      <Route path="/login" element={<Login onAuth={handleAuth} />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={
          <ProtectedRoute token={token}>
            <Layout user={user} onLogout={logout}>
              <Navigate to="/tasks" replace />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks"
        element={
          <ProtectedRoute token={token}>
            <Layout user={user} onLogout={logout}>
              <Tasks />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/categories"
        element={
          <ProtectedRoute token={token} adminOnly userRole={user?.role}>
            <Layout user={user} onLogout={logout}>
              <Categories />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute token={token} adminOnly userRole={user?.role}>
            <Layout user={user} onLogout={logout}>
              <Users />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute token={token} adminOnly userRole={user?.role}>
            <Layout user={user} onLogout={logout}>
              <Admin />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to={token ? "/tasks" : "/login"} replace />}
      />
    </Routes>
  );
}

export default App;
