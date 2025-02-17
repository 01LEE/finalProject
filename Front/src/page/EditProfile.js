import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiAxios from "../lib/apiAxios";
import MyPageSidebar from "../components/myPageSideBer";
import "../css/EditProfile.css";

import DaumPostcode from "react-daum-postcode";

const EditProfile = () => {
    const [name, setName] = useState("user");
    const [phone, setPhone] = useState("tel");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [detailAddress, setDetailAddress] = useState("");

    const [imageFiles, setImageFiles] = useState([]);
    const [profileImage, setProfileImage] = useState(null); // 프로필 이미지 상태
    const [previewImage, setPreviewImage] = useState(null); // 이미지 미리보기

    const [isAddressOpen, setIsAddressOpen] = useState(false); // 주소

    const navigate = useNavigate();


    useEffect(() => {
        apiAxios.get("/mypage").then((res) => {
            console.log("res.data : ", res.data);
            setName(res.data.userInfo.name);
            setPhone(res.data.userInfo.phone);
            setAddress(res.data.userInfo.address);
            setDetailAddress(res.data.userInfo.addressDetail);
            const user_Email = res.data.userInfo.email;

            apiAxios.post("/checkKakao", {}, { withCredentials: true })
                .then((res) => {
                    if (res.data === "fail") {
                        setEmail(user_Email);
                    } else {
                        setEmail("카카오 이메일은 보여지지 않습니다.");
                    }
                });

            if (res.data.userInfo.profileImage) {
                const imageUrl = `data:image/jpeg;base64,${res.data.userInfo.profileImage}`;
                setPreviewImage(imageUrl);
                console.log("설정 완료:", imageUrl);
            }
        });
    }, []);

    const openAddressModal = () => {
        setIsAddressOpen(true);
    };

    const handleAddressSelect = (data) => {
        setAddress(data.roadAddress); // 선택한 주소 설정
        setIsAddressOpen(false); // 모달 닫기
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        if (profileImage) {
            formData.append("profileImage", profileImage);
        } else {
            formData.append("profileImage", previewImage.split(",")[1]); 
        }
        formData.append("name", name);
        formData.append("phone", phone);
        formData.append("email", email);
        formData.append("address", address);
        formData.append("addressDetail", detailAddress);


        apiAxios.post("/updateProfile", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }).then(() => {
            alert("회원정보가 수정되었습니다.");
            navigate("/mypage");
        }).catch((err) => {
            console.error("프로필 업데이트 오류:", err);
            alert("회원정보 수정에 실패했습니다.");
        });
    };

    // 프로필 이미지 변경 핸들러
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result); // 미리보기 설정
            };
            reader.readAsDataURL(file);
        }
    };

    const handeldeleteUser = () => {
        apiAxios.post("/deleteUser").then(() => {

        })
    }


    return (
        <div className="mypage-container">
            <MyPageSidebar />
            <main className="mypage-content">
                <h1 className="profile-title">회원정보 수정</h1>
                <p className="info-text">K Car는 고객님의 동의 없이 제3자에게 정보를 제공하지 않습니다.</p>

                <form onSubmit={handleSubmit} className="edit-profile-form">
                    {/* 프로필 이미지 업로드 */}
                    <div className="form-group profile-image-section">
                        <label>프로필 이미지</label>
                        <div className="profile-preview">
                            {previewImage ? (
                                <img src={previewImage} alt="프로필 미리보기" className="profile-image" />
                            ) : (
                                <div className="profile-placeholder">이미지 없음</div>
                            )}
                        </div>
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                    </div>

                    <div className="form-group">
                        <label>닉네임</label>
                        <input type="text" value={name} disabled />
                    </div>

                    <div className="form-group">
                        <label>휴대폰번호</label>
                        <input type="text" value={phone} disabled />
                    </div>

                    <div className="form-group">
                        <label>이메일</label>
                        <input type="text" value={email} disabled />
                    </div>

                    <div className="form-group">
                        <label>주소</label>
                        <div className="address-input-container">
                            <input
                                type="text"
                                value={address}
                                readOnly // 사용자가 직접 입력하지 못하도록 설정
                                className="signup-input"
                            />
                            <input
                                type="text"
                                value={detailAddress}
                                className="signup-input"
                                onChange={(e) => setDetailAddress(e.target.value)}
                            />
                            <button type="button" className="search-button" onClick={openAddressModal}>
                                검색
                            </button>
                        </div>

                        {isAddressOpen && (
                            <div className="address-modal">
                                <DaumPostcode onComplete={handleAddressSelect} autoClose={false} />
                                <button type="button" onClick={() => setIsAddressOpen(false)} className="close-button">
                                    닫기
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="form-group">
                        <button type="button" className="withdraw-button" onClick={handeldeleteUser}>회원탈퇴</button>
                    </div>

                    <div className="button-group">
                        <button type="button" className="cancel-button" onClick={() => navigate("/myPage")}>취소</button>
                        <button type="submit" className="submit-button" onClick={handleSubmit}>정보수정</button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default EditProfile;
