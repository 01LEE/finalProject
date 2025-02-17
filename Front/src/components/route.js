import Login from "../page/login";
import Logout from "../page/logout";
import SignUp from "../page/signUp";
import UsedCarBoard from "../page/usedCarBoard";
import ForgotId from "../page/forgotId";
import ForgotPw from "../page/forgotPw";
import KakaoCallback from "../components/kakaoCallback";

import PaymentPage from "../page/PaymentPage";
import Mypage from "../page/myPage";
import EditProfile from "../page/EditProfile";
import MypageAuth from "../page/myPageAuth";

import Shopping from "../page/shopping";
import ProductDetail from "../page/productDetail";
import ShoppingCart from "../page/shopping_cart";
import CarDetail from "../page/CarDetail";
import UpdateCar from "../page/UpdateCar";
import InquiryPage from "../page/InquiryPage";
import PostDetailPage from "../page/PostDetailPage";
import CustomerService from "../page/CustomerService";
import AdminDashboard from "../page/AdminDashboard";
import Home from "../page/home";
import AdminUsedCar from "../page/AdminUsedCar";
import AdminUsedCarAdd from "../page/AdminUsedCarAdd";
import DealerLocationList from "../page/DealerLocationList";
import CarsByLocation from "../page/CarsByLocation";
import CarPayment from "../page/CarPayment";
import CarPaymentdetaile from "../page/CarPaymentdetaile";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/logout", element: <Logout /> },
  { path: "/signUp", element: <SignUp /> },
  { path: "/usedCarBoard", element: <UsedCarBoard /> },
  { path: "/forgotId", element: <ForgotId /> },
  { path: "/forgotPw", element: <ForgotPw /> },
  { path: "/auth/kakao/callback", element: <KakaoCallback /> },
  { path: "/paymentPage", element: <PaymentPage /> },
  { path: "/mypage", element: <Mypage /> },
  { path: "/mypage/editProfile", element: <EditProfile /> },
  { path: "/mypage/auth", element: <MypageAuth /> },

  { path: "/shopping", element: <Shopping /> },
  { path: "/shopping/product/:productId", element: <ProductDetail /> },
  { path: "/shopping/cart", element: <ShoppingCart /> },

  { path: "/used-cars/detail/:vehicleNo", element: <CarDetail /> },
  { path: "/updateCar/:vehicleNo", element: <UpdateCar /> },
  { path: "/inquiry", element: <InquiryPage /> },
  { path: "/postDetail/:postId", element: <PostDetailPage /> },
  { path: "/customer-service", element: <CustomerService /> },
  { path: "/cars/:location", element: <CarsByLocation /> },
  { path: "/directdealerlocation", element: <DealerLocationList /> },
  { path: "/carsByLocation/:location", element: <CarsByLocation /> },
  { path: "/carPayment", element: <CarPayment /> },
  { path: "/carPaymentdetaile", element: <CarPaymentdetaile /> },

  // 관리자 페이지 (ProtectedRoute 적용)
  { path: "/admin/dashboard", element: <AdminDashboard />, protected: true },
  { path: "/admin/used-car-update/:vehicleNo", element: <UpdateCar />, protected: true },
  { path: "/admin/used-car-board", element: <AdminUsedCar />, protected: true },
  { path: "/admin/used-car-add", element: <AdminUsedCarAdd />, protected: true },
];

export default routes;
