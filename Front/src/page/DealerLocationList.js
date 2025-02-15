import React from "react";
import { Link } from "react-router-dom";

const regionList = ["울산", "부산", "경기", "인천", "대구", "대전", "서울"];

const DealerLocationList = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>딜러 지역 목록</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {regionList.map((region, idx) => (
          <li key={idx} style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
            {/* 각 지역을 클릭하면 /cars/:location 으로 이동 */}
            <Link to={`/cars/${encodeURIComponent(region)}`}>{region}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DealerLocationList;
