import { useEffect } from "react";
import Apiaxios from "../lib/apiAxios";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const PaymentTest = ({ payAmount, customerUid, setCustomerUid }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const navigate = useNavigate();
    const [userData, setUserData] = useState();

    console.log("customerUid : ", customerUid);
    console.log("amount : ", payAmount);
    console.log("setCustomerUid : ", setCustomerUid);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }

        if (!window.IMP) {
            console.error("🚨 IMP 객체가 로드되지 않았습니다.");
            return;
        }

        const IMP = window.IMP;
        IMP.init("imp82100437"); // 포트원 가맹점 식별코드

        console.log("✅ IMP.init 실행 완료:", IMP);
    }, []);




    //  빌링키 발급 (최초 결제)
    const handleBillingKey = () => {
        const IMP = window.IMP;
        const uid = `customer_${new Date().getTime()}`;


        Apiaxios.post("/api/payment/paymentUser")
            .then((res) => {
                const userData = res.data;
                setUserData(userData);
                if (!res) {
                    alert("사용자 정보를 불러올 수 없습니다.");
                    return;
                }

                console.log("사용자 정보 : ", userData);
            

        IMP.request_pay({
            pg: "tosspayments",
            pay_method: "card",
            merchant_uid: `order_${new Date().getTime()}`,
            name: "포인트 충전",
            amount: payAmount,
            buyer_email: userData.email,
            buyer_name: userData.name,
            buyer_tel: userData.phone,
            customer_uid: uid, // 빌링키 발급을 위한 고객 UID 추가
        }, async function (rsp) {
            if (rsp.success) {
                console.log("빌링키 발급 성공", rsp);
                setCustomerUid(uid); // 빌링키 저장

                Apiaxios.post("/api/payment/registerCustomer", { customerUid: uid })
                    .then((res) => console.log("고객 등록 성공:", res.data))
                    .catch((err) => console.error("고객 등록 실패:", err));

                alert("빌링키 발급 성공하였습니다. 이후 자동결제가 가능합니다.");
            } else {
                console.log("빌링키 발급 실패:", rsp.error_msg);
            }
        });
    })
        .catch((err) => {
            console.error("사용자 정보를 불러오는 중 오류:", err);
        });
    };

    const handleAutoPayment = () => {
        if (!customerUid) {
            alert("먼저 빌링키를 발급해야 합니다!");
            return;
        }

        console.log("결제할 금액 : ", payAmount);

        Apiaxios.post("/api/payment/autoPayment",
            JSON.stringify({
                customerUid,
                name: "포인트 충전",
                buyer_name: userData.name,
                buyer_email: userData.email,
                buyer_phone: userData.phone,
                amount: payAmount
            }),
            {
                headers: { "Content-Type": "application/json" }
            }
        )
            .then((res) => {
                if (res.data.code === 0) {
                    alert("자동 결제 성공!");
                    window.location.reload();
                } else {
                    alert("자동 결제 실패: " + res.data.error);
                }
            })
            .catch((err) => {
                alert("자동 결제 실패: " + err);
            });
    };


    return (
        <div className="payment-buttons">
            <button onClick={handleBillingKey}>💳 빌링키 발급 (최초 결제)</button>
            <button onClick={handleAutoPayment} disabled={!customerUid}>🔄 자동 결제 실행</button>
        </div>
    );
};

export default PaymentTest;
