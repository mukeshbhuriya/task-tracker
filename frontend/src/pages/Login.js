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

export default function Login({ onAuth }) {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("Admin@123");
  const [err, setErr] = useState(null);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", { email, password });
      onAuth(res.data.token, res.data.user);
      nav("/tasks");
    } catch (e) {
      setErr(e.response?.data?.error || "Login failed");
    }
  };

  return (
    <Card sx={{ maxWidth: 520, margin: "40px auto", p: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        {err && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {err}
          </Alert>
        )}
        <form onSubmit={submit}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" type="submit">
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
