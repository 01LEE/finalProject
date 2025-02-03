import React, { useState } from 'react';
import apiAxios from '../lib/apiAxios';
import '../css/ForgotPw.css';

export default function ForgotPw() {
    const [userId, setUserId] = useState('');
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState(''); // 비밀번호 에러 상태 추가
    const [step, setStep] = useState(1); // 현재 단계

    const resetState = () => {
        setUserId('');
        setEmail('');
        setVerificationCode('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('');
    };

    const handleVerification = () => {
        apiAxios
            .post('/verifyUser', { userId })
            .then((res) => {
                setEmail(res.data); // 이메일 설정
                setStep(2); // 다음 단계로 이동
                apiAxios.post('/sendVerificationCode', { email: res.data });
            })
            .catch(() => {
                alert('해당 아이디가 존재하지 않습니다.');
            });
    };

    const handleCodeVerification = () => {
        apiAxios
            .post('/verifyCode', { email, verificationCode })
            .then((res) => {
                if (res.data) {
                    setStep(3); // 비밀번호 변경 단계로 이동
                } else {
                    alert('인증번호가 일치하지 않습니다.');
                }
            })
            .catch(() => {
                alert('인증 실패. 다시 시도해주세요.');
            });
    };

    const handleChangePassword = () => {
        // 비밀번호 일치 확인
        if (newPassword !== confirmPassword) {
            setPasswordError('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
            return;
        }

        // API 호출: confirmPassword 확인
        apiAxios
            .post('/confirmPassword', { userId, newPassword })
            .then((res) => {
                console.log('Response: ', res.data);

                if (res.data === 'matched') {
                    console.log('이전 비밀번호와 같습니다.');
                    alert('이전 비밀번호와 같습니다.');
                } else {
                    // 비밀번호 변경 요청
                    apiAxios
                        .post('/successChangePassword', { userId, newPassword })
                        .then(() => {
                            alert('비밀번호 변경이 완료되었습니다.');
                            resetState(); // 상태 초기화
                            window.location.href = '/login'; // 로그인 페이지로 이동
                        })
                        .catch(() => {
                            alert('비밀번호 변경에 실패했습니다.');
                        });
                }
            })
            .catch(() => {
                alert('비밀번호 확인 중 오류가 발생했습니다.');
            });
    };

    return (
        <div className="forgot-container">
            <h2 className="forgot-title">비밀번호 찾기</h2>
            {step === 1 && (
                <div className="forgot-form">
                    <input
                        type="text"
                        className="forgot-input"
                        placeholder="아이디"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    />
                    <p>- 등록된 회원 아이디를 입력해주세요.</p>
                    <button className="forgot-button" onClick={handleVerification}>
                        인증
                    </button>
                </div>
            )}
            {step === 2 && (
                <div className="forgot-form">
                    <p>{email}로 인증번호가 전송되었습니다.</p>
                    <input
                        type="text"
                        className="forgot-input"
                        placeholder="인증번호"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                    />
                    <button className="forgot-button" onClick={handleCodeVerification}>
                        인증번호 확인
                    </button>
                </div>
            )}
            {step === 3 && (
                <div className="forgot-form">
                    <input
                        type="password"
                        className="forgot-input"
                        placeholder="새 비밀번호"
                        value={newPassword}
                        onChange={(e) => {
                            setNewPassword(e.target.value);
                            setPasswordError(''); // 비밀번호 에러 초기화
                        }}
                    />
                    <input
                        type="password"
                        className="forgot-input"
                        placeholder="새 비밀번호 확인"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setPasswordError(''); // 비밀번호 에러 초기화
                        }}
                    />
                    {passwordError && <p className="error-text">{passwordError}</p>} {/* 에러 메시지 출력 */}
                    <button className="forgot-button" onClick={handleChangePassword}>
                        비밀번호 변경
                    </button>
                </div>
            )}
        </div>
    );
}
