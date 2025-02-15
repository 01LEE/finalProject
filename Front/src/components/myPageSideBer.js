import { Link } from "react-router-dom";

import '../css/MyPageSideBer.css';
const MypageSidebar = () => {
    return (
        <aside className="mypage-sidebar">
            <h2>마이페이지</h2>
            <ul>
                <li><Link to="/mp/myCarBuyOrderManage">내차사기 주문관리</Link></li>
                <li><Link to="/mp/MyCarSellAplMgtList">내차팔기 신청관리</Link></li>
                <li><Link to="/mp/RentAplList">렌트 신청내역</Link></li>
                <li><Link to="/mp/myinfo/auth">회원정보 수정</Link></li>
            </ul>
        </aside>
    );
};

export default MypageSidebar;
