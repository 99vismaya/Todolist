import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Grid2 } from '@mui/material';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();

  const validate = (fieldValues = formData) => {
    let tempErrors = { ...errors };

    if ('email' in fieldValues) {
      tempErrors.email = fieldValues.email ? "" : "Email is required";
      if (fieldValues.email)
        tempErrors.email = /^\S+@\S+\.\S+$/.test(fieldValues.email) ? "" : "Enter a valid email address";
    }

    if ('password' in fieldValues) {
      tempErrors.password = fieldValues.password ? "" : "Password is required";
      if (fieldValues.password) {
        const passwordValid = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(fieldValues.password);
        tempErrors.password = passwordValid
          ? ""
          : [
              "Password must be at least 8 characters long",
              "Include at least 1 number",
              "Include at least 1 uppercase letter",
              "Include at least 1 lowercase letter",
              "Include at least 1 special character",
            ];
      }
    }

    if ('confirmPassword' in fieldValues) {
      tempErrors.confirmPassword = fieldValues.confirmPassword ? "" : "Confirm Password is required";
      if (formData.password && fieldValues.confirmPassword) {
        tempErrors.confirmPassword = fieldValues.confirmPassword === formData.password
          ? ""
          : "Passwords do not match";
      }
    }

    setErrors({
      ...tempErrors
    });

    if (fieldValues === formData)
      return Object.values(tempErrors).every(x => x === "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    validate({ [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const storedData = JSON.parse(localStorage.getItem('users')) || [];
      const userExists = storedData.some((user) => user.email === formData.email);

      if (userExists) {
        setNotification({ message: "You have already created an account. Please login.", type: "error" });
        setTimeout(() => setNotification({ message: "", type: "" }), 2000);
        setTimeout(() => navigate('/Login'), 2000);
      } else {
        storedData.push({ email: formData.email, password: formData.password });
        localStorage.setItem('users', JSON.stringify(storedData));
        setAllUsers(storedData);

        setNotification({ message: 'User registered successfully', type: "success" });
        setTimeout(() => setNotification({ message: "", type: "" }), 2000);
        setTimeout(() => navigate('/Login'), 2000);
      }
    } else {
      console.log("Validation failed");
    }
  };

  const displayUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    setAllUsers(storedUsers);
  };

  React.useEffect(() => {
    displayUsers();
  }, []);

  return (
    <Paper elevation={7} style={{ padding: '20px', maxWidth: '400px', margin: 'auto', position:'relative', top:'100px'}}>
      <Typography variant="h4" align="center" gutterBottom>Signup</Typography>
      <form onSubmit={handleSubmit}>
        <Grid2 container spacing={2} direction="column" justifyContent="space-between" style={{ height: '100%' }}>
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
          <Grid2 item xs={12} style={{whiteSpace: "pre-line"}}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={Boolean(errors.password)}
              helperText={
                Array.isArray(errors.password) && errors.password.length > 0 ? (
                  <span style={{ display: "block" }}>
                    {errors.password.map((error, index) => (
                      <span key={index} style={{ display: "flex", alignItems: "center", whiteSpace: "pre-line" }}>
                        <span className="pi pi-times-circle" style={{ fontSize: '.8rem', color: 'red', marginRight: '5px' }}></span>
                        {error}
                      </span>
                    ))}
                  </span>
                ) : (
                  errors.password
                )
              }
              required
            />
          </Grid2>
          <Grid2 item xs={12}>
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword}
              required
            />
          </Grid2>
          <Grid2 item xs={12} style={{ marginTop: 'auto' }}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Signup
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

export default Signup;
