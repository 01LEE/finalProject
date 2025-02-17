import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

const CarsByLocation = () => {
  const { location } = useParams(); // URL 파라미터로부터 지역명 ("울산", "부산", 등)
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [base64Images, setBase64Images] = useState({});
  const mapContainerRef = useRef(null); // 지도 컨테이너용 ref

  // 기본 이미지 URL (이미지가 없을 경우 사용할 이미지)
  const SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const DEFAULT_IMAGE_URL = `${SERVER_URL}/images/usedcar_imageX.png`;

  // 미리 지정한 각 지역의 위도, 경도 정보
  const locationCoordinates = {
    서울: { lat: 37.5665, lng: 126.9780 },
    부산: { lat: 35.1796, lng: 129.0756 },
    울산: { lat: 35.5384, lng: 129.3114 },
    경기: { lat: 37.4138, lng: 127.5183 },
    인천: { lat: 37.4563, lng: 126.7052 },
    대구: { lat: 35.8722, lng: 128.6025 },
    대전: { lat: 36.3504, lng: 127.3845 },
  };

  // 백엔드에서 해당 location에 따른 차량 목록을 가져오는 효과
  useEffect(() => {
    const fetchCarsByLocation = async () => {
      try {
        const response = await fetch(
          `http://localhost:9999/api/dealer-locations/${encodeURIComponent(location)}`
        );
        const data = await response.json();
        setCars(data);
      } catch (error) {
        console.error("차량 목록 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarsByLocation();
  }, [location]);

  // 이미지 처리 (Blob to Base64)
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // UsedCarBoard와 유사하게 각 차량의 이미지를 Base64로 변환 또는 URL 설정
  useEffect(() => {
    const fetchBase64Images = async () => {
      const updatedImages = {};
      for (const car of cars) {
        // 예시로 car.mainImage가 Blob 데이터의 URL이면 처리
        if (car.mainImage && car.mainImage.startsWith("blob:")) {
          try {
            const base64 = await blobToBase64(car.mainImage);
            updatedImages[car.vehicleNo] = base64;
          } catch (error) {
            console.error(`Failed to convert Blob to Base64 for ${car.vehicleNo}:`, error);
          }
        } else if (car.mainImage) {
          updatedImages[car.vehicleNo] = `${SERVER_URL}${car.mainImage}`;
        }
      }
      setBase64Images(updatedImages);
    };

    if (cars.length > 0) {
      fetchBase64Images();
    }
  }, [cars, SERVER_URL]);

  // 카카오 지도 로드 및 지정된 좌표로 마커 표시하는 효과  
  // loading 상태가 false일 때만 실행합니다.
  useEffect(() => {
    if (loading) return; // 로딩 중이면 실행하지 않음

    if (!window.kakao) {
      console.error("Kakao Maps SDK가 로드되지 않았습니다.");
      return;
    }
    if (!mapContainerRef.current) {
      console.error("지도 컨테이너를 찾을 수 없습니다.");
      return;
    }

    // 해당 지역의 좌표가 있으면 사용, 없으면 기본값(서울)
    const coords = locationCoordinates[location] || { lat: 37.5665, lng: 126.9780 };

    const mapOption = {
      center: new window.kakao.maps.LatLng(coords.lat, coords.lng),
      level: 1, // level 1: 최대 확대 (약 20m 내외)
    };

    // 지도 생성
    const map = new window.kakao.maps.Map(mapContainerRef.current, mapOption);
    map.setDraggable(true);
    map.setZoomable(true);

    // 마커 생성
    const markerPosition = new window.kakao.maps.LatLng(coords.lat, coords.lng);
    const marker = new window.kakao.maps.Marker({
      position: markerPosition,
    });
    marker.setMap(map);

    // 인포윈도우 생성 (마커 클릭 시 지역명을 보여줌)
    const infowindow = new window.kakao.maps.InfoWindow({
      content: `<div style="padding:5px;font-size:12px;">${location} 지점</div>`,
    });
    window.kakao.maps.event.addListener(marker, "click", () => {
      infowindow.open(map, marker);
    });

    // 지도 컨테이너 렌더링 완료 후 재레이아웃 호출
    setTimeout(() => {
      map.relayout();
    }, 200);
  }, [location, loading, locationCoordinates]);

  if (loading) return <div>로딩 중...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{location} 지점 차량 목록</h2>

      {/* 지도 영역 */}
      <div
        id="map"
        ref={mapContainerRef}
        style={{
          width: "100%",
          height: "400px",
          marginTop: "20px",
          border: "1px solid #ccc",
        }}
      />

      {/* 차량 목록 출력 */}
      {cars.length === 0 ? (
        <p>해당 지역에 차량 데이터가 없습니다.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>
          {cars.map((car, idx) => (
            <li
              key={idx}
              style={{
                padding: "10px",
                borderBottom: "1px solid #ccc",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* 차량 이미지 */}
              <div style={{ marginRight: "20px" }}>
                <img
                  src={car.mainImage ? (base64Images[car.vehicleNo] || `${SERVER_URL}${car.mainImage}`) : DEFAULT_IMAGE_URL}
                  alt={`${car.vehicleName} 대표 이미지`}
                  style={{ width: "120px", height: "auto" }}
                />
              </div>
              {/* 차량 정보 */}
              <div>
                <h3 style={{ margin: "0 0 5px" }}>{car.vehicleName}</h3>
                <p style={{ margin: "0 0 5px" }}>브랜드: {car.brand}</p>
                <p style={{ margin: "0 0 5px" }}>연식: {car.modelYear}년</p>
                <p style={{ margin: "0 0 5px" }}>
                  주행거리: {car.car_km ? car.car_km.toLocaleString() : 0}km
                </p>
                <p style={{ margin: "0 0 5px" }}>
                  가격: ₩{car.price ? car.price.toLocaleString() : "0"}
                </p>
                <p style={{ margin: 0 }}>판매점: {car.dealerLocation}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CarsByLocation;
