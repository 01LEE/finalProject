import logo from './logo.svg';
import './App.css';
import Login from './components/login'
import Home from './components/home'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UsedCarBoard from './components/usedCarBoard';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/usedcar-board" element={<UsedCarBoard />} />
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
