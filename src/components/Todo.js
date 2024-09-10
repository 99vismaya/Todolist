import React, { useState, useEffect } from "react";
import "primeicons/primeicons.css";

export default function Dashboard() {
  const [style, setStyle] = useState({ display: "none" });
  const [taskName, setTaskName] = useState("");
  const [taskState, setTaskState] = useState("incomplete");
  const [tasks, setTasks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [filter, setFilter] = useState("all");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInEmail = localStorage.getItem('email');
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = storedUsers.find(user => user.email === loggedInEmail);

    if (currentUser) {
      setUser(currentUser);
      setTasks(currentUser.tasks || []);
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

  const handleClick = () => {
    setStyle({ display: "none" });
    setIsEditing(false);
    setTaskName("");
    setTaskState("incomplete");
  };

  const handleAddTask = () => {
    setStyle({ display: "block" });
    setIsEditing(false);
  };

  const handleEditTask = (index) => {
    const task = tasks[index];
    setTaskName(task.name);
    setTaskState(task.state);
    setStyle({ display: "block" });
    setIsEditing(true);
    setCurrentTaskIndex(index);
  };

  const handleDisplayTask = (event) => {
    event.preventDefault();

    if (isEditing) {
      const task = tasks[currentTaskIndex];
      if (taskName === task.name && taskState === task.state) {
        setNotification({ message: "No changes made!", type: "error" });
        setTimeout(() => setNotification({ message: "", type: "" }), 2000);
        return; 
      }
      const updatedTasks = tasks.map((task, index) =>
        index === currentTaskIndex ? { ...task, name: taskName, state: taskState } : task
      );
      setTasks(updatedTasks);
      setNotification({ message: "Task updated successfully!", type: "success" });
      setStyle({ display: "none" }); 
    } else {
      setTasks([...tasks, { name: taskName, state: taskState, createdAt: new Date() }]);
      setNotification({ message: "Task added successfully!", type: "success" });
      setStyle({ display: "none" }); 
    }

    setTimeout(() => setNotification({ message: "", type: "" }), 2000); 
    setTaskName("");
    setTaskState("incomplete");
  };

  const handleDeleteTask = (indexToDelete) => {
    setTasks(tasks.filter((_, index) => index !== indexToDelete));
    setNotification({ message: "Task deleted successfully!", type: "success" });
    setTimeout(() => setNotification({ message: "", type: "" }), 2000); 
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
      <div className="container">
        <p className="title_title__mJ8OQ">TODO List</p>
        <div className="app_app__wrapper__+aeJE">
          <div className="app_appHeader__N7YR4">
            <button
              type="button"
              className="button_button__zbfSX button_button--primary__09xDJ"
              onClick={handleAddTask}
            >
              Add Task
            </button>
            <select
              id="status"
              className="button_button__zbfSX button_button__select__e4SjJ"
              value={filter}
              onChange={handleFilterChange}
            >
              <option value="all">All</option>
              <option value="incomplete">Incomplete</option>
              <option value="complete">Complete</option>
            </select>
            <div className="modal_wrapper__PM20x" style={style}>
              <div
                className="modal_container__A++T7"
                style={{ opacity: "1", transform: "scale(1)" }}
              >
                <span onClick={handleClick} className="close" title="Close Modal">
                  <i className="pi pi-times" style={{"fontSize": "1rem"}}></i>
                </span>
                <form className="modal_form__9A5Bj" onSubmit={handleDisplayTask}>
                  <h1 className="modal_formTitle__dyssK">{isEditing ? "Update TODO" : "Add TODO"}</h1>
                  <label htmlFor="title">
                    Title
                    <input
                      type="text"
                      id="title"
                      value={taskName}
                      onChange={handleTaskName}
                    />
                  </label>
                  <label htmlFor="type">
                    Status
                    <select
                      id="type"
                      value={taskState}
                      onChange={handleTaskState}
                    >
                      <option value="incomplete">Incomplete</option>
                      <option value="complete">Complete</option>
                    </select>
                  </label>
                  <div className="modal_buttonContainer__r9NWb">
                    <button
                      type="submit"
                      className="button_button__zbfSX button_button--primary__09xDJ"
                    >
                      {isEditing ? "Update Task" : "Add Task"}
                    </button>
                    <button
                      type="button"
                      className="button_button__zbfSX button_button--secondary__mWkmM"
                      onClick={handleClick}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div
            className="app_content__wrapper__Mm7EF"
            style={{ opacity: "1", transform: "none" }}
          >
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task, index) => {
                const taskIndex = tasks.findIndex(t => t === task);
                return (
                  <div key={taskIndex} className="todoItem_item__fnR7B" style={{ opacity: "1", transform: "none" }}>
                    <div className="todoItem_todoDetails__zH8Q3">
                        <input
                          style={{ width: "20px", height: "20px" }}
                          type="checkbox"
                          checked={task.state === "complete"}
                          onChange={() => handleCheckboxChange(taskIndex)}
                        />
                      <div className="todoItem_texts__-ozZm">
                        <p
                          className={`todoItem_todoText__j68oh ${
                            task.state === "complete" ? "strikethrough" : ""
                          }`}
                        >
                          {task.name}
                        </p>
                        <p className="todoItem_time__08Ivc">{formatDate(task.createdAt)}</p>
                      </div>
                    </div>
                    <div className="todoItem_todoActions__CuQMN">
                      <div
                        className="todoItem_icon__+DYyU"
                        tabIndex="0"
                        role="button"
                        onClick={() => handleDeleteTask(taskIndex)}
                      >
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth="0"
                          viewBox="0 0 24 24"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path fill="none" d="M0 0h24v24H0z"></path>
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
                        </svg>
                      </div>
                      <div
                        className="todoItem_icon__+DYyU"
                        tabIndex="0"
                        role="button"
                        onClick={() => handleEditTask(taskIndex)}
                      >
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth="0"
                          viewBox="0 0 24 24"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path fill="none" d="M0 0h24v24H0z"></path>
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No todos</p>
            )}
          </div>
        </div>
      </div>
      {notification.message && (
        <div className={`notification ${notification.type === "error" ? "notification-error" : "notification-success"}`}>
          <span style={{ fontSize: '.8rem' }}><span class={notification.type === "error" ? "pi pi-times-circle":"pi pi-check-circle"} style={{ fontSize: '.8rem' }}></span> {notification.message}</span>
        </div>
      )}
    </>
  );
}
