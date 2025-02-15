import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from 'react-redux';
import UsedCarBoard from './page/usedCarBoard';
import CarDetail from './page/CarDetail';
import UpdateCar from './page/UpdateCar';
import Shopping from './page/shopping';
import ProductDetail from './page/productDetail';
import Header from './components/header'
import Router from './components/route'
import InquiryPage from './page/InquiryPage';
import PostDetailPage from './page/PostDetailPage';
import CustomerService from './page/CustomerService';
import AdminDashboard from './page/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './page/home';
import AdminUsedCar from './page/AdminUsedCar';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          {Router.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
