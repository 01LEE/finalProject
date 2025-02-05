import Login from '../page/login';
import Logout from '../page/logout';
import SignUp from '../page/signUp';
import UsedCarBoard from '../page/usedCarBoard';
import ForgotId from '../page/forgotId';
import ForgotPw from '../page/forgotPw';
import KakaoCallback from '../components/kakaoCallback';

import PaymentTest from '../components/iamPort';

const routes = [
    { path: '/login', element: <Login /> },
    { path: '/logout', element: <Logout /> },
    { path: '/signUp', element: <SignUp /> },
    { path: '/usedCarBoard', element: <UsedCarBoard /> },
    { path: '/forgotId', element: <ForgotId /> },
    { path: '/forgotPw', element: <ForgotPw /> },
    { path: '/auth/kakao/callback', element: <KakaoCallback /> },
    { path: '/paymentTest', element: <PaymentTest /> },
    
];

export default routes;
