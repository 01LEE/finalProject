import React, { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

function CarPayment() {
  // URL 파라미터 예: /payment/:vehicleNo
  const { vehicleNo } = useParams();
  const navigate = useNavigate();

  // CarDetail 등에서 넘긴 state (차량 정보)
  const location = useLocation();
  const { carDetails } = location.state || {};

  // 실제 로그인/인증 로직에 따라 사용자를 식별하는 방법 (예: Redux, Context, localStorage 등)
  // 여기서는 간단히 하드코딩
  const userNo = 1;

  // 포인트 결제 금액 입력
  const [point, setPoint] = useState(0);
  // 로딩 상태
  const [loading, setLoading] = useState(false);

  // 결제 처리 함수
  const handlePayment = async () => {
    // 결제 요청 전에 간단히 유효성 체크
    if (point <= 0) {
      alert("포인트를 1 이상 입력하세요.");
      return;
    }

    setLoading(true);

    // 결제 API 요청 데이터
    const paymentData = {
      userNo: userNo,
      vehicleNo: vehicleNo,
      point: point
    };

    try {
      // 실제 백엔드 결제 API (POST) 경로 예시: /api/payment/point
      const response = await fetch("http://localhost:9999/api/payment/point", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        throw new Error("결제 실패");
      }

      alert("포인트 결제가 완료되었습니다!");
      // 결제 완료 후 홈 or 다른 페이지로 이동
      navigate("/");
    } catch (error) {
      console.error("결제 오류:", error);
      alert("결제 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // carDetails가 없으면 에러 처리
  if (!carDetails) {
    return <div>차량 정보를 받아오지 못했습니다.</div>;
  }

  const totalPrice = carDetails.totalPrice || carDetails.price || 0;

  return (
    <div style={{ padding: "20px" }}>
      <h2>포인트 결제 페이지</h2>
      <p><strong>차량번호:</strong> {vehicleNo}</p>
      <p><strong>차량명:</strong> {carDetails.name || "차량 이름"}</p>
      <p><strong>결제 예정 금액:</strong> {totalPrice.toLocaleString()}원</p>

      <div style={{ marginTop: "20px" }}>
        <label>
          사용 포인트:&nbsp;
          <input
            type="number"
            value={point}
            onChange={(e) => setPoint(Number(e.target.value))}
            placeholder="0"
            style={{ width: "100px" }}
          />
        </label>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        style={{ marginTop: "20px", padding: "10px 20px" }}
      >
        {loading ? "결제 진행 중..." : "결제하기"}
      </button>
    </div>
  );
}

export default CarPayment;
