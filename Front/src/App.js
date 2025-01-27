import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from 'react-redux';
import UsedCarBoard from './page/usedCarBoard';
import CarDetail from './page/CarDetail';
import UpdateCar from './page/UpdateCar';

import Header from './components/header'
import Router from './components/route'
function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Header />  
            <Routes>
            {Router.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
            <Route path="/usedCarBoard" element={<UsedCarBoard />} />
            <Route path="/used-cars/detail/:vehicleNo" element={<CarDetail />} />
            <Route path="/used-cars/UpdateCar/:vehicleNo" element={<UpdateCar />} />
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
