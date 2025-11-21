import React, { useState } from 'react';
import axios from "../axiosConfig";

export default function Login({ onAuth }){
  const [email,setEmail]=useState('admin@example.com');
  const [password,setPassword]=useState('Admin@123');
  const [err,setErr]=useState(null);
  const submit=async(e)=>{
    e.preventDefault();
    try{
      const res=await axios.post('/auth/login',{email,password});
      onAuth(res.data.token, res.data.user);
    }catch(err){
      setErr(err.response?.data?.error || 'Login failed');
    }
  };
  return (
    <div className="card">
      <h3>Login</h3>
      {err && <div style={{color:'red'}}>{err}</div>}
      <form onSubmit={submit}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" type="password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
