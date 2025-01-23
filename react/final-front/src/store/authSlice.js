import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false, // 로그인 상태
    user: {
        name: '',
        email: '',
        points: 0, // 기본 포인트 설정
    },
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.user = {
                ...state.user,
                ...action.payload, // 전달된 사용자 정보 업데이트
            };
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = {
                name: '',
                email: '',
                points: 0, // 초기화
            };
        },
        updatePoints: (state, action) => {
            // 포인트 업데이트 로직
            if (state.isAuthenticated) {
                state.user.points += action.payload;
            }
        },
        updateUser: (state, action) => {
            // 사용자 정보 업데이트 로직
            if (state.isAuthenticated) {
                state.user = {
                    ...state.user,
                    ...action.payload, // 전달된 값으로 사용자 정보 업데이트
                };
            }
        },
    },
});

export const { login, logout, updatePoints, updateUser } = authSlice.actions;
export default authSlice.reducer;
