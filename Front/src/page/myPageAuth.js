import { use, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/AuthPage.css";



import MypageSidebar from "../components/myPageSideBer";
import apiAxios from "../lib/apiAxios";
const AuthPage = () => {

    const location = useLocation();
    const isKakao = new URLSearchParams(location.search).get("kakao") === "true";

    const [password, setPassword] = useState("");
    const navigate = useNavigate();


useEffect(() => {
    if (isKakao) {
        navigate("/mypage/editProfile");
    }
}, [isKakao, navigate]);


    const handleSubmit = (e) => {
        e.preventDefault();

        apiAxios.post("/auth", { password })
            .then((res) => {
                console.log(res.data);
                if (res.data) {
                    navigate("/mypage/editProfile");
                }
            })
    }



    return (
        <div className="mypage-container">
            <MypageSidebar /> {/* 사이드바 추가 */}

            <div className="auth-content">
                <h1>회원정보 수정</h1>
                <p className="auth-description">
                    회원님의 소중한 정보 보호를 위해 현재 비밀번호를 확인해 주세요.
                </p>

                <form onSubmit={handleSubmit} className="auth-form">


                    <label>비밀번호</label>
                    <input
                        type="password"
                        placeholder="비밀번호 입력"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit" className="auth-button">확인</button>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;
