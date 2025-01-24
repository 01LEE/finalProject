import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import '../css/header.css'; // CSS 파일 연결

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const handleLogin = () => {
        navigate('/login'); // 로그인 페이지로 이동
    };

    const handleLogout = () => {
        dispatch(logout()); // Redux에서 로그아웃 액션 실행
        navigate('/'); // 홈으로 이동
    };

    return (
        <header className="header">
            <div className="logo"></div>
            <nav className="nav">
                <a href="/home" className="menuItem">HOME</a>
                <a href="#" className="menuItem">중고차</a>
                <a href="#" className="menuItem">렌트카</a>
                <a href="/shopping" className="menuItem">자동차 쇼핑몰</a>
                <a href="#" className="menuItem">고객센터</a>
            </nav>
            <div>
                {isAuthenticated ? (
                    <button className="loginButton" onClick={handleLogout}>로그아웃</button>
                ) : (
                    <button className="loginButton" onClick={handleLogin}>로그인</button>
                )}
            </div>
        </header>
    );
};

export default Header;
