import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';

import Header from './components/header'; // 헤더 컴포넌트
import Footer from './components/footer'; // 풋터 컴포넌트
import Login from './page/login'; // 로그인 페이지
import Logout from './page/logout'; // 로그아웃 페이지
import Home from './page/home'; // 홈 페이지
import MyPage from './page/mypage'; // 마이페이지 (로그인 시 표시)

function App() {
  // Redux 상태 가져오기
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  // 디버깅: 현재 상태를 콘솔에 출력
  console.log("isLoggedIn:", isLoggedIn, "user:", user);

  return (
    <div className="App">
      <BrowserRouter>
        {/* 헤더 */}
        <Header isLoggedIn={isLoggedIn} user={user} />

        {/* 메인 컨텐츠 */}
        <main style={{ minHeight: 'calc(100vh - 120px)', padding: '20px' }}>
          <Routes>
            {/* 기본 홈 페이지 */}
            <Route path="/" element={<Home />} />

            {/* 로그인 페이지 */}
            <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/" />} />

            {/* 로그아웃 페이지 */}
            <Route path="/logout" element={<Logout />} />

            {/* 마이페이지 (로그인 상태에서만 표시) */}
            <Route
              path="/mypage"
              element={isLoggedIn ? <MyPage /> : <Navigate to="/login" />}
            />
          </Routes>
        </main>

        {/* 풋터 */}
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
