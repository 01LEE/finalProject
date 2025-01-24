import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; // Redux 상태 가져오기
import apiAxios from "../lib/apiAxios"; // 커스텀 Axios 인스턴스 사용
import { logout } from "../store/authSlice"; // 로그아웃 액션 가져오기
import "../css/productDetail.css";

const ProductDetail = () => {
  const { productId } = useParams(); // URL에서 productId 가져오기
  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이터
  const [reviews, setReviews] = useState([]); // 리뷰 데이터
  const [newReview, setNewReview] = useState(""); // 새 리뷰 내용
  const [newRating, setNewRating] = useState(5); // 새 리뷰 평점
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // 성공 메시지
  const [loading, setLoading] = useState(true); // 로딩 상태

  const dispatch = useDispatch(); // Redux Dispatch
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // 인증 여부 가져오기

  // 리뷰 데이터를 가져오는 useEffect
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        console.log(`Fetching reviews for product ID: ${productId}`);
        const response = await apiAxios.get(`/shopping/product/${productId}`);
        console.log("Fetched reviews:", response.data);
        setReviews(response.data); // 서버에서 바로 리뷰 리스트를 반환한다고 가정
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError("리뷰 데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  // 리뷰 추가 핸들러
  const handleAddReview = async () => {
    if (!isAuthenticated) {
      alert("리뷰를 작성하려면 로그인이 필요합니다.");
      navigate("/login"); // 로그인 페이지로 이동
      return;
    }

    if (!newReview.trim()) {
      alert("리뷰 내용을 입력해주세요.");
      return;
    }

    try {
      console.log("Sending review request...");
      const response = await apiAxios.post(
        `/shopping/product/${productId}/review`,
        { content: newReview, evaluation: newRating }
      );

      console.log("Add review response:", response.data);

      if (response.data.code === 1) {
        setSuccessMessage("리뷰가 성공적으로 추가되었습니다.");
        setReviews(response.data.reviewList); // 리뷰 목록 업데이트
        setNewReview(""); // 입력 필드 초기화
        setNewRating(5); // 평점 초기화
      } else {
        setError(response.data.msg);
      }
    } catch (error) {
      console.error("Error adding review:", error);

      // 토큰이 만료되었거나 인증 문제가 있을 경우
      if (error.response && error.response.status === 401) {
        setError("인증이 만료되었습니다. 다시 로그인해주세요.");
        dispatch(logout());
        navigate("/login");
      } else {
        setError("리뷰를 추가하는 중 오류가 발생했습니다.");
      }
    }
  };

  if (loading) {
    return <p className="loading-message">로딩 중...</p>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()}>다시 시도</button>
      </div>
    );
  }

  return (
    <div className="review-section">
      <h2>리뷰</h2>
      {Array.isArray(reviews) && reviews.length > 0 ? (
        <ul className="review-list">
          {reviews.map((review) => (
            <li key={review.reviewNo} className="review-item">
              <p>
                <strong>작성자 ID: {review.userId}</strong>
              </p>
              <p>{review.content}</p>
              <p className="rating">
                평점: {review.evaluation}점 <span className="created-date">({new Date(review.createdDate).toLocaleString()})</span>
              </p>
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
          <label htmlFor="rating">평점:</label>
          <select
            id="rating"
            value={newRating}
            onChange={(e) => setNewRating(Number(e.target.value))}
          >
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
    </div>
  );
};

export default ProductDetail;
