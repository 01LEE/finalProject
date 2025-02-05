import { useEffect } from "react";
import apiAxios from "../lib/apiAxios"; // axios 인스턴스

const PaymentTest = () => {
    useEffect(() => {
        if (typeof window.IMP === "undefined") {
            console.error("🚨 IMP 객체가 로드되지 않았습니다.");
            return;
        }

        const IMP = window.IMP;
        console.log("✅ IMP 객체 확인:", IMP);

        IMP.init("iamport03m");
        console.log("✅ IMP.init 실행 완료:", IMP.init("iamport03m"));

        setTimeout(() => {
            console.log("🚀 결제 요청 시작...");
            IMP.request_pay(
                {
                    pg: "html5_inicis", // `pg` 값 다시 확인
                    pay_method: "card",
                    merchant_uid: `order_${new Date().getTime()}`,
                    name: "테스트 결제",
                    amount: 100,
                    buyer_email: "test@example.com",
                    buyer_name: "홍길동",
                    buyer_tel: "010-1234-5678",
                    buyer_addr: "서울특별시 강남구 테헤란로",
                    buyer_postcode: "12345",
                },
                async (rsp) => {
                    if (rsp.success) {
                        alert("✅ 결제 성공!");
                        console.log("✅ 결제 성공 데이터:", rsp);
                    } else {
                        alert("❌ 결제 실패: " + rsp.error_msg);
                    }
                }
            );
        }, 1000); // 1초 대기 후 실행
    }, []);




    return <button onClick={() => window.location.reload()}>결제 테스트</button>;
};

export default PaymentTest;
