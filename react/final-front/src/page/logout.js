import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import apiAxios from '../lib/apiAxios';

export default function Logout() {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = () => {
        setIsLoading(true); // 로딩 상태 활성화
        apiAxios.post('/logout', {}, { withCredentials: true }) // 쿠키 삭제 요청
            .then(() => {
                dispatch(logout()); // Redux 상태 초기화
                alert('로그아웃되었습니다.');
                window.location.href = '/'; // 홈으로 리디렉션
            })
            .catch(() => {
                alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
            })
            .finally(() => setIsLoading(false)); // 로딩 상태 비활성화
    };

    return (
        <div className="logout-container">
            <button 
                onClick={handleLogout} 
                className="logout-button" 
                disabled={isLoading}
            >
                {isLoading ? '로그아웃 중...' : '로그아웃'}
            </button>
        </div>
    );
}
