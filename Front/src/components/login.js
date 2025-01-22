import React, { use, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiAxios from '../lib/apiAxios';

export default function Login() {
    const id = useRef(null);
    const pwd = useRef(null);
    const navigate = useNavigate();
    const loginHandler = () => {
        console.log(id.current.value, pwd.current.value);
        const data = {
            id: id.current.value,
            pwd: pwd.current.value
        }
        apiAxios.post('/login', data)
            .then(res => {
                console.log(res.data);

                // 토큰이 생성되었는지 확인
                if (res.data.token) {
                    // Home으로 리디렉션
                    navigate('/home');
                } else {
                    alert('로그인에 실패했습니다.'); // 실패 메시지 처리
                }
            })
            .catch(err => {
                console.error(err);
                alert('오류가 발생했습니다.');
            });
    };
    return (

        <div className="login-container">
            <h2>로그인</h2>
            <p>이곳은 로그인 페이지입니다.</p>
            <div className="login-form">
                <input type="text" ref={id} placeholder="아이디" />
                <input type="password" ref={pwd} placeholder="비밀번호" />
                <button type="button" onClick={loginHandler}>로그인</button>
            </div>
        </div>

    );

}