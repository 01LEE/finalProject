import Login from '../page/login';
import Logout from '../page/logout';
import SignUp from '../page/signUp';
import UsedCarBoard from '../page/usedCarBoard';
import ForgotId from '../page/forgotId';
import ForgotPw from '../page/forgotPw';
const routes = [
    { path: '/login', element: <Login /> },
    { path: '/logout', element: <Logout /> },
    { path: '/signUp', element: <SignUp /> },
    { path: '/usedCarBoard', element: <UsedCarBoard /> },
    { path: '/forgotId', element: <ForgotId /> },
    { path: '/forgotPw', element: <ForgotPw /> },
];

export default routes;
