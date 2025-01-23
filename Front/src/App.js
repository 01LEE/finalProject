import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from 'react-redux';
import UsedCarBoard from './page/usedCarBoard';

import Header from './components/header'
import Login from './page/login'
import Logout from './page/logout'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Header />  
            <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/usedCarBoard" element={<UsedCarBoard />} />
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
