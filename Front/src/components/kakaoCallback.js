import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';

import { login } from '../store/authSlice';
import apiAxios from "../lib/apiAxios";

const KakaoCallback = () => {
  const location = useLocation();
  const code = new URLSearchParams(location.search).get("code");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!code) return;

    console.log("code:", code);

    apiAxios.post("/kakaoLogin", { code }, { withCredentials: true })
      .then((res) => {
        console.log("백엔드 응답:", res.data);

        if (res.data.register) {
          localStorage.setItem("isKakaoSignup", "true");
          localStorage.setItem("signupEmail", res.data.email);
          localStorage.setItem("signupNickname", res.data.nickname);
          navigate("/signup?kakao=true");
        } else {
          apiAxios.get('/auth/validate', { withCredentials: true }) // 로그인 상태 확인
            .then((res) => {
              dispatch(login(res.data)); // Redux에 사용자 정보 저장
              console.log(login(res.data));
              navigate('/'); // 홈으로 리디렉션
            })
            .catch(() => {
              alert('로그인 상태 확인에 실패했습니다.');
            });
          handleKakaoLoginSuccess(res);
        }
      })
      .catch((err) => {
        console.error("카카오 로그인 요청 실패:", err);
        alert("카카오 로그인 중 오류가 발생했습니다.");
      });
  }, [code, navigate]);



  const handleKakaoLoginSuccess = (response) => {


    if (response.status === 200) {
      localStorage.removeItem("kakaoAuthCode");
      localStorage.removeItem("isKakaoSignup");
      localStorage.removeItem("signupEmail");
      localStorage.removeItem("signupNickname");

      window.history.replaceState({}, document.title, window.location.pathname);

      navigate("/");
    }
  };

  return <div>로그인 중...</div>;


};

export default KakaoCallback;
