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
import AdminUsedCarAdd from './page/AdminUsedCarAdd';
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
            <Route  path="/admin/dashboard" 
                    element={ <ProtectedRoute requiredRole="admin">  <AdminDashboard />  </ProtectedRoute>   } />
            <Route path="/admin/used-car-update/:vehicleNo" element={<UpdateCar />} />
            <Route path="/admin/used-car-board" element={<AdminUsedCar />} />
            <Route path="/shopping" element={<Shopping />} />
            <Route path="/shopping/product/:productId" element={<ProductDetail />} />
            <Route path="/" element={<Home />} />  {/* 기본 경로 추가 */}
            {/* ✅ 추가된 페이지 경로 */}
          <Route path="/inquiry" element={<InquiryPage />} />
          <Route path="/inquiry/:postNo" element={<PostDetailPage />} /> {/* ✅ 상세 페이지 경로 추가 */}
          <Route path="/customer-service" element={<CustomerService />} />
          <Route path="/admin/used-car-add" element={<AdminUsedCarAdd />} />
        
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
