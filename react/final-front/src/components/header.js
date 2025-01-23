import React from "react";
import "../css/Header.css";

export default function Header({ isLoggedIn, user, onLogout }) {
  return (
    <header>
      <div className="logo"></div>
      <nav className="menu">
        <a href="/menu1" className="menu-item">홈</a>
        <a href="/menu2" className="menu-item">중고차</a>
        <a href="/menu3" className="menu-item">렌트</a>
        <a href="/menu4" className="menu-item">쇼핑</a>
        <a href="/menu5" className="menu-item">게시판</a>
      </nav>
      {isLoggedIn ? (
        <div className="user-info">
          <div className="user-details">
            <span className="user-name">{user?.name}</span>
            <span className="user-email">{user?.email}</span>
            <span className="user-points">포인트: {user?.points}P</span>
          </div>
          <button className="logout-button" onClick={onLogout}>
            로그아웃
          </button>
        </div>
      ) : (
        <a href="/login" className="login-button">로그인</a>
      )}
    </header>
  );
}
