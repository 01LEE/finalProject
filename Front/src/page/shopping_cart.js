import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // ✅ 장바구니 항목을 로컬 스토리지에서 불러오기
  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems") || "[]").map(item => ({
      ...item,
      productName: item.productName || "알 수 없음",
      productPrice: Number(item.productPrice) || 0,
      quantity: Number(item.quantity) || 1
    }));

    console.log("불러온 장바구니 데이터:", storedCartItems);
    setCartItems(storedCartItems);
  }, []);

  // ✅ 결제 요청 핸들러
  const handlePayment = async () => {
    if (cartItems.length === 0) {
        alert("장바구니가 비어 있습니다.");
        return;
    }

    const requestData = cartItems.map(item => ({
        productId: item.productId,
        productName: item.productName || "알 수 없음",
        productAllPrice: item.productPrice * item.quantity,
        productColor: item.productColor,
        productCount: item.quantity
    }));

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
        localStorage.removeItem("cartItems");
        setCartItems([]);
        navigate("/shopping/payment/success");

    } catch (error) {
        console.error("❌ 결제 오류:", error);
        alert("❌ 결제 처리 중 오류가 발생했습니다.");
    }
};

  return (
    <div className="cart-container">
      <h1>장바구니</h1>
      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <div key={item.productId} className="cart-item">
            <img src={item.productImage} alt={item.productName} />
            <div>
              <strong>{item.productName}</strong>
              <p>가격: {item.productPrice.toLocaleString()}원</p>
              <p>색상: {item.productColor}</p>
              <p>수량: {item.quantity}</p>
            </div>
          </div>
        ))
      ) : (
        <p>장바구니에 상품이 없습니다.</p>
      )}

      {cartItems.length > 0 && (
        <div className="total-price">
          <h3>총 금액: {cartItems.reduce((total, item) => total + item.productPrice * item.quantity, 0).toLocaleString()}원</h3>
          <button onClick={() => navigate("/shopping")}>쇼핑 계속하기</button>
          <button onClick={handlePayment}>결제하기</button>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
