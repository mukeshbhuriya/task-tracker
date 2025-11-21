import React, { useState } from 'react';
import axios from "../axiosConfig";

export default function Register(){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [confirm,setConfirm]=useState('');
  const [msg,setMsg]=useState(null);
  const submit=async(e)=>{
    e.preventDefault();
    try{
      await axios.post('/auth/register',{name,email,password,confirmPassword:confirm});
      setMsg('Registered. Now login.');
    }catch(err){
      setMsg(err.response?.data?.error || 'Error');
    }
  };
  return (
    <div className="card" style={{marginTop:12}}>
      <h3>Register</h3>
      {msg && <div>{msg}</div>}
      <form onSubmit={submit}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="name" />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" type="password" />
        <input value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="confirm password" type="password" />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
