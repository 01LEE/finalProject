import React from 'react';
import '../css/Footer.css'; // 풋터 스타일을 위한 CSS 파일

function Footer() {
    return (
        <footer>
            <div className="footer-links">
                <a href="#">회사소개</a>
                <a href="#">인재채용</a>
                <a href="#">제휴안내</a>
                <a href="#">이용약관</a>
                <a href="#">개인정보처리방침</a>
                <a href="#">고객센터</a>
            </div>
            <p>&copy; 2025 My Company. All rights reserved.</p>
        </footer>
    );
}

export default Footer;
