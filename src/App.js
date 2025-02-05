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

            <Route path="/shopping" element={<Shopping />} />
            <Route path="/shopping/product/:productId" element={<ProductDetail />} />

            {/* ✅ 추가된 페이지 경로 */}
          <Route path="/inquiry" element={<InquiryPage />} />
          <Route path="/inquiry/:postNo" element={<PostDetailPage />} /> {/* ✅ 상세 페이지 경로 추가 */}
          <Route path="/customer-service" element={<CustomerService />} />
          
        
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
