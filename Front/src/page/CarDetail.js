import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/UsedCarDetail.css';

// 서버의 실제 주소 상수 선언
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

// CarPurchaseDetails 컴포넌트
const CarPurchaseDetails = ({ carDetails }) => {
    const navigate = useNavigate();

    const handlePurchase = () => {
        // "차량 바로구매" 클릭 시, /used-cars/CarPointSettlement 페이지로 이동
        // 이때 carDetails를 state로 함께 넘김
        navigate('/CarPaymentdetaile', {
          state: { carDetails }
        });
      };


    

    return (
        <div className="purchase-details">
            <div className="phone">{carDetails.phone}</div>
            <div className="name">{carDetails.name}</div>
            <div className="info">{`${carDetails.year} · ${carDetails.mileage} · ${carDetails.fuelType}`}</div>
            <div className="cost-breakdown">
                <h3>총 예상 구매비용</h3>
                <p>구매비용 계산기</p>
                <ul>
                    <li><strong>차량가:</strong> {carDetails.purchaseDetails.vehiclePrice.toLocaleString()}원</li>
                    <li><strong>이전등록비:</strong> {carDetails.purchaseDetails.transferTax.toLocaleString()}원</li>
                    <li><strong>관리비용:</strong> {carDetails.purchaseDetails.managementFee.toLocaleString()}원</li>
                    <li><strong>등록신청대행수수료:</strong> {carDetails.purchaseDetails.registrationFee.toLocaleString()}원</li>
                    <li><strong>K Car Warranty 가입비:</strong> {carDetails.purchaseDetails.warrantyFee.toLocaleString()}원</li>
                    <li><strong>성능책임보험료:</strong> {carDetails.purchaseDetails.performanceInsurance.toLocaleString()}원</li>
                    <li><strong>배송비:</strong> {carDetails.purchaseDetails.deliveryFee}</li>
                </ul>
                <div className="total-price">합계: {carDetails.totalPrice.toLocaleString()}원</div>
            </div>
            <div className="purchase-buttons">
            <button className="home-service" onClick={handlePurchase}>차량 바로구매</button>
                <div className="availability">{carDetails.availability}</div>
                <button className="direct-visit">직영점 방문 예약하기</button>
            </div>
        </div>
    );
};

