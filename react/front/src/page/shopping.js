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
      폭스바겐: ["골프", "제타", "파사트", "티구안", "투아렉"],
      포드: ["포커스", "몬데오", "머스탱", "엣지", "익스플로러"],
      도요타: ["프리우스", "코롤라", "캠리", "라브4", "하이랜더"],
      혼다: ["시빅", "어코드", "CR-V", "파일럿"],
      닛산: ["센트라", "알티마", "맥시마", "로그", "패스파인더"],
      매트: ["고무매트", "카펫매트", "코일매트"],
      시트커버: ["가죽시트커버", "패브릭시트커버"],
      핸들커버: ["가죽핸들커버", "패브릭핸들커버"],
      방향제: ["액체형", "겔형", "스프레이형"],
      청소용품: ["대시보드 클리너", "유리 클리너", "진공청소기"],
      스포일러: ["리어 스포일러", "프론트 스포일러"],
      바디킷: ["사이드 스커트", "프론트 범퍼", "리어 범퍼"],
      서스펜션: ["로워링 스프링", "코일오버 키트"],
      브레이크: ["브레이크 패드", "브레이크 디스크"],
      엔진튜닝: ["에어 인테이크", "터보차저", "ECU 리맵핑"],
    },
  };

  


  // 데이터 요청 함수
  const fetchData = async () => {
    try {
      const params = {};
      if (selectedCategory) params.categoryMain = selectedCategory;
      if (selectedSubcategory) params.categorySub = selectedSubcategory;
      if (selectedDetail) params.categoryDetail = selectedDetail;
      
      console.log("Fetching data with params:", params); // 요청 시의 파라미터 확인

      const response = await axios.get('http://localhost:9999/shopping', { params });
      setData(response.data);
      setError(null);
    } catch (error) {
      setError('데이터를 불러오는 데 실패했습니다. 다시 시도해주세요.');
    }
  };


  // 데이터 요청
   // 선택 항목이 변경될 때마다 데이터 요청
   useEffect(() => {
    fetchData();
  }, [selectedCategory, selectedSubcategory, selectedDetail]);

  // 카테고리 변경 핸들러
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setSelectedDetail(null);
  };

  const handleSubcategoryChange = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setSelectedDetail(null);
  };

  return (
    <div className="shopping-page">
      

      <div className="content">
        {/* 좌측 카테고리 */}
        <aside className="categories">
          <section className="category-section">
            <h2>대분류</h2>
            {categories.대분류.map((category, index) => (
              <button
                key={index}
                className={`category-button ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </section>

          {selectedCategory && (
            <section className="subcategory-section">
              <h2>중분류</h2>
              {categories.중분류[selectedCategory]?.map((subcategory, index) => (
                <button
                  key={index}
                  className={`category-button ${
                    selectedSubcategory === subcategory ? "active" : ""
                  }`}
                  onClick={() => handleSubcategoryChange(subcategory)}
                >
                  {subcategory}
                </button>
              ))}
            </section>
          )}

          {selectedSubcategory && (
            <section className="subcategory-detail-section">
              <h2>소분류</h2>
              {categories.소분류[selectedSubcategory]?.map((detail, index) => (
                <button
                  key={index}
                  className={`category-button ${
                    selectedDetail === detail ? "active" : ""
                  }`}
                  onClick={() => setSelectedDetail(detail)}
                >
                  {detail}
                </button>
              ))}
            </section>
          )}
        </aside>

        {/* 우측 콘텐츠 */}
        <main className="main-content">
          <h2>상품 리스트</h2>
          {error ? (
            <p className="error-message">{error}</p>
          ) : data.length > 0 ? (
            <div className="product-list">
              {data.map((item) => (
                <div
                  className="product-item"
                  key={item.productId}
                  onClick={() => navigate(`/shopping/product/${item.productId}`)}
                >
                  <img src={item.productImage} alt={item.productName} />
                  <h3>{item.productName}</h3>
                  <p>{item.productPrice}원</p>
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