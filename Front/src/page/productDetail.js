import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import apiAxios from "../lib/apiAxios";
import { logout } from "../store/authSlice";
import "../css/productDetail.css";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiAxios.get(`http://localhost:9999/shopping/product/${productId}`);
        setProduct(response.data.product || {});
        setReviews(response.data.reviews || []);
      } catch (error) {
        setError("상품 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleAddReview = async () => {
    if (!isAuthenticated) {
      alert("리뷰를 작성하려면 로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    if (!newReview.trim()) {
      alert("리뷰 내용을 입력해주세요.");
      return;
    }

    try {
      const response = await apiAxios.post(`http://localhost:9999/shopping/product/${productId}/review`, {
        content: newReview,
        evaluation: newRating,
      });

      if (response.data.code === 1) {
        setReviews(response.data.reviewList || []);
        setNewReview("");
        setNewRating(5);
      } else {
        setError(response.data.msg);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("인증이 만료되었습니다. 다시 로그인해주세요.");
        dispatch(logout());
        navigate("/login");
      } else {
        setError("리뷰 추가 중 오류가 발생했습니다.");
      }
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="product-detail">
      <div className="product-header">
        <img src={product?.image} alt={product?.name} className="product-image" />
        <div className="product-info">
          <h1>{product?.name}</h1>
          <p className="price">{product?.price}원</p>
          <button className="add-to-cart">장바구니 담기</button>
        </div>
      </div>

      <div className="review-section">
        <h2>리뷰</h2>
        {Array.isArray(reviews) && reviews.length > 0 ? (
          <ul className="review-list">
            {reviews.map((review) => (
              <li key={review.reviewNo} className="review-item">
                <p><strong>{review.userId}</strong></p>
                <p>{review.content}</p>
                <p className="rating">평점: {review.evaluation}점</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>아직 등록된 리뷰가 없습니다.</p>
        )}
        
        <div className="add-review">
          <textarea 
            value={newReview} 
            onChange={(e) => setNewReview(e.target.value)} 
            placeholder="리뷰를 입력하세요"
          />
          <select value={newRating} onChange={(e) => setNewRating(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>{rating}점</option>
            ))}
          </select>
          <button onClick={handleAddReview}>리뷰 추가</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
