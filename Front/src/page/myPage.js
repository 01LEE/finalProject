import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/MyPage.css";
import apiAxios from "../lib/apiAxios";
import MypageSidebar from "../components/myPageSideBer";
const Mypage = () => {
    const navigate = useNavigate();

    const [profileImage, setProfileImage] = useState("");
    const [points, setPoints] = useState("");
    const [userName, setUserName] = useState("User");
    const [purchases, setPurchases] = useState(["구매 상품 1", "구매 상품 2", "구매 상품 3"]);
    const [rentals, setRentals] = useState(["렌트카 예약 1", "렌트카 예약 2"]);

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");

        }


        apiAxios.get('/mypage', { withCredentials: true })
            .then((res) => {
                console.log("res.data : ", res.data);
                setPoints(res.data.userInfo.point);
                setUserName(res.data.userInfo.name);
                setProfileImage(`data:image/jpeg;base64,${res.data.userInfo.profileImage}`);

                console.log("res.data.userInfo.point : ", res.data.userInfo.point);
                console.log("res.data.userInfo.name : ", res.data.userInfo.name);
                console.log("res.data.userInfo.profileImage : ", res.data.userInfo.profileImage);
            })
            .catch(error => {
                console.error(error);
            });
    }, [isAuthenticated, navigate]);

    const handlePointCharge = () => {
        navigate('/paymentPage');
    };

    const handelauth = () => {
        apiAxios.post("/checkKakao", {}, { withCredentials: true })
            .then((res) => {
                if (res.data === 'success') {
                    navigate('/mypage/auth?kakao=true');
                }
                else {
                    navigate('/mypage/auth');
                }
            })
    }
    return (
        <div className="mypage-container">
            <MypageSidebar />
            <main className="mypage-content">
                <header className="mypage-header">
                    <div className="profile-info">
                        <img src={profileImage} alt="프로필 이미지" />
                        <div>
                            <h2>{userName}</h2>
                            <span className="more-button" onClick={handelauth}>정보 수정</span>
                        </div>
                    </div>
                </header>

                <section className="section">
                    <h3 className="section-title">보유 포인트</h3>
                    <p>현재 포인트: <span>{points}P</span></p>
                    <button className="button-red" onClick={handlePointCharge}>포인트 충전</button>
                </section>

                <section className="section">
                    <h3 className="section-title">구매 내역</h3>
                    <table className="table-container">
                        <thead>
                            <tr>
                                <th>구매 상품</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchases.map((item, index) => (
                                <tr key={index}><td>{item}</td></tr>
                            ))}
                        </tbody>
                    </table>
                    <span className="more-button">더보기</span>
                </section>

                <section className="section">
                    <h3 className="section-title">렌트카 예약 내역</h3>
                    <table className="table-container">
                        <thead>
                            <tr>
                                <th>렌트카 예약</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rentals.map((item, index) => (
                                <tr key={index}><td>{item}</td></tr>
                            ))}
                        </tbody>
                    </table>
                    <span className="more-button">더보기</span>
                </section>
            </main>
        </div>
    );
};

export default Mypage;
