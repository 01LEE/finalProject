import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function CarPayment() {
  const navigate = useNavigate();
  const { carDetails } = useLocation().state || {};

  // URL 파라미터 대신 carDetails에서 차량 번호를 가져옴
  const vehicleNo = carDetails?.vehicleNo ?? null;
  console.log("🚗 vehicleNo from carDetails:", vehicleNo);

  // 로그인/인증된 사용자 정보 (예시: 하드코딩)
  const userNo = 1;

  // 총 결제 금액은 carDetails에 고정되어 있음
  const totalPrice = carDetails?.totalPrice || carDetails?.price || 0;

  // 사용자 현재 포인트 상태
  const [userPoint, setUserPoint] = useState(0);
  const [loading, setLoading] = useState(false);

  // 사용자 포인트 조회 (백엔드 API 호출)
  useEffect(() => {
    // 실제 API URL은 환경에 맞게 수정하세요.
    fetch(`http://localhost:9999/used-cars/point?userNo=${userNo}`, {
      method: "GET",
      credentials: "include"
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("포인트 조회 실패");
        }
        return res.json();
      })
      .then((data) => {
        // 백엔드에서 { userPoint: <포인트값> } 형태로 반환한다고 가정
        setUserPoint(data.userPoint);
      })
      .catch((error) => console.error("포인트 조회 오류:", error));
  }, [userNo]);

  const handlePayment = async () => {
    if (!vehicleNo) {
      alert("🚨 차량 번호가 없습니다.");
      return;
    }

    setLoading(true);

    // 결제 데이터: 차량 번호와 고정된 총 결제 금액 사용
    const paymentData = {
      vehicleNo: vehicleNo,
      point: totalPrice, // 결제 금액은 고정된 금액 사용
    };

    try {
      const response = await fetch("http://localhost:9999/used-cars/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        throw new Error("결제 실패");
      }

      alert("포인트 결제가 완료되었습니다!");
      navigate("/");
    } catch (error) {
      console.error("결제 오류:", error);
      alert("결제 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!carDetails) {
    return <div>차량 정보를 받아오지 못했습니다.</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>포인트 결제 페이지</h2>
      <p><strong>차량번호:</strong> {vehicleNo || "🚨 없음"}</p>
      <p><strong>차량명:</strong> {carDetails.name || "차량 이름"}</p>
      <p><strong>결제 예정 금액:</strong> {totalPrice.toLocaleString()}원</p>
      <p><strong>현재 보유 포인트:</strong> {userPoint.toLocaleString()}원</p>
      {/* 결제 금액은 고정되어 변경 불가능 */}
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
