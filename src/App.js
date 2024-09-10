import './App.css';
import Signup from './components/Signup';
import Login from './components/Login';
import Todo from './components/Todo';
import './style.css';
import {HashRouter as Router, Routes, Route} from "react-router-dom"


function App() {
  return (
    <Router>
    <>
    <Routes>
    <Route path="/" element={<Signup/>}>
    </Route>
    <Route path="/Login" element = {<Login/>}>
    </Route>
    <Route path="/Todo" element = {<Todo/>}>
    </Route>
    </Routes>
    </>
    </Router>    
  );
}

export default App;
