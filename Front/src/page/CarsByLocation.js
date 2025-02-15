import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CarsByLocation = () => {
  const { location } = useParams(); // URL 파라미터로부터 지역명 ("울산", "부산", 등)
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCarsByLocation();
  }, [location]);

  // 백엔드에서 해당 location에 따른 차량 목록을 가져옴
  const fetchCarsByLocation = async () => {
    try {
      // 예: /api/cars?location=부산
      const response = await fetch(
        `http://localhost:9999/api/dealer-locations/${encodeURIComponent(location)}`
      );
      const data = await response.json();
      setCars(data);
      setLoading(false);
    } catch (error) {
      console.error("차량 목록 가져오기 실패:", error);
      setLoading(false);
    }
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{location} 지역 차량 목록</h2>
      {cars.length === 0 ? (
        <p>해당 지역에 차량 데이터가 없습니다.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {cars.map((car, idx) => (
            <li key={idx} style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
              <strong>{car.vehicleName}</strong> - {car.brand} ({car.modelYear}년식)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CarsByLocation;
