import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../css/productDetail.css";

const ProductDetail = () => {
  const { productId } = useParams(); // URL에서 productId 가져오기
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]); // 기존 리뷰 데이터
  const [newReview, setNewReview] = useState(""); // 새 리뷰 내용
  const [newRating, setNewRating] = useState(5); // 새 리뷰 평점
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // 성공 메시지
  const [loading, setLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:9999/shopping/product/${productId}`);
        setProduct(response.data);
      } catch (error) {
        setError("상품 정보를 불러오는 데 실패했습니다.");
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:9999/shopping/product/${productId}/reviews`);
        setReviews(response.data);
      } catch (error) {
        setError("리뷰 데이터를 불러오는 데 실패했습니다.");
      }
    };

    const fetchData = async () => {
      await fetchProductDetail();
      await fetchReviews();
      setLoading(false); // 모든 데이터를 로드한 후 로딩 상태 변경
    };

    fetchData();
  }, [productId]);

  // 리뷰 추가 핸들러
  const handleAddReview = async () => {
    const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰 가져오기

    if (!token) {
      setError("로그인이 필요합니다.");
      return;
    }

    if (!newReview.trim()) {
      setError("리뷰 내용을 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:9999/product/${productId}/review`,
        { content: newReview, evaluation: newRating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.code === 1) {
        setSuccessMessage("리뷰가 성공적으로 추가되었습니다.");
        setReviews(response.data.reviewList); // 리뷰 목록 업데이트
        setNewReview(""); // 입력 필드 초기화
        setNewRating(5); // 평점 초기화
      } else {
        setError(response.data.msg); // 서버에서 전달된 에러 메시지
      }
    } catch (error) {
      setError("리뷰를 추가하는 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return <p className="loading-message">로딩 중...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!product) {
    return <p className="error-message">상품 정보를 찾을 수 없습니다.</p>;
  }

  return (
    <div className="product-detail-page">
        <h1>카자몰</h1>

      <main className="main-content">
        {/* 상품 상세 정보 */}
        <section className="product-detail">
          <img src={product.productImage} alt={product.productName} className="product-image" />
          <div className="product-info">
            <h2>{product.productName}</h2>
            <p className="price">{product.productPrice}원</p>
            <p className="category">
              {product.productCategory} | {product.productSubCategory}
            </p>
            <p className="description">{product.productDescription}</p>
          </div>
        </section>

        {/* 리뷰 섹션 */}
        <section className="review-section">
          <h2>리뷰</h2>
          {reviews.length > 0 ? (
            <ul className="review-list">
              {reviews.map((review) => (
                <li key={review.reviewNo} className="review-item">
                  <p>
                    <strong>작성자 ID: {review.userNo}</strong>
                  </p>
                  <p>{review.content}</p>
                  <p className="rating">평점: {review.evaluation}점</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-reviews">아직 등록된 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!</p>
          )}

          {/* 리뷰 작성 */}
          <div className="add-review">
            <h3>리뷰 작성하기</h3>
            <textarea
              placeholder="리뷰 내용을 입력하세요."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
            />
            <div className="rating-input">
              <label>평점:</label>
              <select value={newRating} onChange={(e) => setNewRating(Number(e.target.value))}>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating}점
                  </option>
                ))}
              </select>
            </div>
            <button onClick={handleAddReview}>리뷰 추가</button>
            {successMessage && <p className="success-message">{successMessage}</p>}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© 2025 카자몰. 모든 권리 보유.</p>
      </footer>
    </div>
  );
};

export default ProductDetail;
