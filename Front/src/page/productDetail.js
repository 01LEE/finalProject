import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import apiAxios from "../lib/apiAxios";
import "../css/productDetail.css";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // 상태 관리
  const [product, setProduct] = useState(null);
  const [productDetails, setProductDetails] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  // ✅ 제품 정보 + 상세 정보 가져오는 API 호출
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await apiAxios.get(`/shopping/product/${productId}/details`, {
          withCredentials: true,
        });

        console.log("✅ API 응답 데이터:", response.data);

        if (response.data.length > 0) {
          const { productId, productName, productPrice, productImage } = response.data[0];

          setProduct({
            productId,
            productName,
            productPrice,
            productImage,
          });

          setProductDetails(response.data);

          const uniqueColors = [...new Set(response.data.map((detail) => detail.productColor))];
          if (uniqueColors.length > 0) {
            setSelectedColor(uniqueColors[0]); // 기본 선택 값 설정
          }
        }
      } catch (error) {
        console.error("❌ API 요청 실패:", error.response ? error.response.data : error.message);
        setError("제품 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  // ✅ 장바구니 담기 핸들러
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert("장바구니에 담으려면 로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    if (!product || !product.productName) {
      alert("상품 정보가 없습니다. 다시 시도해주세요.");
      return;
    }

    try {
      let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

      const existingProductIndex = cartItems.findIndex(
        (item) => item.productId === product.productId && item.productColor === selectedColor
      );

      if (existingProductIndex !== -1) {
        cartItems[existingProductIndex].quantity += quantity;
      } else {
        cartItems.push({
          productId: product.productId,
          productName: product.productName,
          productPrice: product.productPrice,
          productColor: selectedColor,
          productImage: product.productImage,
          quantity,
        });
      }

      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      alert(`"${product.productName}" 장바구니에 추가되었습니다!`);
    } catch (error) {
      console.error("장바구니 추가 오류:", error);
      alert("장바구니 추가 중 오류가 발생했습니다.");
    }
  };

  // ✅ 수량 변경 핸들러
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  // ✅ 개별 결제 기능 (즉시 결제)
  const handlePayment = async () => {
    if (!isAuthenticated) {
      alert("결제를 진행하려면 로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    const requestData = [{
      productId: product.productId,
      productName: product.productName || "알 수 없음",
      productAllPrice: product.productPrice * quantity,
      productColor: selectedColor,
      productCount: quantity
    }];

    console.log("📌 백엔드로 보낼 결제 데이터:", requestData);

    try {
      const response = await fetch("http://localhost:9999/shopping/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(requestData),
      });

      const contentType = response.headers.get("content-type");

      // ✅ JSON 응답이 아닐 경우 예외 처리
      if (!contentType || !contentType.includes("application/json")) {
        const errorText = await response.text();
        console.error("❌ 서버 응답이 JSON이 아닙니다:", errorText);
        throw new Error("서버에서 잘못된 응답을 반환했습니다.");
      }

      const result = await response.json();
      console.log("✅ 결제 요청 응답:", result);

      if (result.error) {
        alert(`❌ 결제 오류: ${result.error}`);
        return;
      }

      alert(`✅ 결제가 완료되었습니다.`);
      navigate("/shopping/payment/success");

    } catch (error) {
      console.error("❌ 결제 오류:", error);
      alert("❌ 결제 처리 중 오류가 발생했습니다.");
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
    <div className="product-detail-page">
      {product && (
        <div className="product-info">
          <h2>{product.productName || "상품명 없음"}</h2>
          <p>가격: {product.productPrice ? product.productPrice.toLocaleString() + "원" : "가격 정보 없음"}</p>
          {product.productImage && <img src={product.productImage} alt={product.productName} className="product-image" />}
        </div>
      )}

      {/* ✅ 색상 선택 */}
      <div className="color-selection">
        <label htmlFor="colorSelect">색상 선택:</label>
        <select id="colorSelect" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>
          {Array.from(new Set(productDetails.map((detail) => detail.productColor))).map((color, index) => (
            <option key={index} value={color}>{color}</option>
          ))}
        </select>
      </div>

      {/* ✅ 수량 선택 */}
      <div className="quantity-selection">
        <label>수량 선택:</label>
        <button onClick={() => handleQuantityChange(quantity - 1)}>-</button>
        <input type="number" value={quantity} min="1" readOnly />
        <button onClick={() => handleQuantityChange(quantity + 1)}>+</button>
      </div>

      {/* ✅ 장바구니 및 결제 버튼 */}
      <div className="cart-buttons">
        <button className="add-to-cart" onClick={handleAddToCart}>장바구니 담기</button>
        <button className="checkout" onClick={handlePayment}>즉시 결제</button>
      </div>
    </div>
  );
};

export default ProductDetail;
