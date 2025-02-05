import React, { useState } from 'react';
import apiAxios from '../lib/apiAxios';
import '../css/Email.css'; // 이메일 관련 CSS 파일

export default function EmailVerification({ formData, setFormData, onEmailVerified }) {
    const [verificationCode, setVerificationCode] = useState('');
    const [emailMessage, setEmailMessage] = useState('');
    const [codeMessage, setCodeMessage] = useState('');
    const [emailValid, setEmailValid] = useState(false);
    const [codeValid, setCodeValid] = useState(false);

    const handleEmailChange = (e) => {
        const updatedEmail = e.target.value;
        setFormData({ ...formData, email: updatedEmail });
        validateEmail(updatedEmail);
        console.log("email : ", updatedEmail);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 기본 이메일 정규식
        if (!emailRegex.test(email)) {
            setEmailMessage('유효하지 않은 이메일 형식입니다.');
            setEmailValid(false);
        } else {
            setEmailMessage('사용 가능한 이메일입니다.');
            setEmailValid(true);
        }
    };

    const sendVerificationCode = () => {
        if (!emailValid) {
            setEmailMessage('유효한 이메일을 입력해주세요.');
            return;
        }

        apiAxios.post('/sendVerificationCode', { email: formData.email })
            .then(() => {
                setEmailMessage('인증번호가 전송되었습니다.');
            })
            .catch(() => {
                setEmailMessage('인증번호 전송에 실패했습니다.');
            });
    };

    const handleCodeChange = (e) => {
        setVerificationCode(e.target.value);
    };

    const verifyCode = () => {
        apiAxios.post('/verifyCode', { email: formData.email, verificationCode })
            .then((res) => {
                const isValid = res.data.isValid;
                console.log("isValid: ", isValid);

                if (isValid) {
                    setCodeMessage('인증이 완료되었습니다.');
                    setCodeValid(true);
                    onEmailVerified(true); // 부모 컴포넌트에 인증 완료 전달
                } else {
                    setCodeMessage('인증번호가 일치하지 않습니다.');
                    setCodeValid(false);
                }
            })
            .catch((error) => {
                if (error.response) {
                    console.error("Error Response: ", error.response);
                } else {
                    console.error("Network Error: ", error.message);
                }
                setCodeMessage('인증 실패. 다시 시도해주세요.');
            });
    };

    return (
        <div className="email-verification-container">
            <div className="input-group">
                <input
                    type="email"
                    name="email"
                    placeholder="이메일"
                    value={formData.email}
                    onChange={handleEmailChange}
                    className={`email-input ${emailValid ? 'valid' : 'invalid'}`}
                />
                <button
                    type="button"
                    className="send-code-button"
                    onClick={sendVerificationCode}
                >
                    인증번호 전송
                </button>
                <p className={`input-description ${emailValid ? 'valid' : 'invalid'}`}>
                    {emailMessage}
                </p>
            </div>
            <div className="input-group">
                <input
                    type="text"
                    name="verificationCode"
                    placeholder="인증번호"
                    value={verificationCode}
                    onChange={handleCodeChange}
                    className={`verification-input ${codeValid ? 'valid' : 'invalid'}`}
                />
                <button
                    type="button"
                    className="verify-code-button"
                    onClick={verifyCode}
                >
                    인증번호 확인
                </button>
                <p className={`input-description ${codeValid ? 'valid' : 'invalid'}`}>
                    {codeMessage}
                </p>
            </div>
        </div>
    );
}