const CarDetail = () => {
    const { vehicleNo } = useParams();
    const [car, setCar] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [additionalImages, setAdditionalImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();
    const [openFAQ, setOpenFAQ] = useState(null);

    useEffect(() => {
        axios
            .get(`${SERVER_URL}/used-cars/detail?vehicleNo=${vehicleNo}`)
            .then((response) => {
                console.log("차량 데이터:", response.data);
                setCar(response.data);

                if (response.data.usedCarImages && response.data.usedCarImages.length > 0) {
                    console.log("이미지 데이터:", response.data.usedCarImages);
    
                    // 대표 이미지 설정 (mainImage === 'Y' 인 이미지가 있다면 사용)
                    const mainImg = response.data.usedCarImages.find(img => img.mainImage === 'Y');
                    setMainImage(
                        mainImg 
                        ? `${SERVER_URL}${mainImg.imageUrl}` 
                        : `${SERVER_URL}${response.data.usedCarImages[0].imageUrl}`
                    );
    
                    // 추가 이미지 리스트 설정
                    setAdditionalImages(response.data.usedCarImages.map(img => `${SERVER_URL}${img.imageUrl}`));
                    setCurrentIndex(0);
                } else {
                    console.warn(" 차량 이미지 없음");
                }
            })
            .catch((error) => {
                console.error('Failed to fetch car details:', error);
            });
    }, [vehicleNo]);

    const handleNextImage = () => {
        const nextIndex = (currentIndex + 1) % additionalImages.length;
        setMainImage(additionalImages[nextIndex]);
        setCurrentIndex(nextIndex);
    };

    const handlePrevImage = () => {
        const prevIndex = (currentIndex - 1 + additionalImages.length) % additionalImages.length;
        setMainImage(additionalImages[prevIndex]);
        setCurrentIndex(prevIndex);
    };

    const handleEdit = () => {
        navigate(`/used-cars/UpdateCar/${vehicleNo}`);
    };

    if (!car) {
        return <p>로딩 중...</p>;
    }



    const faqData = [
        { question: "내차사기 홈서비스란 무엇인가요?", answer: "내차사기 홈서비스는 온라인으로 차량을 선택하고 집 앞까지 배송받을 수 있는 서비스입니다." },
        { question: "내차사기 홈서비스 신청은 어떻게 하나요?", answer: "홈페이지에서 차량을 선택한 후 결제하면 간편하게 신청이 완료됩니다." },
        { question: "내차사기 홈서비스 결제는 어떻게 하나요?", answer: "신용카드, 계좌이체 등 다양한 결제 방법을 지원합니다." },
        { question: "내차사기 홈서비스로 주문하면 어디든지 배송되나요?", answer: "일부 지역을 제외한 전국 배송이 가능합니다." }
    ];
    
    const toggleFAQ = (index) => setOpenFAQ(openFAQ === index ? null : index);

    

    const carDetails = {
        phone: "0504-3184-3359",
        name: car.vehicleName,
        year: `${car.modelYear}년`,
        mileage: car.car_km ? `${car.car_km.toLocaleString()} km` : "정보 없음",
        fuelType: car.fuelType,
        purchaseDetails: {
            vehiclePrice: car.price,
            transferTax: 460000,
            managementFee: 352000,
            registrationFee: 33000,
            warrantyFee: 365000,
            performanceInsurance: 0,
            deliveryFee: "무료배송",
        },
        totalPrice: car.price + 460000 + 352000 + 33000 + 365000,
        availability: "금요일 1/31 도착",
    };

    return (
        <div className="car-detail-container">
            <h1 className="car-title">{car.vehicleName}</h1>

            <div className="image-section">
                <div className="main-image-container">
                    {mainImage ? (
                        <>
                            <img
                                src={mainImage}
                                onError={(e) => e.target.src = "/default-image.png"}
                                alt={`${car.vehicleName} 대표 이미지`}
                                className="main-image"
                            />
                            <button onClick={handlePrevImage} className="arrow-button left-arrow">
                                ❮
                            </button>
                            <button onClick={handleNextImage} className="arrow-button right-arrow">
                                ❯
                            </button>
                        </>
                    ) : (
                        <p>이미지를 불러오는 중...</p>
                    )}
                </div>

                <div className="thumbnail-container">
                    {additionalImages.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`${car.vehicleName} 추가 이미지 ${index + 1}`}
                            className={`thumbnail-image ${currentIndex === index ? 'selected-thumbnail' : ''}`}
                            onClick={() => {
                                setMainImage(image);
                                setCurrentIndex(index);
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="car-details">
                <h2>차량 정보</h2>
                <ul>
                    <li><strong>브랜드:</strong> {car.brand}</li>
                    <li><strong>연식:</strong> {car.modelYear}년</li>
                    <li><strong>가격:</strong> ₩{car.price.toLocaleString()}</li>
                    <li><strong>색상:</strong> {car.color}</li>
                    <li><strong>주행 거리:</strong> {car.car_km ? `${car.car_km.toLocaleString()} km` : '정보 없음'}</li>
                    <li><strong>인승:</strong> {car.seatingCapacity}인승</li>
                    <li><strong>차종:</strong> {car.vehicleType}</li>
                    <li><strong>변속기:</strong> {car.transmission}</li>
                    <li><strong>구동방식:</strong> {car.driveType}</li>
                    <li><strong>연료:</strong> {car.fuelType}</li>
                    <li><strong>판매점:</strong> {car.dealerLocation}</li>
                    <li><strong>차량 번호:</strong> {car.vehiclePlate}</li>
                </ul>
            </div>
            <div className="car-description">
                <h2>차량 설명</h2>
                <div dangerouslySetInnerHTML={{ __html: car.description || "설명 정보가 없습니다." }} />
            </div>



            <CarPurchaseDetails carDetails={carDetails} />

            <div className="faq-section">
                <h2>자주 하는 질문</h2>
                {faqData.map((faq, index) => (
                    <div key={index} className="faq-item">
                        <button className="faq-question" onClick={() => toggleFAQ(index)}>
                            {faq.question}
                        </button>
                        {openFAQ === index && <p className="faq-answer">{faq.answer}</p>}
                    </div>
                ))}
            </div>
            <div className="action-buttons">
                <button onClick={() => navigate('/UsedCarBoard')} className="back-button">
                    목록으로 돌아가기
                </button>
            </div>
        </div>
    );
};

export default CarDetail;
