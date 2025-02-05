import React, { useState } from 'react';
import '../css/ForgotId.css';
import apiAxios from '../lib/apiAxios';

export default function ForgotId() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [codeMessage, setCodeMessage] = useState('');
    const [idMessage, setIdMessage] = useState('');
    const [emailValid, setEmailValid] = useState(false);
    const [codeValid, setCodeValid] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setCodeMessage('유효하지 않은 이메일 형식입니다.');
            setEmailValid(false);
        } else {
            setCodeMessage('');
            setEmailValid(true);
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        validateEmail(e.target.value);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleCodeChange = (e) => {
        setVerificationCode(e.target.value);
    };

    const handleVerification = () => {
        if (!emailValid) {
            setCodeMessage('유효한 이메일을 입력해주세요.');
            return;
        }

        apiAxios.post('/sendVerificationCode', { email })
            .then(() => {
                setCodeMessage('인증번호가 발송되었습니다.');
                setCodeValid(false);
            })
            .catch(() => {
                setCodeMessage('인증번호 발송에 실패했습니다.');
            });
    };

    const handleFindId = () => {
        if (!verificationCode) {
            setCodeMessage('인증번호를 입력해주세요.');
            return;
        }

        apiAxios.post('/findId', { email, name, verificationCode })
            .then((res) => {
                console.log("res.data : ", res.data);
                setIdMessage(`아이디는 "${res.data}"입니다.`);
            })
            .catch(() => {
                setIdMessage('아이디 찾기에 실패했습니다. 정보를 다시 확인해주세요.');
            });
    };

    return (
        <div className="forgot-container">
            <h2 className="forgot-title">아이디 찾기</h2>
            <div className="forgot-form">
                <input
                    type="text"
                    className={`forgot-input ${emailValid ? 'valid' : 'invalid'}`}
                    placeholder="이메일"
                    value={email}
                    onChange={handleEmailChange}
                />
                <p className={`input-description ${emailValid ? 'valid' : 'invalid'}`}>
                    {codeMessage}
                </p>
                <input
                    type="text"
                    className="forgot-input"
                    placeholder="이름"
                    value={name}
                    onChange={handleNameChange}
                />
                <div className="forgot-notice">
                    <p>- 등록된 이메일, 이름을 입력해주세요.</p>
                    <p>- 등록된 이메일이 아니면 인증이 불가능합니다.</p>
                </div>
                <button className="forgot-button" onClick={handleVerification}>
                    인증
                </button>
                <input
                    type="text"
                    className="forgot-input"
                    placeholder="인증번호"
                    value={verificationCode}
                    onChange={handleCodeChange}
                />
                <button className="forgot-button" onClick={handleFindId}>
                    아이디 찾기
                </button>
                <p className="input-description">{idMessage}</p>
            </div>
        </div>
    );
}
