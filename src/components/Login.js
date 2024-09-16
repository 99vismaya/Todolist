import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Grid2, Snackbar, Alert } from '@mui/material';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ message: "", type: "" });
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

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
        localStorage.setItem('email', formData.email); 
        setNotification({ message: 'Login successful', type: "success" });
        setTimeout(() => navigate('/Todo'), 2000);
        setOpen(true);
      } else {
        setNotification({ message: 'Invalid Credentials', type: "error" });
        setOpen(true);
      }
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Paper elevation={7} style={{ padding: '20px', maxWidth: '400px', margin: 'auto', position: 'relative', top: '100px' }}>
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
          <Typography variant="span" align="center" gutterBottom>
            Don't have an account?  
            <Link to="/Signup"> Signup</Link>
          </Typography>
          <Grid2 item xs={12} style={{ marginTop: 'auto' }}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Login
            </Button>
          </Grid2>
        </Grid2>
      </form>
      
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} 
      >
        <Alert severity={notification.type === "error" ? "error" : "success"}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default Login;
