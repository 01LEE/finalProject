// AdminDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleUsedCarManagement = () => {
    // 버튼 클릭 시 /admin/used-car-board 경로로 이동합니다.
    navigate('/admin/used-car-board');
  };

  return (
    <div>
      <h1>관리자 대시보드</h1>
      <p>여기는 관리자 전용 페이지입니다.</p>
      <button onClick={handleUsedCarManagement}>
        중고차 게시판 관리
      </button>
    </div>
  );
}
