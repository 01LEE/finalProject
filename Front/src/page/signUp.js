import React, { useState } from 'react';
import '../css/Signup.css';
import apiAxios from '../lib/apiAxios';
import EmailVerification from '../components/email';

export default function SignUp() {
    const [formData, setFormData] = useState({
        userId: '',
        password: '',
        confirmPassword: '',
        name: '',
        nickname: '',
        email: '',
        verificationCode: '',
    });

    const [userIdMessage, setUserIdMessage] = useState('');
    const [userIdValid, setUserIdValid] = useState(false);

    const [passwordMessage, setPasswordMessage] = useState('');
    const [confirmPasswordMessage, setConfirmPasswordMessage] = useState('');
    const [passwordValid, setPasswordValid] = useState(false);
    const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);

    const [nicknameMessage, setNicknameMessage] = useState('');
    const [nicknameValid, setNicknameValid] = useState(false);

    const [isEmailVerified, setIsEmailVerified] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'userId') validateUserId(value);
        if (name === 'password') {
            validatePassword(value);
            validateConfirmPassword(formData.confirmPassword, value);
        }
        if (name === 'confirmPassword') validateConfirmPassword(value, formData.password);
        if (name === 'nickname') validateNickname(value);
    };

    const validateUserId = (userId) => {
        const userIdRegex = /^[a-z0-9]{5,20}$/;
        if (!userId) {
            setUserIdMessage('아이디를 입력해주세요.');
            setUserIdValid(false);
        } else if (!userIdRegex.test(userId)) {
            setUserIdMessage('아이디는 5~20자의 영문 소문자, 숫자 조합만 사용 가능합니다.');
            setUserIdValid(false);
        } else {
            checkUserIdDuplication(userId);
        }
    };

    const checkUserIdDuplication = (userId) => {
        apiAxios.post('/checkId', { userId })
            .then((res) => {
                if (res.data) {
                    setUserIdMessage('이미 사용 중인 아이디입니다.');
                    setUserIdValid(false);
                } else {
                    setUserIdMessage('사용 가능한 아이디입니다.');
                    setUserIdValid(true);
                }
            })
            .catch(() => {
                setUserIdMessage('네트워크 오류가 발생했습니다.');
                setUserIdValid(false);
            });
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
        if (!passwordRegex.test(password)) {
            setPasswordMessage('비밀번호는 8~16자의 영문 대소문자, 숫자, 특수문자를 포함해야 합니다.');
            setPasswordValid(false);
        } else {
            setPasswordMessage('사용 가능한 비밀번호입니다.');
            setPasswordValid(true);
        }
    };

    const validateConfirmPassword = (confirmPassword, password) => {
        if (!passwordValid) {
            setConfirmPasswordMessage('비밀번호가 유효하지 않습니다.');
            setConfirmPasswordValid(false);
        } else if (confirmPassword !== password) {
            setConfirmPasswordMessage('비밀번호가 일치하지 않습니다.');
            setConfirmPasswordValid(false);
        } else {
            setConfirmPasswordMessage('비밀번호가 일치합니다.');
            setConfirmPasswordValid(true);
        }
    };

    const validateNickname = (nickname) => {
        const nicknameRegex = /^[a-zA-Z가-힣0-9]{3,20}$/;
        if (!nickname) {
            setNicknameMessage('닉네임을 입력해주세요.');
            setNicknameValid(false);
        } else if (!nicknameRegex.test(nickname)) {
            setNicknameMessage('닉네임은 3~20자의 영문, 한글, 숫자 조합만 사용 가능합니다.');
            setNicknameValid(false);
        } else {
            checkNicknameDuplication(nickname);
        }
    };

    const checkNicknameDuplication = (nickname) => {
        apiAxios.post('/checkNickname', { nickname })
            .then((res) => {
                if (res.data) {
                    setNicknameMessage('이미 사용 중인 닉네임입니다.');
                    setNicknameValid(false);
                } else {
                    setNicknameMessage('사용 가능한 닉네임입니다.');
                    setNicknameValid(true);
                }
            })
            .catch(() => {
                setNicknameMessage('네트워크 오류가 발생했습니다.');
                setNicknameValid(false);
            });
    };

    const handleEmailVerified = (isVerified) => {
        setIsEmailVerified(isVerified);
    };

    

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!userIdValid || !passwordValid || !confirmPasswordValid || !nicknameValid || !isEmailVerified) {
            alert('모든 필드를 올바르게 입력하고 이메일 인증을 완료해주세요.');
            return;
        }

        apiAxios.post('/successSignUp', formData)
            .then(() => {
                alert('회원가입이 완료되었습니다.');
                window.location.href = '/login';
            })
            .catch(() => {
                alert('회원가입에 실패했습니다.');
            });
    };

    return (
        <div className="signup-container">
            <h2 className="signup-title">회원가입</h2>
            <form className="signup-form" onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                        type="text"
                        name="userId"
                        placeholder="아이디"
                        value={formData.userId}
                        onChange={handleChange}
                        className="signup-input"
                    />
                    <p className={`input-description ${userIdValid ? 'valid' : 'invalid'}`}>
                        {userIdMessage}
                    </p>
                </div>
                <div className="input-group">
                    <input
                        type="password"
                        name="password"
                        placeholder="비밀번호"
                        value={formData.password}
                        onChange={handleChange}
                        className={`signup-input ${passwordValid ? 'valid' : 'invalid'}`}
                    />
                    <p className={`input-description ${passwordValid ? 'valid' : 'invalid'}`}>
                        {passwordMessage}
                    </p>
                </div>
                <div className="input-group">
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="비밀번호 확인"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`signup-input ${confirmPasswordValid ? 'valid' : 'invalid'}`}
                    />
                    <p className={`input-description ${confirmPasswordValid ? 'valid' : 'invalid'}`}>
                        {confirmPasswordMessage}
                    </p>
                </div>
                <div className="input-group">
                    <input
                        type="text"
                        name="name"
                        placeholder="이름"
                        value={formData.name}
                        onChange={handleChange}
                        className="signup-input"
                    />
                </div>
                <div className="input-group">
                    <input
                        type="text"
                        name="nickname"
                        placeholder="닉네임"
                        value={formData.nickname}
                        onChange={handleChange}
                        className={`signup-input ${nicknameValid ? 'valid' : 'invalid'}`}
                    />
                    <p className={`input-description ${nicknameValid ? 'valid' : 'invalid'}`}>
                        {nicknameMessage}
                    </p>
                </div>
                <div className="input-group">
                <EmailVerification
                formData={formData}
                setFormData={setFormData}
                onEmailVerified={handleEmailVerified}
            />
                </div>
                <button type="submit" className="signup-next-button">
                    완료
                </button>
            </form>
        </div>
    );
}
