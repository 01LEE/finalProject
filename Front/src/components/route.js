import Login from '../page/login';
import Logout from '../page/logout';
import SignUp from '../page/signUp';
import UsedCarBoard from '../page/usedCarBoard';
import ForgotId from '../page/forgotId';
import ForgotPw from '../page/forgotPw';
import KakaoCallback from '../components/kakaoCallback';

import PaymentPage from '../page/PaymentPage';
import Mypage from '../page/myPage';
import EditProfile from '../page/EditProfile';
import MypageAuth from '../page/myPageAuth';

import Shopping from '../page/shopping';
import ProductDetail from '../page/productDetail';
import ShoppingCart from '../page/shopping_cart';
import CarDetail from '../page/CarDetail';
import UpdateCar from '../page/UpdateCar';
import InquiryPage from '../page/InquiryPage';
import PostDetailPage from '../page/PostDetailPage';
import CustomerService from '../page/CustomerService';
import AdminDashboard from '../page/AdminDashboard';
import Home from '../page/home';
import AdminUsedCar from '../page/AdminUsedCar';
import AdminUsedCarAdd from '../page/AdminUsedCarAdd';
import DealerLocationList from '../page/DealerLocationList';
import CarsByLocation from '../page/CarsByLocation';
import CarPayment from '../page/CarPayment';
import CarPaymentdetaile from '../page/CarPaymentdetaile';

const routes = [
    { path: '/login', element: <Login /> },
    { path: '/logout', element: <Logout /> },
    { path: '/signUp', element: <SignUp /> },
    { path: '/usedCarBoard', element: <UsedCarBoard /> },
    { path: '/forgotId', element: <ForgotId /> },
    { path: '/forgotPw', element: <ForgotPw /> },
    { path: '/auth/kakao/callback', element: <KakaoCallback /> },
    { path: '/paymentPage', element: <PaymentPage /> },
    { path: '/mypage', element: <Mypage /> },
    { path: '/mypage/editProfile', element: <EditProfile /> },
    { path: '/mypage/auth', element: <MypageAuth /> },

    { path: '/shopping/product/:productId', element: <ProductDetail /> },
    { path: '/shopping/cart', element: <ShoppingCart /> },
    { path: '/carDetail', element: <CarDetail /> },
    { path: '/updateCar/:vehicleNo', element: <UpdateCar /> },
    { path: '/inquiry', element: <InquiryPage /> },
    { path: '/postDetail/:postId', element: <PostDetailPage /> },
    { path: '/customer-service', element: <CustomerService /> },
    { path: '/admin', element: <AdminDashboard /> },
    { path: '/adminUsedCar', element: <AdminUsedCar /> },
    { path: '/adminUsedCarAdd', element: <AdminUsedCarAdd /> },
    { path: '/dealerLocationList', element: <DealerLocationList /> },
    { path: '/carsByLocation/:location', element: <CarsByLocation /> },
    { path: '/carPayment', element: <CarPayment /> },
    { path: '/carPaymentdetaile', element: <CarPaymentdetaile /> },
    { path: '/', element: <Home /> },
    { path: '/shopping', element: <Shopping /> },



];

export default routes;
