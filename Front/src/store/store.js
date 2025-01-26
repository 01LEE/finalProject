import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Slice에서 만든 리듀서를 import

// Redux Store 생성
const store = configureStore({
    reducer: {
        auth: authReducer, // auth 상태를 관리
    },
});

export default store;
