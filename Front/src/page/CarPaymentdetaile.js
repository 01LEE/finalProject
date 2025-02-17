import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const DEFAULT_IMAGE_URL = "/images/usedcar_imageX.png";

const CarPaymentdetail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 항상 최상단에서 Hooks 호출
  const [buyerInfo, setBuyerInfo] = useState(null);
  const [loadingBuyer, setLoadingBuyer] = useState(true);
  const [buyerError, setBuyerError] = useState(null);

  // location에서 carDetails를 가져옴 (값이 없더라도 변수 선언은 항상 함)
  const { carDetails } = location.state || {};

  // 구매자 정보 가져오기 (서버 API 호출)
  useEffect(() => {
    axios.get(`${SERVER_URL}/used-cars/user/info`, { withCredentials: true })
      .then(response => {
        setBuyerInfo(response.data);
        setLoadingBuyer(false);
      })
      .catch(error => {
        console.error('구매자 정보 조회 실패:', error);
        setBuyerError('구매자 정보를 불러올 수 없습니다.');
        setLoadingBuyer(false);
      });
  }, []);

  // carDetails가 없으면 조건부 렌더링
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

  // 대표 이미지 URL 결정: carDetails.mainImage가 존재하면, 절대 경로 여부를 확인하고, 없으면 DEFAULT_IMAGE_URL 사용
  const mainImageUrl = carDetails.mainImage 
  ? (carDetails.mainImage.startsWith('http')
       ? carDetails.mainImage 
       : SERVER_URL + carDetails.mainImage)
  : DEFAULT_IMAGE_URL;

  return (
    <div className="car-payment-detail">
      <h1>차량 상세정보 확인</h1>

      <div className="car-info">
        {/* 차량 대표 이미지 추가 */}
        <img
          src={mainImageUrl}
          alt="차량 대표 이미지"
          style={{ width: '300px', height: 'auto', marginBottom: '1rem' }}
        />
        <p><strong>차량명:</strong> {carDetails.name}</p>
        <p><strong>연식:</strong> {carDetails.year}</p>
        <p><strong>주행거리:</strong> {carDetails.mileage}</p>
        <p><strong>연료:</strong> {carDetails.fuelType}</p>
        <p><strong>차량번호:</strong> {carDetails.vehicleNo}</p>
      </div>

      <div className="buyer-info">
        <h2>구매자 정보</h2>
        {loadingBuyer ? (
          <p>구매자 정보를 불러오는 중...</p>
        ) : buyerError ? (
          <p>{buyerError}</p>
        ) : buyerInfo ? (
          <>
            <p><strong>이름:</strong> {buyerInfo.name}</p>
            <p><strong>이메일:</strong> {buyerInfo.email}</p>
            <p><strong>전화번호:</strong> {buyerInfo.phone}</p>
          </>
        ) : (
          <p>구매자 정보를 불러올 수 없습니다.</p>
        )}
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
        <div className="total-price">
          합계: {carDetails.totalPrice.toLocaleString()}원
        </div>
      </div>

      <button onClick={handleProceedToPayment}>
        결제하기
      </button>
    </div>
  );
};

export default CarPaymentdetail;
