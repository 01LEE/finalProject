import React, { useState } from "react";
import "../css/PaymentPage.css";
import PaymentTest from "../components/iamPort"; // 결제 처리 로직 포함

const PointChargePage = () => {
  const [selectedAmount, setSelectedAmount] = useState(4900);
  const [customerUid, setCustomerUid] = useState(""); // 빌링키 저장

  const chargeOptions = [
    { point: 480, price: 4900 },
    { point: 1425, price: 14000 },
    { point: 2800, price: 27000 },
    { point: 4800, price: 45000 },
    { point: 7200, price: 65000 },
    { point: 13500, price: 119000 },
  ];

  return (
    <div className="charge-container">
      {/* 왼쪽 패널 */}
      <div className="left-panel">
        <h2>포인트 충전하기</h2>
        <div className="charge-info">
          <p>충전 예정</p>
          <span className="charge-preview">+{selectedAmount / 10} Point</span>
        </div>
      </div>

      {/* 오른쪽 패널 */}
      <div className="right-panel">
        <h2 className="title">포인트 결제</h2>

        {/* 결제 금액 선택 */}
        <div className="charge-options">
          {chargeOptions.map((option) => (
            <div
              key={option.price}
              className={`charge-option ${
                selectedAmount === option.price ? "selected" : ""
              }`}
              onClick={() => setSelectedAmount(option.price)}
            >
              <span className="rp">{option.point} 포인트</span>
              <span className="price">{option.price.toLocaleString()} 원</span>
            </div>
          ))}
        </div>

        {/* 결제 수단 (PaymentTest 컴포넌트 삽입) */}
        <div className="payment-methods">
          <div className="tab-container">
            <span className="active-tab">결제</span>
          </div>

          <div className="payment-box">
            <p>빌링키 발급 후 결제 할 수 있습니다.</p>
            <PaymentTest 
              payAmount={selectedAmount} 
              customerUid={customerUid}
              setCustomerUid={setCustomerUid} 
            />
          </div>
        </div>

        {/* 동의 체크박스 */}
        <div className="terms">
          <input type="checkbox" id="agree" />
          <label htmlFor="agree">
            상품 가격 및 유효기간을 확인하였으며, 계약 관련 고지사항에 동의합니다.
          </label>
        </div>
      </div>
    </div>
  );
};

export default PointChargePage;
