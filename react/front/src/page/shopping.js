import React, { useState } from 'react';
import axios from 'axios';
import '../css/shopping.css';

const categories = {
  대분류: ["국산차 용품", "수입차 용품", "실내용품", "레이싱/튜닝"],
  중분류: {
    "국산차 용품": ["현대차", "기아자동차", "제네시스", "쉐보레", "르노자동차", "KG모빌리티"],
    "수입차 용품": ["벤츠", "BMW", "아우디", "테슬라", "마세라티", "재규어", "포르쉐", "람보르기니"],
    "실내용품": ["수납용품", "키케이스", "휴대폰 거치대", "각종 거치대", "쿠션 아이템", "핸들커버"],
    "레이싱/튜닝": ["레이싱슈트", "레이싱 벨트", "헬멧", "오일 쿨러", "후드팬", "점화플러그"]
  },
  소분류: {
    현대차: ["아반떼 용품", "소나타 용품", "팰리세이드 용품"],
    기아자동차: ["카니발 용품", "셀토스 용품", "EV6 용품"],
    제네시스: ["G80 용품", "GV80 용품"],
    쉐보레: ["스파크 용품", "트레일블레이저 용품"],
    르노자동차: ["XM3 용품", "QM6 용품"],
    KG모빌리티: ["렉스턴 용품", "코란도 용품"],
    벤츠: ["E-Class 용품", "C-Class 용품"],
    BMW: ["3시리즈 용품", "5시리즈 용품"],
    아우디: ["A4 용품", "Q5 용품"],
    테슬라: ["모델3 용품", "모델Y 용품"],
    마세라티: ["기블리 용품", "르반떼 용품"],
    재규어: ["XF 용품", "F-Pace 용품"],
    포르쉐: ["911 용품", "마칸 용품"],
    람보르기니: ["우루스 용품", "아벤타도르 용품"]
  }
};

export default function Shopping() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [data, setData] = useState([]); // Spring에서 가져온 데이터를 저장

  // 데이터를 Spring 백엔드로 요청
  const fetchData = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/categories', {
        대분류: selectedCategory,
        중분류: selectedSubcategory,
        소분류: selectedDetail
      });
      setData(response.data); // 백엔드에서 받은 데이터 저장
    } catch (error) {
      console.error('데이터를 가져오는 중 오류 발생:', error);
    }
  };

  // 소분류 선택 시 데이터 가져오기
  const handleDetailClick = (detail) => {
    setSelectedDetail(detail);
    fetchData(); // 데이터 요청
  };

  return (
    <div className="shopping-page">
      <header className="header">
        <h1>카자몰</h1>
      </header>

      <div className="content">
        {/* 좌측 카테고리 */}
        <aside className="categories">
          <section className="category-section">
            <h2>대분류</h2>
            <div className="category-list">
              {categories.대분류.map((category, index) => (
                <button
                  key={index}
                  className={`category-button ${
                    selectedCategory === category ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSelectedSubcategory(null);
                    setSelectedDetail(null);
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </section>

          {selectedCategory && (
            <section className="subcategory-section">
              <h2>중분류</h2>
              <div className="category-list">
                {categories.중분류[selectedCategory]?.map((subcategory, index) => (
                  <button
                    key={index}
                    className={`category-button ${
                      selectedSubcategory === subcategory ? "active" : ""
                    }`}
                    onClick={() => {
                      setSelectedSubcategory(subcategory);
                      setSelectedDetail(null);
                    }}
                  >
                    {subcategory}
                  </button>
                ))}
              </div>
            </section>
          )}

          {selectedSubcategory && (
            <section className="subcategory-detail-section">
              <h2>소분류</h2>
              <div className="category-list">
                {categories.소분류[selectedSubcategory]?.map((item, index) => (
                  <button
                    key={index}
                    className={`category-button ${
                      selectedDetail === item ? "active" : ""
                    }`}
                    onClick={() => handleDetailClick(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </section>
          )}
        </aside>

        {/* 우측 콘텐츠 */}
        <main className="main-content">
          <h2>쇼핑 콘텐츠</h2>
          {data.length > 0 ? (
            data.map((item, index) => (
              <div key={index} className="product">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
            ))
          ) : (
            <p>선택된 카테고리에 맞는 데이터를 불러오세요.</p>
          )}
        </main>
      </div>
    </div>
  );
}
