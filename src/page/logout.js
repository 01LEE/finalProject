import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import apiAxios from '../lib/apiAxios';

export default function Logout() {
    const dispatch = useDispatch();

    const handleLogout = () => {
        apiAxios.post('/logout', {}, { withCredentials: true }) // 쿠키 삭제 요청
            .then(() => {
                dispatch(logout()); // Redux 상태 초기화
                alert('로그아웃되었습니다.');
                window.location.href = '/';
            })
            .catch(() => {
                alert('로그아웃에 실패했습니다.');
            });
    };

    return (
        <button onClick={handleLogout}>로그아웃</button>
    );
}
