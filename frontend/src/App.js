import React, { useState, useEffect } from "react";
import axios from "./axiosConfig";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";
import Admin from "./pages/Admin";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + savedToken;
    }
  }, []);

  useEffect(() => {
    if (token)
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    else delete axios.defaults.headers.common["Authorization"];
  }, [token]);

  if (!token)
    return (
      <div className="container">
        <h1>Task Tracker Lite</h1>
        <div className="card">
          <Login
            onAuth={(t, u) => {
              setToken(t);
              setUser(u);
              localStorage.setItem("token", t);
              localStorage.setItem("user", JSON.stringify(u));
              axios.defaults.headers.common["Authorization"] = "Bearer " + t;
            }}
          />
          <Register />
        </div>
      </div>
    );

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
  };

  return (
    <div className="container">
      <header>
        <h1>Task Tracker Lite</h1>
        <div>
          <strong>{user.name}</strong> ({user.role}) &nbsp;
          <button onClick={logout}>Logout</button>
        </div>
      </header>
      <main>
        {user.role === "admin" && <Admin />}
        <Tasks />
      </main>
    </div>
  );
}

export default App;
