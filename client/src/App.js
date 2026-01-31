import './App.css';
import Dashboard from './Pages/Dashboard';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './Pages/LoginPage';
import Register from './Pages/Register';

function App() {
  return (
   <>
   <Router>
    <Routes>
      <Route path='/' element={<Dashboard/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Register/>}/>
    </Routes>
   </Router>
   </>
  );
}

export default App;
