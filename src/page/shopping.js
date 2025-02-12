import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/shopping.css";
import { useNavigate } from "react-router-dom";

const Shopping = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [data, setData] = useState([]); // Spring에서 받은 데이터
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 카테고리 데이터 구조 유지
  const categories = {
    대분류: ["국산차 용품", "수입차 용품", "실내용품", "레이싱/튜닝"],
    중분류: {
      "국산차 용품": ["현대차", "기아자동차", "제네시스", "쉐보레", "르노삼성", "쌍용자동차"],
      "수입차 용품": ["벤츠", "BMW", "아우디", "폭스바겐", "포드", "도요타", "혼다", "닛산"],
      "실내용품": ["매트", "시트커버", "핸들커버", "방향제", "청소용품"],
      "레이싱/튜닝": ["스포일러", "바디킷", "서스펜션", "브레이크", "엔진튜닝"],
    },
    소분류: {
      현대차: ["아반떼", "소나타", "그랜저", "싼타페", "투싼"],
      기아자동차: ["모닝", "K3", "K5", "K7", "스포티지", "쏘렌토"],
      제네시스: ["G70", "G80", "G90"],
      쉐보레: ["스파크", "말리부", "트랙스", "이쿼녹스"],
      르노삼성: ["SM3", "SM5", "SM6", "QM3", "QM6"],
      쌍용자동차: ["티볼리", "코란도", "렉스턴"],
      벤츠: ["A-Class", "C-Class", "E-Class", "S-Class", "GLA", "GLC"],
      BMW: ["1시리즈", "3시리즈", "5시리즈", "7시리즈", "X1", "X3", "X5"],
      아우디: ["A3", "A4", "A6", "A8", "Q3", "Q5", "Q7"],
    },
  };

  const fetchData = async () => {
    try {
      const params = {
        categoryMain: selectedCategory?.trim(),
        categorySub: selectedSubcategory?.trim(),
        categoryDetail: selectedDetail?.trim(),
      };

      const response = await axios.get("http://localhost:9999/shopping", { params });
      setData(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("데이터를 불러오는 데 실패했습니다. 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory, selectedSubcategory, selectedDetail]);

  return (
    <div className="shopping-page">
      <header className="header">
        <h1>카자몰</h1>
      </header>

      <div className="content">
        <aside className="categories">
          <section className="category-section">
            <h2>대분류</h2>
            {categories.대분류.map((category, index) => (
              <button
                key={index}
                className={`category-button ${selectedCategory === category ? "active" : ""}`}
                onClick={() => {
                  setSelectedCategory(category);
                  if (selectedCategory !== category) {
                    setSelectedSubcategory(null);
                    setSelectedDetail(null);
                  }
                }}
              >
                {category}
              </button>
            ))}
          </section>

          {/* ✅ 중분류 유지 */}
          {selectedCategory && (
            <section className="subcategory-section">
              <h2>중분류</h2>
              {categories.중분류[selectedCategory]?.map((subcategory, index) => (
                <button
                  key={index}
                  className={`category-button ${selectedSubcategory === subcategory ? "active" : ""}`}
                  onClick={() => {
                    setSelectedSubcategory(subcategory);
                    setSelectedDetail(null);
                  }}
                >
                  {subcategory}
                </button>
              ))}
            </section>
          )}

          {/* ✅ 소분류 유지 */}
          {selectedSubcategory && categories.소분류[selectedSubcategory] && (
            <section className="subcategory-detail-section">
              <h2>소분류</h2>
              {categories.소분류[selectedSubcategory]?.map((detail, index) => (
                <button
                  key={index}
                  className={`category-button ${selectedDetail === detail ? "active" : ""}`}
                  onClick={() => setSelectedDetail(detail)}
                >
                  {detail}
                </button>
              ))}
            </section>
          )}
        </aside>

        <main className="main-content">
          <h2>상품 리스트</h2>
          {error ? (
            <p className="error-message">{error}</p>
          ) : data.length > 0 ? (
            <div className="product-grid">
              {data.map((item) => (
                <div key={item.productId} className="product-card" onClick={() => navigate(`/shopping/product/${item.productId}`)}>
                  <div className="product-image">
                    {item.productImage ? (
                      <img src={item.productImage} alt={item.productName} />
                    ) : (
                      <span>이미지 없음</span>
                    )}
                  </div>
                  <div className="product-info">
                    <p className="product-name">{item.productName}</p>
                    <p className="product-price">{item.productPrice ? item.productPrice.toLocaleString() + "원" : "가격 정보 없음"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>선택한 조건에 맞는 상품이 없습니다.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shopping;
