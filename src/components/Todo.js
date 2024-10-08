import React, { useState, useEffect } from "react";
import { TextField, Paper, Typography, Grid2, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert, Box, Button, FormControl, Select, MenuItem, InputLabel, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import "primeicons/primeicons.css";

export default function Dashboard() {
  const [taskName, setTaskName] = useState("");
  const [taskState, setTaskState] = useState("incomplete");
  const [tasks, setTasks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [filter, setFilter] = useState("all");
  const [user, setUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    const loggedInEmail = localStorage.getItem('email');
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = storedUsers.find(user => user.email === loggedInEmail);

    if (currentUser) {
      setUser(currentUser);
      setTasks(currentUser.tasks || []);
    } else {
    }
  }, []);

  useEffect(() => {
    if (user) {
      const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
      const updatedUsers = storedUsers.map(users => 
        users.email === user.email ? { ...users, tasks } : users
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
  }, [tasks, user]);

  const handleTaskName = (event) => setTaskName(event.target.value);
  const handleTaskState = (event) => setTaskState(event.target.value);
  const handleFilterChange = (event) => setFilter(event.target.value);

  const handleAddTask = () => {
    setOpenModal(true);
    setIsEditing(false);
    setTaskName("");
    setTaskState("incomplete");
  };

  const handleEditTask = (index) => {
    const task = tasks[index];
    setTaskName(task.name);
    setTaskState(task.state);
    setOpenModal(true);
    setIsEditing(true);
    setCurrentTaskIndex(index);
  };

  const handleSaveTask = () => {
    if (isEditing) {
      const task = tasks[currentTaskIndex];
      if (taskName === task.name && taskState === task.state) {
        setNotification({ message: "No changes made!", type: "error" });
        setOpenModal(true); 
        setOpen(true);
        return; 
      }
      const updatedTasks = tasks.map((task, index) =>
        index === currentTaskIndex ? { ...task, name: taskName, state: taskState } : task
      );
      setTasks(updatedTasks);
      setNotification({ message: "Task updated successfully!", type: "success" });
      setOpenModal(false); 
      setOpen(true);
    } else {
      if(taskName===""){
        setNotification({ message: "Give task name", type: "error" });
        setOpenModal(true); 
        setOpen(true);
      }
      else{
        setTasks([...tasks, { name: taskName, state: taskState, createdAt: new Date() }]);
        setNotification({ message: "Task added successfully!", type: "success" });  
        setOpenModal(false);    
        setOpen(true);   
      }
      
    }

  };

  const handleDeleteTask = (indexToDelete) => {
    setTasks(tasks.filter((_, index) => index !== indexToDelete));
    setNotification({ message: "Task deleted successfully!", type: "success" });
    setOpen(true);
  };

  const handleCheckboxChange = (index) => {
    const updatedTasks = tasks.map((task, taskIndex) =>
      taskIndex === index ? { ...task, state: task.state === "complete" ? "incomplete" : "complete" } : task
    );
    setTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    return task.state === filter;
  });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };


  function formatDate(dateVal) {
    const newDate = new Date(dateVal);

    const sMonth = padValue(newDate.getMonth() + 1);
    const sDay = padValue(newDate.getDate());
    const sYear = newDate.getFullYear();
    let sHour = newDate.getHours();
    const sMinute = padValue(newDate.getMinutes());
    let sAMPM = "AM";

    if (sHour >= 12) {
      sAMPM = "PM";
      if (sHour > 12) {
        sHour -= 12;
      } 
    } else if (sHour === 0) {
      sHour = 12;
    }

    sHour = padValue(sHour);

    return `${sHour}:${sMinute} ${sAMPM} ${sMonth}/${sDay}/${sYear}`;
  }

  function padValue(value) {
    return (value < 10) ? "0" + value : value;
  }


  return (
    <>
    <Box sx={{ display: 'flex', alignItems: 'center'}}>
          <Typography variant="h4" sx={{ flexGrow: 1,paddingLeft:"20px",paddingTop:"10px", color:"#585858", fontWeight:"700"}}>TODO LIST</Typography>
          <Box sx={{paddingRight:"20px",paddingTop:"10px"}}> 
          <Button 
            variant="contained"  
            size="large" 
            onClick={() => navigate('/')} 
            sx={{ width: '100px', height: '40px', fontSize:"0.8rem", backgroundColor:"#646ff0",}}
          >
            Logout
          </Button>
          </Box>
        </Box>
      <Paper elevation={0} style={{ padding: '20px', margin: '20px auto', maxWidth: '800px' }}>
        <Box container spacing={2} sx={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
          <Grid2 item xs={6}>
            <Button 
              variant="contained" 
              onClick={handleAddTask} 
              sx={{ width: '100px', height: '40px', fontSize:"0.8rem", backgroundColor:"#646ff0"}}
            >
              Add Task
            </Button>
          </Grid2>
          <Grid2 item xs={6}>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filter}
                onChange={handleFilterChange}
                sx={{backgroundColor:"#cccdde", color:"#585858"}}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="incomplete">Incomplete</MenuItem>
                <MenuItem value="complete">Complete</MenuItem>
              </Select>
            </FormControl>
          </Grid2>
        </Box>

        <Box sx={{ marginTop: '20px', backgroundColor:"#ecedf6", padding: "1rem", borderRadius:"6px"}}>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, index) => (
              <Box key={index} sx={{ display: 'flex', borderRadius:"6px", alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem',marginBottom: "1.5rem", backgroundColor:"White", color:"#585858", "&:last-child":{marginBottom:"0px"}}}>
  <Box sx={{ display: 'flex', alignItems: 'center', gap: "6%", }}>
    <Checkbox
      checked={task.state === "complete"}
      onChange={() => handleCheckboxChange(index)}
      sx={{ width: '20px', height: '20px' }}
    />
    <Box>
      <Typography variant="body1" sx={{ textDecoration: task.state === "complete" ? 'line-through' : 'none' }}>
        {task.name}
      </Typography>
      <Typography variant="caption" sx={{ width: "100px" }} noWrap>{formatDate(task.createdAt)}</Typography>
    </Box>
  </Box>
  <Box sx={{ display: 'flex', alignItems: 'center', gap: "6%" }}>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        marginLeft: '10px',
        height: '30px',
        width: '30px',
        backgroundColor: '#eee',
        borderRadius: '4px',
        color: "#585858"
      }}
      onClick={() => handleDeleteTask(index)}
    >
      <DeleteIcon sx={{ fontSize: '18px' }} /> 
    </Box>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        marginLeft: '10px',
        height: '30px',
        width: '30px',
        backgroundColor: '#eee',
        borderRadius: '4px',
        color: "#585858"
      }}
      onClick={() => handleEditTask(index)}
                  >
                 <EditIcon sx={{ fontSize: '18px' }} /> 
                </Box>
               </Box>
              </Box>

            ))
          ) : (
            <Typography sx={{color:"#585858"}} variant="body1" align="center">No todos</Typography>
          )}
        </Box>
      </Paper>
      <Dialog maxWidth="xl" open={openModal} onClose={() => setOpenModal(false)}>
      <IconButton
            aria-label="close"
            onClick={() => setOpenModal(false)}
            sx={{ position: 'absolute', right: 1, top: "-50px", color: '#9e9e9e', backgroundColor:"white", borderRadius:"4px",'&:hover':{background:"red",color:"white"}}} 
          >
          <CloseIcon />
      </IconButton>
        <DialogTitle sx={{color:"#585858"}}>
          {isEditing ? "Edit Task" : "Add Task"}
        </DialogTitle>
        <DialogContent sx={{display:"flex",flexDirection:"column", alignItems:"flex-start"}}>
          <TextField
            label="Task Name"
            value={taskName}
            onChange={handleTaskName}
            margin="normal"
            sx={{width:"300px"}}
          />
          <FormControl sx={{ m: 1, width:"300px", minWidth: 210, marginTop:"10px", margin:"0px"}}>
            <InputLabel id="demo-multiple-name-label">Task State</InputLabel>
            <Select
              labelId="demo-multiple-name-label"
              fullWidth
              id="demo-multiple-name"
              value={taskState}
              label="Task State"
              onChange={handleTaskState}
            >
              <MenuItem value="incomplete">Incomplete</MenuItem>
              <MenuItem value="complete">Complete</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{justifyContent:"flex-start", padding:"20px 24px"}}>
        <Button
            variant="contained"
            onClick={handleSaveTask}
            sx={{ width: '120px', height: '40px', fontSize:"0.8rem", backgroundColor:"#646ff0"}}
          >
            {isEditing ? "Update Task" : "Add Task"}
          </Button>
          <Button
            variant="contained"
            onClick={() => setOpenModal(false)}
            sx={{ width: '100px', height: '40px', fontSize:"0.8rem", backgroundColor:"#cccdde", color:"#646681"}}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={notification.type === "success" ? "success" : "error"} iconMapping={{
    success: <CheckCircleIcon fontSize="inherit" />,
    error: <CancelIcon fontSize="inherit" />,
  }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}
