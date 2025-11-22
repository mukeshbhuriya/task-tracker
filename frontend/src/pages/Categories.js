import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";

export default function Categories() {
  const [cats, setCats] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await axios.get("/categories");
    setCats(res.data || []);
  };

  const openCreate = () => {
    setEditing(null);
    setName("");
    setModalOpen(true);
  };
  const openEdit = (c) => {
    setEditing(c);
    setName(c.name);
    setModalOpen(true);
  };

  const save = async () => {
    try {
      if (editing) await axios.put(`/categories/${editing.id}`, { name });
      else await axios.post("/categories", { name });
      setModalOpen(false);
      load();
    } catch (e) {
      console.error(e);
    }
  };

  const remove = async (c) => {
    if (!window.confirm("Delete category?")) return;
    try {
      await axios.delete(`/categories/${c.id}`);
      load();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Categories</h4>
        <button className="btn btn-primary" onClick={openCreate}>
          New Category
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cats.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => openEdit(c)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => remove(c)}
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

      {/* simple modal using native confirm/prompt style for portability */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div
            className="modal-dialog modal-sm"
            style={{ margin: "6rem auto" }}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editing ? "Edit" : "New"} Category
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setModalOpen(false)}
                />
              </div>
              <div className="modal-body">
                <input
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={save}>
                  {editing ? "Save" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
