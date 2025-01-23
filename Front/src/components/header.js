import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import UsedCarBoard from '../page/usedCarBoard';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

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
        <header style={styles.header}>
        <div style={styles.logo}></div>
        <nav style={styles.nav}>
            {/* 메뉴 링크 */}
            <Link to="/UsedCarBoard" style={styles.menuItem}>내 차 구매하기</Link>
            <Link to="/menu2" style={styles.menuItem}>menu2</Link>
            <Link to="/menu3" style={styles.menuItem}>menu3</Link>
        </nav>
        <div>
            {/* 인증 상태에 따라 버튼 렌더링 */}
            {isAuthenticated ? (
                <button style={styles.loginButton} onClick={handleLogout}>로그아웃</button>
            ) : (
                <button style={styles.loginButton} onClick={handleLogin}>로그인</button>
            )}
        </div>
    </header>
);
};

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#000',
        padding: '10px 20px',
    },
    logo: {
        width: '50px',
        height: '50px',
        backgroundColor: '#fff',
    },
    nav: {
        display: 'flex',
        gap: '20px',
    },
    menuItem: {
        color: '#fff',
        textDecoration: 'none',
        fontSize: '16px',
    },
    loginButton: {
        backgroundColor: '#000',
        color: '#fff',
        border: '2px solid #fff',
        borderRadius: '20px',
        padding: '5px 20px',
        fontSize: '16px',
        cursor: 'pointer',
    },
};

export default Header;