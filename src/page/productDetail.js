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

  // 상태 관리
  const [product, setProduct] = useState(null);
  const [productDetails, setProductDetails] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1); // ✅ 선택한 수량 상태 추가

  // ✅ 제품 정보 + 상세 정보 가져오는 API 호출
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await apiAxios.get(`/shopping/product/${productId}/details`);
        if (response.data.length > 0) {
          const { productId, productName, productPrice, categoryMain, categorySub, categoryDetail, productImage } =
            response.data[0];

          setProduct({
            productId,
            productName,
            productPrice,
            categoryMain,
            categorySub,
            categoryDetail,
            productImage,
          });

          setProductDetails(response.data);

          // ✅ 색상 목록에서 중복 제거 후 첫 번째 색상 선택
          const uniqueColors = [...new Set(response.data.map((detail) => detail.productColor))];
          if (uniqueColors.length > 0) {
            setSelectedColor(uniqueColors[0]); // 기본 선택 값 설정
          }
        }
      } catch (error) {
        setError("제품 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  // ✅ 장바구니 담기 핸들러
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert("장바구니에 담으려면 로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      const response = await apiAxios.post("/cart/add", {
        productId,
        productColor: selectedColor,
        quantity,
      });

      if (response.data.success) {
        alert("장바구니에 추가되었습니다!");
      } else {
        alert("장바구니 추가에 실패했습니다.");
      }
    } catch (error) {
      console.error("장바구니 추가 오류:", error);
      alert("장바구니 추가 중 오류가 발생했습니다.");
    }
  };

  // ✅ 결제하기 핸들러
  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert("결제를 진행하려면 로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    navigate(`/checkout?productId=${productId}&color=${selectedColor}&quantity=${quantity}`);
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
    <div className="product-detail-page">
      {product && (
        <div className="product-info">
          <h2>{product.productName}</h2>
          <p>가격: {product.productPrice ? product.productPrice.toLocaleString() + "원" : "가격 정보 없음"}</p>
          <p>
            카테고리:{" "}
            {product.categoryMain || "미분류"}
            {product.categorySub ? ` > ${product.categorySub}` : ""}
            {product.categoryDetail ? ` > ${product.categoryDetail}` : ""}
          </p>
          {product.productImage && <img src={product.productImage} alt={product.productName} className="product-image" />}
        </div>
      )}

      {/* ✅ 색상 선택 드롭다운 추가 */}
      <div className="color-selection">
        <label htmlFor="colorSelect">색상 선택:</label>
        <select
          id="colorSelect"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
        >
          {Array.from(new Set(productDetails.map((detail) => detail.productColor))).map((color, index) => (
            <option key={index} value={color}>
              {color}
            </option>
          ))}
        </select>
        <p>선택된 색상: <strong>{selectedColor}</strong></p>
      </div>

      {/* ✅ 수량 선택 */}
      <div className="quantity-selection">
        <label>수량 선택:</label>
        <button onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}>-</button>
        <input type="number" value={quantity} min="1" readOnly />
        <button onClick={() => setQuantity((prev) => prev + 1)}>+</button>
      </div>

      {/* ✅ 장바구니 및 결제 버튼 */}
      <div className="cart-buttons">
        <button className="add-to-cart" onClick={handleAddToCart}>
          장바구니 담기
        </button>
        <button className="checkout" onClick={handleCheckout}>
          결제하기
        </button>
      </div>

      {/* 제품 상세 정보 */}
      <div className="product-details">
        <h3>제품 상세 정보</h3>
        <table>
          <thead>
            <tr>
              <th>색상</th>
              <th>재고</th>
              <th>판매점 위치</th>
            </tr>
          </thead>
          <tbody>
            {productDetails.map((detail, index) => (
              <tr key={index} className={selectedColor === detail.productColor ? "selected-row" : ""}>
                <td>{detail.productColor}</td>
                <td>{detail.productCount}개</td>
                <td>{detail.storeLocation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductDetail;
