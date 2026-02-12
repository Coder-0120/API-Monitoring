import './App.css';
import Dashboard from './Pages/Dashboard';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './Pages/LoginPage';
import Register from './Pages/Register';
import { Navigate } from 'react-router-dom';


const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("userInfo"); 
  return isLoggedIn ? children : <Navigate to="/home" />;
};

function App() {
  return (
   <>
   <Router>
    <Routes>
      <Route path='/' element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
   </Router>
   </>
  );
}

export default App;
