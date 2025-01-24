import React from "react";
import "../css/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <nav className="footer-links">
        <a href="#about" className="footer-link">회사소개</a> | 
        <a href="#recruit" className="footer-link">인재채용</a> | 
        <a href="#policy" className="footer-link">제휴안내</a> | 
        <a href="#terms" className="footer-link">이용약관</a> | 
        <a href="#privacy" className="footer-link">개인정보처리지침</a> | 
        <a href="#support" className="footer-link">고객센터</a>
      </nav>
    </footer>
  );
};

export default Footer;
