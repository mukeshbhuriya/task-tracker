import React, { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
} from "@mui/material";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState(null);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/register", {
        name,
        email,
        password,
        confirmPassword: confirm,
      });
      setMsg("Registered. Please login.");
      nav("/login");
    } catch (err) {
      setMsg(err.response?.data?.error || "Error");
    }
  };
  return (
    <Card sx={{ maxWidth: 520, margin: "20px auto" }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Register
        </Typography>
        {msg && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {msg}
          </Alert>
        )}
        <form onSubmit={submit}>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" type="submit">
            Register
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
