import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";

export default function Users() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await axios.get("/admin/users");
    setUsers(res.data || []);
  };

  const changeRole = async (u, role) => {
    try {
      await axios.patch(`/admin/users/${u.id}`, { role });
      load();
    } catch (e) {
      console.error(e);
    }
  };

  const remove = async (u) => {
    if (!window.confirm("Delete user?")) return;
    try {
      await axios.delete(`/admin/users/${u.id}`);
      load();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="container-fluid">
      <h4>Users</h4>
      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <select
                      className="form-select form-select-sm w-auto d-inline"
                      value={u.role}
                      onChange={(e) => changeRole(u, e.target.value)}
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => remove(u)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
