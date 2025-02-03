import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "../css/Signup.css";
import apiAxios from "../lib/apiAxios";
import EmailVerification from "../components/email";

export default function SignUp() {
    const navigate = useNavigate();
    const location = useLocation();
    const isKakao = new URLSearchParams(location.search).get("kakao") === "true";

    const [formData, setFormData] = useState({
        userId: isKakao ? uuidv4() : "",
        password: isKakao ? uuidv4() : "",
        confirmPassword: isKakao ? uuidv4() : "",
        name: "",
        nickname: "",
        email: "",
        verificationCode: "",
    });

    const [userIdMessage, setUserIdMessage] = useState("");
    const [userIdValid, setUserIdValid] = useState(isKakao);
    const [nicknameMessage, setNicknameMessage] = useState("");
    const [nicknameValid, setNicknameValid] = useState(isKakao);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [userIdChecked, setUserIdChecked] = useState(false); // ✅ 중복 확인 여부

    useEffect(() => {
        if (isKakao) {
            const savedEmail = localStorage.getItem("signupEmail");
            const savedNickname = localStorage.getItem("signupNickname");

            setFormData(prevData => {
                const newFormData = {
                    ...prevData,
                    email: savedEmail || "",
                    nickname: savedNickname || "",
                };

                validateUserId(newFormData.userId);
                validateNickname(newFormData.nickname);

                return newFormData;
            });
        } else {
            localStorage.removeItem("signupEmail");
            localStorage.removeItem("signupNickname");
        }
    }, [isKakao]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));

        if (name === "nickname") validateNickname(value);

        // 아이디를 다시 입력하면 중복 확인 초기화
        if (name === "userId") {
            setUserIdChecked(false);
            setUserIdValid(false);
            setUserIdMessage("");
        }
    };

    const validateUserId = () => {
        const userId = formData.userId;
        const userIdRegex = /^[a-z0-9]{5,20}$/;

        if (!userId) {
            setUserIdMessage("아이디를 입력해주세요.");
            setUserIdValid(false);
            return;
        } else if (!userIdRegex.test(userId)) {
            setUserIdMessage("아이디는 5~20자의 영문 소문자, 숫자 조합만 가능합니다.");
            setUserIdValid(false);
            return;
        }

        checkUserIdDuplication(userId);
    };

    const checkUserIdDuplication = (userId) => {
        apiAxios.post("/checkId", { userId })
            .then((res) => {
                if (res.data) {
                    setUserIdMessage("이미 사용 중인 아이디입니다.");
                    setUserIdValid(false);
                    setUserIdChecked(false);
                } else {
                    setUserIdMessage("사용 가능한 아이디입니다.");
                    setUserIdValid(true);
                    setUserIdChecked(true);
                }
            })
            .catch(() => {
                setUserIdMessage("네트워크 오류가 발생했습니다.");
                setUserIdValid(false);
                setUserIdChecked(false);
            });
    };

    const validateNickname = (nickname) => {
        const nicknameRegex = /^[a-zA-Z가-힣0-9]{3,20}$/;
        if (!nickname) {
            setNicknameMessage("닉네임을 입력해주세요.");
            setNicknameValid(false);
        } else if (!nicknameRegex.test(nickname)) {
            setNicknameMessage("닉네임은 3~20자의 영문, 한글, 숫자 조합만 가능합니다.");
            setNicknameValid(false);
        } else {
            checkNicknameDuplication(nickname);
        }
    };

    const checkNicknameDuplication = (nickname) => {
        apiAxios.post("/checkNickname", { nickname })
            .then((res) => {
                if (res.data) {
                    setNicknameMessage("이미 사용 중인 닉네임입니다.");
                    setNicknameValid(false);
                } else {
                    setNicknameMessage("사용 가능한 닉네임입니다.");
                    setNicknameValid(true);
                }
            })
            .catch(() => {
                setNicknameMessage("네트워크 오류가 발생했습니다.");
                setNicknameValid(false);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if ((!isKakao && !userIdChecked) || !userIdValid || !nicknameValid || !isEmailVerified) {
            console.log("userIdChecked:", userIdChecked, "userIdValid:", userIdValid, "nicknameValid:", nicknameValid, "isEmailVerified:", isEmailVerified);
            alert("모든 필드를 올바르게 입력하고 이메일 인증을 완료해주세요.");
            return;
        }

        apiAxios.post("/successSignUp", formData)
            .then(() => {
                alert("회원가입이 완료되었습니다.");
                navigate("/login");
            })
            .catch(() => {
                alert("회원가입에 실패했습니다.");
            });
    };

    return (
        <div className="signup-container">
            <h2 className="signup-title">회원가입</h2>
            <form className="signup-form" onSubmit={handleSubmit}>
                {!isKakao && (
                    <div className="input-group">
                        <input
                            type="text"
                            name="userId"
                            placeholder="아이디"
                            value={formData.userId}
                            onChange={handleChange}
                            className="signup-input"
                            disabled={userIdChecked} // ✅ 중복 확인 후 수정 불가능하게 설정 (선택 사항)
                        />
                        <button type="button" onClick={validateUserId} disabled={userIdChecked} className="check-button">
                            중복 확인
                        </button>
                        <p className={`input-description ${userIdValid ? "valid" : "invalid"}`}>{userIdMessage}</p>
                    </div>
                )}

                <input
                    type="text"
                    name="nickname"
                    placeholder="닉네임"
                    value={formData.nickname}
                    onChange={handleChange}
                    className="signup-input"
                />
                <p className={`input-description ${nicknameValid ? "valid" : "invalid"}`}>{nicknameMessage}</p>

                {!isKakao && (

                    <div>
                        <EmailVerification formData={formData} setFormData={setFormData} onEmailVerified={setIsEmailVerified} />
                    </div>
                )}


                <button type="submit" className="signup-next-button">완료</button>
            </form>
        </div>
    );
}
