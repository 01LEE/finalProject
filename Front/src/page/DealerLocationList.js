import React from "react";
import { Link } from "react-router-dom";

// 각 지역에 해당하는 이미지 URL을 미리 정의 (이미지 파일은 public 폴더나 CDN에 위치)
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const regionData = [
  { region: "울산", image: `${SERVER_URL}/images/usedcar_imageX.png` },
  { region: "부산", image: `${SERVER_URL}/images/usedcar_imageX.png` },
  { region: "경기", image: `${SERVER_URL}/images/usedcar_imageX.png` },
  { region: "인천", image: `${SERVER_URL}/images/usedcar_imageX.png` },
  { region: "대구", image: `${SERVER_URL}/images/usedcar_imageX.png` },
  { region: "대전", image: `${SERVER_URL}/images/usedcar_imageX.png` },
  { region: "서울", image: `${SERVER_URL}/images/usedcar_imageX.png` },
];

const DealerLocationList = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>전국 직영점 목록</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {regionData.map((item, idx) => (
          <li key={idx} style={{ padding: "10px", borderBottom: "1px solid #ccc", display: "flex", alignItems: "center" }}>
            <img 
              src={item.image} 
              alt={item.region} 
              style={{ width: "50px", height: "50px", marginRight: "10px", objectFit: "cover" }}
            />
            <Link to={`/cars/${encodeURIComponent(item.region)}`}>{item.region}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DealerLocationList;
