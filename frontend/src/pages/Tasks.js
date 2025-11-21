import React, { useState, useEffect } from 'react';
import axios from "../axiosConfig";

export default function Tasks(){
  const [tasks,setTasks]=useState([]);
  const [cats,setCats]=useState([]);
  const [form,setForm]=useState({title:'',description:'',due_date:'',category_id:''});
  const [msg,setMsg]=useState(null);

  useEffect(()=>{ load(); loadCats(); },[]);

  const load=async()=>{ const res=await axios.get('/tasks/my'); setTasks(res.data); };
  const loadCats=async()=>{ const res=await axios.get('/categories'); setCats(res.data); };

  const submit=async(e)=>{ e.preventDefault(); try{ await axios.post('/tasks', form); setMsg('Created'); setForm({title:'',description:'',due_date:'',category_id:''}); load(); }catch(err){ setMsg(err.response?.data?.error || 'Error'); } };

  return (
    <div className="card" style={{marginTop:12}}>
      <h3>Your Tasks</h3>
      <form onSubmit={submit}>
        <input placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
        <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
        <input type="date" value={form.due_date} onChange={e=>setForm({...form,due_date:e.target.value})} />
        <select value={form.category_id} onChange={e=>setForm({...form,category_id:e.target.value})}>
          <option value="">Select category</option>
          {cats.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button type="submit">Create Task</button>
      </form>
      <hr/>
      {msg && <div>{msg}</div>}
      <ul>
        {tasks.map(t=>(
          <li key={t.id}><strong>{t.title}</strong> - {t.status} - due {new Date(t.due_date).toLocaleDateString()}</li>
        ))}
      </ul>
    </div>
  );
}
