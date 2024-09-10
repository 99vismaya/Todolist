import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Grid2 } from '@mui/material';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ message: "", type: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.email = formData.email ? "" : "Email is required";
    tempErrors.password = formData.password ? "" : "Password is required";
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const storedData = JSON.parse(localStorage.getItem('users')) || [];
      const userFound = storedData.find(
        (user) => user.email === formData.email && user.password === formData.password
      );

      if (userFound) {
        localStorage.setItem('email', formData.email); // Store the email in localStorage
        setNotification({ message: 'Login successful', type: "success" });
        setTimeout(() => setNotification({ message: "", type: "" }), 2000);
        setTimeout(() => navigate('/Todo'), 2000);
      } else {
        setNotification({ message: 'Invalid Credentials', type: "error" });
        setTimeout(() => setNotification({ message: "", type: "" }), 2000);
      }
    }
  };

  return (
    <Paper elevation={7} style={{ padding: '20px', maxWidth: '400px', margin: 'auto', position:'relative', top:'100px'}}>
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid2 container spacing={2} direction="column">
          <Grid2 item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={Boolean(errors.email)}
              helperText={errors.email}
              required
            />
          </Grid2>
          <Grid2 item xs={12}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={Boolean(errors.password)}
              helperText={errors.password}
              required
            />
          </Grid2>
          <Grid2 item xs={12} style={{ marginTop: 'auto' }}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Login
            </Button>
          </Grid2>
        </Grid2>
      </form>
      {notification.message && (
        <div className={`notification ${notification.type === "error" ? "notification-error" : "notification-success"}`}>
          <span style={{ fontSize: '.8rem' }}><span class={notification.type === "error" ? "pi pi-times-circle":"pi pi-check-circle"} style={{ fontSize: '.8rem' }}></span> {notification.message}</span>
        </div>
      )}
    </Paper>
  );
};

export default Login;
