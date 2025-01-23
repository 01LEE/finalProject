import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from 'react-redux';

import Footer from './components/footer';
import Header from './components/header'
import Login from './page/login'
import Logout from './page/logout'
import Shopping from './page/shopping';
import Home from './page/home';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} /> {/* 홈 페이지 경로 */}
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/shopping" element={<Shopping />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
