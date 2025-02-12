import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children, requiredRole }) {
    const auth = useSelector(state => state.auth);
    console.log("ProtectedRoute auth state:", auth); // 현재 인증 상태 확인

    // user role이 일치하지않으면 나쁜놈으로 간주 다시 리다이렉션 
    if (
      !auth.isAuthenticated || 
      !auth.user || 
      auth.user.role.toLowerCase() !== requiredRole.toLowerCase()
    ) {
        return <Navigate to="/" />;
    }
    
    return children;
}