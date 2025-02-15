// CarPaymentdetail.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CarPaymentdetail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // CarDetail에서 전달한 state를 구조 분해할당
  const { carDetails } = location.state || {};

  // state가 없을 경우 처리
  if (!carDetails) {
    return (
      <div>
        <p>차량 정보를 불러올 수 없습니다.</p>
        <button onClick={() => navigate(-1)}>뒤로가기</button>
      </div>
    );
  }

  // 결제 진행 버튼 클릭 시 CarPayment.js로 이동
  const handleProceedToPayment = () => {
    navigate('/CarPayment', { state: { carDetails } });
  };

  return (
    <div className="car-payment-detail">
      <h1>차량 상세정보 확인</h1>
      <div className="car-info">
        <p><strong>차량명:</strong> {carDetails.name}</p>
        <p><strong>연식:</strong> {carDetails.year}</p>
        <p><strong>주행거리:</strong> {carDetails.mileage}</p>
        <p><strong>연료:</strong> {carDetails.fuelType}</p>
        {/* 추가 정보 출력 가능 */}
      </div>

      <div className="purchase-cost">
        <h3>총 예상 구매비용</h3>
        <ul>
          <li><strong>차량가:</strong> {carDetails.purchaseDetails.vehiclePrice.toLocaleString()}원</li>
          <li><strong>이전등록비:</strong> {carDetails.purchaseDetails.transferTax.toLocaleString()}원</li>
          <li><strong>관리비용:</strong> {carDetails.purchaseDetails.managementFee.toLocaleString()}원</li>
          <li><strong>등록신청대행수수료:</strong> {carDetails.purchaseDetails.registrationFee.toLocaleString()}원</li>
          <li><strong>K Car Warranty 가입비:</strong> {carDetails.purchaseDetails.warrantyFee.toLocaleString()}원</li>
          <li><strong>성능책임보험료:</strong> {carDetails.purchaseDetails.performanceInsurance.toLocaleString()}원</li>
          <li><strong>배송비:</strong> {carDetails.purchaseDetails.deliveryFee}</li>
        </ul>
        <div className="total-price">합계: {carDetails.totalPrice.toLocaleString()}원</div>
      </div>

      <button onClick={handleProceedToPayment}>
        결제하기
      </button>
    </div>
  );
};

export default CarPaymentdetail;
