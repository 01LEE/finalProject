import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/UsedCarDetail.css';

// CarPurchaseDetails 컴포넌트
const CarPurchaseDetails = ({ carDetails }) => {
    const formatPrice = (price) => {
        if (typeof price === "string") return price; // "무료배송" 같은 텍스트 처리
        return price.toLocaleString() + "원";
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
                    <li>
                        <strong>차량가:</strong> {formatPrice(carDetails.purchaseDetails.vehiclePrice)}
                    </li>
                    <li>
                        <strong>이전등록비:</strong> {formatPrice(carDetails.purchaseDetails.transferTax)}
                    </li>
                    <li>
                        <strong>관리비용:</strong> {formatPrice(carDetails.purchaseDetails.managementFee)}
                    </li>
                    <li>
                        <strong>등록신청대행수수료:</strong> {formatPrice(carDetails.purchaseDetails.registrationFee)}
                    </li>
                    <li>
                        <strong>K Car Warranty 가입비:</strong> {formatPrice(carDetails.purchaseDetails.warrantyFee)}
                    </li>
                    <li>
                        <strong>성능책임보험료:</strong> {formatPrice(carDetails.purchaseDetails.performanceInsurance)}
                    </li>
                    <li>
                        <strong>배송비:</strong> {formatPrice(carDetails.purchaseDetails.deliveryFee)}
                    </li>
                </ul>
                <div className="total-price">합계: {formatPrice(carDetails.totalPrice)}</div>
            </div>
            <div className="purchase-buttons">
                <button className="home-service">홈서비스 바로구매</button>
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

    useEffect(() => {
        axios
            .get(`http://localhost:9999/used-cars/detail?vehicleNo=${vehicleNo}`)
            .then((response) => {
                setCar(response.data);

                if (response.data.usedCarImage) {
                    const images = response.data.usedCarImage.split(',');
                    setMainImage(images[0]);
                    setAdditionalImages(images);
                    setCurrentIndex(0);
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
                    {mainImage && (
                        <>
                            <img
                                src={`http://localhost:9999${mainImage}`}
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
                    )}
                </div>

                <div className="thumbnail-container">
                    {additionalImages.map((image, index) => (
                        <img
                            key={index}
                            src={`http://localhost:9999${image}`}
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
                    <li>
                        <strong>브랜드:</strong> {car.brand}
                    </li>
                    <li>
                        <strong>연식:</strong> {car.modelYear}년
                    </li>
                    <li>
                        <strong>가격:</strong> ₩{car.price.toLocaleString()}
                    </li>
                    <li>
                        <strong>색상:</strong> {car.color}
                    </li>
                    <li>
                        <strong>주행 거리:</strong> {car.car_km ? `${car.car_km.toLocaleString()} km` : '정보 없음'}
                    </li>
                    <li>
                        <strong>인승:</strong> {car.seatingCapacity}인승
                    </li>
                    <li>
                        <strong>차종:</strong> {car.vehicleType}
                    </li>
                    <li>
                        <strong>변속기:</strong> {car.transmission}
                    </li>
                    <li>
                        <strong>구동방식:</strong> {car.driveType}
                    </li>
                    <li>
                        <strong>연료:</strong> {car.fuelType}
                    </li>
                    <li>
                        <strong>판매점:</strong> {car.dealerLocation}
                    </li>
                    <li>
                        <strong>차량 번호:</strong> {car.vehiclePlate}
                    </li>
                </ul>
            </div>

            <CarPurchaseDetails carDetails={carDetails} />

            <div className="action-buttons">
                <button onClick={handleEdit} className="edit-button">
                    수정하기
                </button>
                <button onClick={() => navigate('/used-cars')} className="back-button">
                    목록으로 돌아가기
                </button>
            </div>
        </div>
    );
};

export default CarDetail;
