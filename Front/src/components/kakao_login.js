import kakaoLogo from '../assets/kakao_logo.png'; // 로고 경로 확인

const KAKAO_REST_API_KEY = "cecb22bd73d34e37cec309f2ae8a4eae";
const REDIRECT_URI = "http://localhost:3000/auth/kakao/callback";

export default function Kakao() {
  const handleKakaoLogin = () => {
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    window.location.href = kakaoAuthURL;
  };

  return (
    <button className="kakao-button" onClick={handleKakaoLogin}>
      <img src={kakaoLogo} alt="Kakao" /> 카카오 로그인
    </button>
  );
}
