import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/authSlice';
import apiAxios from '../lib/apiAxios';
import '../css/Login.css'; // CSS 파일을 import

export default function Login() {
    const id = useRef(null);
    const pwd = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loginHandler = () => {
        const data = {
            id: id.current.value,
            pwd: pwd.current.value,
        };

        apiAxios.post('/login', data, { withCredentials: true }) // 쿠키 포함
            .then(() => {
                apiAxios.get('/auth/validate', { withCredentials: true }) // 로그인 상태 확인
                    .then((res) => {
                        dispatch(login(res.data)); // Redux에 사용자 정보 저장
                        console.log(login(res.data));
                        navigate('/'); // 홈으로 리디렉션
                    })
                    .catch(() => {
                        alert('로그인 상태 확인에 실패했습니다.');
                    });
            })
            .catch((err) => {
                if (err.response) {
                    alert(err.response.data); // 서버에서 보낸 오류 메시지
                } else {
                    alert('네트워크 오류가 발생했습니다.');
                }
            });
    };

    return (
        <div className="login-container">

            <main className="login-main">
                <h2 className="login-title">로그인</h2>
                <div className="login-form">
                    <input type="text" ref={id} placeholder="아이디" className="login-input" />
                    <input type="password" ref={pwd} placeholder="비밀번호" className="login-input" />
                    <div className="checkbox-container">
                        <input type="checkbox" id="rememberMe" className="checkbox" />
                        <label htmlFor="rememberMe" className="checkbox-label">로그인 상태 유지</label>
                    </div>
                    <button onClick={loginHandler} className="login-button">로그인</button>
                </div>
                <div className="links">
                    <a href="/forgotPw" className="link">비밀번호 찾기</a>
                    <span className="separator">|</span>
                    <a href="/forgotId" className="link">아이디 찾기</a>
                    <span className="separator">|</span>
                    <a href="/signUp" className="link">회원가입</a>
                </div>
            </main>
            <footer className="login-footer">
                <a href="/terms" className="footer-link">이용약관</a>
                <span className="separator">|</span>
                <a href="/privacy" className="footer-link">개인정보처리방침</a>
                <span className="separator">|</span>
                <a href="/responsibility" className="footer-link">책임의 한계와 법적고지</a>
                <span className="separator">|</span>
                <a href="/support" className="footer-link">회원정보 고객센터</a>
            </footer>
        </div>
    );
}
