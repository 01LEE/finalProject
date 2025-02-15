import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // 기본적으로 localStorage를 사용합니다.
import authReducer from './authSlice'; // authSlice에서 만든 리듀서를 import

// Redux Persist 설정
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // 'auth' 리듀서만 지속성 유지
};

// 루트 리듀서 생성
const rootReducer = combineReducers({
  auth: authReducer,
});

// 지속 가능한 리듀서 생성
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Redux Store 생성
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;