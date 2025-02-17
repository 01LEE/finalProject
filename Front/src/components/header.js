import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import UsedCarBoard from '../page/usedCarBoard';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Logout from '../page/logout';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const handleLogin = () => {
        navigate('/login'); // 로그인 페이지로 이동
    };


    /*     const handleLogout = () => {
            dispatch(logout()); // Redux에서 로그아웃 액션 실행
            navigate('/'); // 홈으로 이동
        }; */

    const handlePayment = () => {
        navigate('/paymentPage');
    };

    const handleMyPage = () => {
        navigate('/mypage');
    }
    const handleMyPageisKakao = () => {
        navigate('/mypage?kakao=true');
    }


    return (
        <header style={styles.header}>
            <div style={styles.logo}></div>
            <nav style={styles.nav}>
                {/* 메뉴 링크 */}
                <Link to="/UsedCarBoard" style={styles.menuItem}>차량구매</Link>
                <Link to="/shopping" style={styles.menuItem}>자동차 쇼핑몰</Link>
                <Link to="/directdealerlocation" style={styles.menuItem}>전국 직영점</Link>
                <Link to="/shopping/cart" style={styles.menuItem}>장바구니</Link>
                <Link to="/customer-service" style={styles.menuItem}>고객센터</Link> {/* ✅ 수정된 부분 */}
            </nav>
            <div>
                {isAuthenticated && (
                    <button style={styles.loginButton} onClick={handleMyPage}>마이페이지</button>
                )}

                {isAuthenticated ? (
                    <Logout />
                ) : (
                    <button style={styles.loginButton} onClick={handleLogin}>로그인</button>
                )}
            </div>
        </header >
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