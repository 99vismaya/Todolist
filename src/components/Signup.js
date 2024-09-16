import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { TextField, Button, Paper, Typography, Grid2, Snackbar, Alert, Box } from '@mui/material';

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
  const [open, setOpen] = React.useState(false);

  const passwordConditions = [
    { condition: "minLength", label: "Password must be at least 8 characters long" },
    { condition: "uppercase", label: "Include at least 1 uppercase letter" },
    { condition: "lowercase", label: "Include at least 1 lowercase letter" },
    { condition: "number", label: "Include at least 1 number" },
    { condition: "specialChar", label: "Include at least 1 special character" },
  ];

  const checkPasswordValidations = (password) => {
    return {
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*]/.test(password),
    };
  };

  const validate = (fieldValues = formData) => {
    let tempErrors = { ...errors };

    if ('email' in fieldValues) {
      tempErrors.email = fieldValues.email ? "" : "Email is required";
      if (fieldValues.email)
        tempErrors.email = /^\S+@\S+\.\S+$/.test(fieldValues.email) ? "" : "Enter a valid email address";
    }

    if ('password' in fieldValues) {
      const passwordValidations = checkPasswordValidations(fieldValues.password);
      const isPasswordValid = Object.values(passwordValidations).every(v => v);

      tempErrors.password = fieldValues.password ? "" : "Password is required";
      tempErrors.password = isPasswordValid
        ? ""
        : passwordConditions
            .filter(cond => !passwordValidations[cond.condition])
            .map(cond => cond.label);
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
        setOpen(true);
        setTimeout(() => navigate('/'), 2000);
      } else {
        storedData.push({ email: formData.email, password: formData.password });
        localStorage.setItem('users', JSON.stringify(storedData));
        setAllUsers(storedData);

        setNotification({ message: 'User registered successfully', type: "success" });
        setOpen(true);
        setTimeout(() => navigate('/'), 2000);
      }
    } 
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const displayUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    setAllUsers(storedUsers);
  };

  React.useEffect(() => {
    displayUsers();
  }, []);

  return (
    <>
    <Paper elevation={7} style={{ padding: '20px', maxWidth: '400px', margin: 'auto', position: 'relative', top: '100px' }}>
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
          <Grid2 item xs={12} style={{ whiteSpace: "pre-line" }}>
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
                  <Box style={{ display: "block" }}>
                    {passwordConditions.map((condition, index) => {
                      const isValid = checkPasswordValidations(formData.password)[condition.condition];
                      return (
                        <Box key={index} style={{ display: "flex", alignItems: "center" }}>
                          {isValid ? (
                            <CheckCircleIcon style={{ fontSize: '.8rem', color: 'green', marginRight: '5px' }} />
                          ) : (
                            <HighlightOffIcon style={{ fontSize: '.8rem', color: 'red', marginRight: '5px' }} />
                          )}
                          <span style={{ color: isValid ? 'green' : 'red' }}>{condition.label}</span>
                        </Box>
                      );
                    })}
                  </Box>
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
    </>
  );
};

export default Signup;
