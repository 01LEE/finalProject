import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/CustomerService.css";

const CustomerService = () => {
  const [selectedMenu, setSelectedMenu] = useState("guide");
  const navigate = useNavigate();

  // ✅ 각 메뉴별 내용 정의
  const menuContent = {
    guide: (
      <div className="content-box">
        <h2>📘 대여 조건</h2>
        <p>※ 임차인은 렌터카를 인도받은 시점부터 반환하는 시점까지 선량한 관리자의 주의의무를 다하여 렌터카를 사용하고 보관해야 합니다.</p>
        <p>※ 실제 운전할 자의 운전면허증을 반드시 지참해야 합니다.</p>
        <p>※ 차량 대여 후 운전자 변경 및 추가 등록은 불가합니다.</p>

        <h3>1. 내국인</h3>
        <p>- 도로교통법상 유효한 한국에서 취득한 자동차 운전면허증 소지자</p>

        <h3>2. 외국인</h3>
        <p>- 도로교통법상 유효하며 한국에서 취득한 자동차 운전면허증 소지자</p>
        <p>※ 주한미군, 국제 면허증 불가 ※</p>

        <h3>3. 나이 및 경력 조건</h3>
        <p>- 만 26세 이상, 2종 보통 이상 운전면허 소지 및 1년 이상 경과</p>

        <h3>4. 차량 인수·반납 가능 시간</h3>
        <h4>🚗 인수 가능 시간</h4>
        <p>- 08:00~22:00 가능 (08:00 이전 & 22:00 이후 인수 불가)</p>

        <h4>🔄 반납 가능 시간</h4>
        <p>- 06:00~20:00 가능 (20:00 이후 반납 불가)</p>

        <h3>5. 대여 불가</h3>
        <p>! 대여 조건 불충족 시 예약금 및 환불 규정 참조</p>
      </div>
    ),
    policy: (
      <div className="content-box">
        <h2>📜 계약 조건</h2>
        <h3>1. 계약서 규정</h3>
        <p>- 계약서에 기재된 운전자만 운전 가능</p>
        <p>- 계약자 외 운전 시 계약 해지 및 환불 불가</p>

        <h3>2. 보험 가입</h3>
        <p>- 대인 한도: 무한, 대물 한도: 2,000만 원, 자손 한도: 1,500만 원</p>
        <p>- 종합보험한도 초과 시 임차인 부담</p>
      </div>
    ),
    insurance: (
      <div className="content-box">
        <h2>💰 예약금 및 취소·환불 규정 안내</h2>
        <h3>1. 예약금 적용</h3>
        <p>- 예약금은 대여료의 10%를 기준으로 적용합니다. (성수기는 당사와 협의)</p>
        <p>- 단, 대여료의 10% 적용 시 10,000원 미만인 경우 최저 예약금은 10,000원으로 적용합니다.</p>

        <h3>2. 취소 및 환불 접수</h3>
        <p>- 당사 근무시간(08:00~19:00)에만 가능합니다.</p>
        <p>- 주말, 공휴일에도 취소 접수는 가능하나, 환불 처리 기간은 은행 영업일 기준 3~4일 정도 소요됩니다.</p>

        <h3>3. 노쇼(No-show) 정책</h3>
        <p>- 예약한 인수 시간 2시간 경과 후에도 인수가 안 될 시, 노쇼로 간주하여 취소되며 환불은 불가합니다.</p>

        <h3>4. 임차 기간 중 조기 반납</h3>
        <p>- 렌터카 사고로 인한 계약 해지 또는 임차인 사정으로 조기 반납 시, 남은 잔여 대여료는 환불되지 않습니다.</p>

        <h3>5. 대여 조건 미달</h3>
        <p>- 대여 조건 미달 또는 대여 불가 항목에 해당하는 경우 인수가 불가하며, 환불이 불가능합니다.</p>

        <h3>◎ 취소 · 환불 기준 안내</h3>
        <ul>
          <li>🚗 <strong>인수일 기준 72시간~24시간 전 취소</strong> → 예약금 제외 후 환불</li>
          <li>⏳ <strong>인수일 기준 24시간 이내 취소</strong> → 전액 환불 불가</li>
        </ul>

        <p>※ 당사는 예약금을 수령한 후, 당사 사정으로 예약을 취소하거나 대여 계약을 체결하지 못할 경우,  
        임차인에게 사유를 설명하고 예약금의 **배액**을 지급합니다.</p>
      </div>
    ),
  };

  return (
    <div className="container">
      {/* ✅ 사이드바 메뉴 */}
      <nav className="sidebar">
        <ul>
          <li
            onClick={() => setSelectedMenu("guide")}
            className={selectedMenu === "guide" ? "menu-item active" : "menu-item"}
          >
            대여 자격 및 안내
          </li>
          <li
            onClick={() => setSelectedMenu("policy")}
            className={selectedMenu === "policy" ? "menu-item active" : "menu-item"}
          >
            계약조건
          </li>
          <li
            onClick={() => setSelectedMenu("insurance")}
            className={selectedMenu === "insurance" ? "menu-item active" : "menu-item"}
          >
            예약금 및 취소·환불 규정
          </li>
          <li onClick={() => navigate("/inquiry")} className="menu-item">
            문의하기
          </li>
        </ul>
      </nav>

      {/* ✅ 선택된 메뉴의 내용 출력 */}
      <div className="main-content">{menuContent[selectedMenu]}</div>
    </div>
  );
};

export default CustomerService;
