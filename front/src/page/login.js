import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/authSlice';
import apiAxios from '../lib/apiAxios';

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
                        navigate('/'); // 홈으로 리디렉션
                    })
                    .catch(() => {
                        alert('로그인 상태 확인에 실패했습니다.');
                    });
            })
            .catch((err) => {
                if (err.response) {
                    // 서버가 응답한 경우
                    alert(err.response.data); // 서버에서 보낸 오류 메시지
                } else {
                    // 서버가 응답하지 않은 경우 (네트워크 오류 등)
                    alert('네트워크 오류가 발생했습니다.');
                }
            });
    };

    return (
        <div>
            <h2>로그인</h2>
            <input type="text" ref={id} placeholder="아이디" />
            <input type="password" ref={pwd} placeholder="비밀번호" />
            <button onClick={loginHandler}>로그인</button>
        </div>
    );
}
