import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/authSlice';
import apiAxios from '../lib/apiAxios';
import '../css/Login.css';

export default function Login() {
    const id = useRef(null);
    const pwd = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const loginHandler = () => {
        const userId = id.current.value.trim();
        const userPwd = pwd.current.value.trim();

        if (!userId || !userPwd) {
            alert('아이디와 비밀번호를 모두 입력해주세요.');
            return;
        }

        const data = { id: userId, pwd: userPwd };
        setIsLoading(true); // 로딩 시작

        apiAxios.post('/login', data, { withCredentials: true }) // 쿠키 포함
            .then(() => {
                apiAxios.get('/auth/validate', { withCredentials: true }) // 로그인 상태 확인
                    .then((res) => {
                        dispatch(login(res.data)); // Redux에 사용자 정보 저장
                        navigate('/'); // 홈으로 리디렉션
                    })
                    .catch(() => {
                        alert('로그인 상태 확인에 실패했습니다.');
                    })
                    .finally(() => setIsLoading(false)); // 로딩 종료
            })
            .catch((err) => {
                setIsLoading(false); // 로딩 종료
                if (err.response) {
                    // 서버가 응답한 경우
                    alert(err.response.data.message || '로그인 실패');
                } else {
                    // 서버가 응답하지 않은 경우 (네트워크 오류 등)
                    alert('네트워크 오류가 발생했습니다.');
                }
            });
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>로그인</h2>
                <div className="input-container">
                    <input type="text" ref={id} placeholder="아이디" />
                    <input type="password" ref={pwd} placeholder="비밀번호" />
                </div>
                <label>
                    <input type="checkbox" /> 로그인 상태 유지
                </label>
                <button className="login-button" onClick={loginHandler} disabled={isLoading}>
                    {isLoading ? '로그인 중...' : '로그인'}
                </button>
            </div>
            <div className="login-links">
                <span><a href="#">비밀번호 찾기</a></span> |
                <span><a href="#">아이디 찾기</a></span> |
                <span><a href="#">회원가입</a></span>
            </div>
        </div>
    );
}
