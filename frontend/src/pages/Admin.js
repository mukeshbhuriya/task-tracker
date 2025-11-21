import React, { useState, useEffect } from 'react';
import axios from "../axiosConfig";

export default function Admin(){
  const [tasks,setTasks]=useState([]);
  const [users,setUsers]=useState([]);
  const [filters,setFilters]=useState({user_id:'',status:'',due_date:''});

  useEffect(()=>{ load(); },[]);

  const load=async()=>{ const res=await axios.get('/admin/tasks', { params: filters }); setTasks(res.data); };

  return (
    <div className="card">
      <h3>Admin Dashboard</h3>
      <div>
        <input type="date" value={filters.due_date} onChange={e=>setFilters({...filters,due_date:e.target.value})} />
        <select value={filters.status} onChange={e=>setFilters({...filters,status:e.target.value})}>
          <option value="">All status</option>
          <option value="todo">Todo</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </select>
        <button onClick={load}>Filter</button>
      </div>
      <ul>
        {tasks.map(t=>(
          <li key={t.id}><strong>{t.title}</strong> - {t.status} - due {t.due_date ? new Date(t.due_date).toLocaleDateString() : ''}</li>
        ))}
      </ul>
    </div>
  );
}
