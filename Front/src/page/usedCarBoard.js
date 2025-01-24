import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/UsedCar.css'; // CSS 파일 적용

const UsedCarBoard = () => {
    const [cars, setCars] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedYearRange, setSelectedYearRange] = useState({ min: "", max: "" });
    const [selectedKmRange, setSelectedKmRange] = useState({ min: "", max: "" });
    const [selectedFuels, setSelectedFuels] = useState([]);
    const [selectedTransmissions, setSelectedTransmissions] = useState([]);
    const [selectedDriveTypes, setSelectedDriveTypes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
    const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
    const [isFuelDropdownOpen, setIsFuelDropdownOpen] = useState(false);
    const [isTransmissionDropdownOpen, setIsTransmissionDropdownOpen] = useState(false);
    const [isDriveTypeDropdownOpen, setIsDriveTypeDropdownOpen] = useState(false);

    const itemsPerPage = 12;

    const brands = ['현대', '기아', '제네시스', '쉐보레(GM대우)', '르노코리아(삼성)', 'KG모빌리티(쌍용)'];
    const fuelOptions = [
        "가솔린", "디젤", "LPG", "가솔린+LPG", "가솔린+전기", "디젤+전기",
        "LPG+전기", "전기", "가솔린+CNG", "LNG", "CNG", "수소전기", "기타"
    ];
    const transmissionOptions = ["오토", "수동", "세미오토", "CVT", "기타"];
    const driveTypeOptions = ["전륜", "후륜", "4륜"];

    useEffect(() => {
        axios.get('http://localhost:9999/used-cars/getAllUsedCars')
            .then((response) => {
                setCars(response.data);
            })
            .catch((error) => {
                console.error('Failed to fetch used cars:', error);
            });
    }, []);

    const filteredCars = cars.filter((car) => {
        const matchesBrand =
            selectedBrands.length === 0 || selectedBrands.includes(car.brand);

        const matchesColor =
            selectedColors.length === 0 || selectedColors.includes(car.color);

        const matchesFuel =
            selectedFuels.length === 0 || selectedFuels.includes(car.fuelType);

        const matchesTransmission =
            selectedTransmissions.length === 0 || selectedTransmissions.includes(car.transmission);

        const matchesDriveType =
            selectedDriveTypes.length === 0 || selectedDriveTypes.includes(car.driveType);

        return matchesBrand && matchesColor && matchesFuel && matchesTransmission && matchesDriveType;
    });

    const paginatedCars = filteredCars.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => setCurrentPage(page);

    return (
        <div className="used-car-board">
            <header className="header">
                <h1>중고차 목록</h1>
            </header>

            <div className="content">
                <aside className="sidebar">
                    <h2>필터</h2>

                    {/* 브랜드 필터 (드롭다운) */}
                    <h3 onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}>
                        브랜드 {isBrandDropdownOpen ? "▲" : "▼"}
                    </h3>
                    {isBrandDropdownOpen && (
                        <div className="dropdown-menu">
                            {brands.map((brand) => (
                                <button
                                    key={brand}
                                    className={selectedBrands.includes(brand) ? "selected" : ""}
                                    onClick={() => {
                                        setSelectedBrands((prev) =>
                                            prev.includes(brand)
                                                ? prev.filter((b) => b !== brand)
                                                : [...prev, brand]
                                        );
                                    }}
                                >
                                    {brand}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* 색상 필터 (드롭다운, 색상 박스) */}
                    <h3 onClick={() => setIsColorDropdownOpen(!isColorDropdownOpen)}>
                        색상 {isColorDropdownOpen ? "▲" : "▼"}
                    </h3>
                    {isColorDropdownOpen && (
                        <div className="dropdown-menu">
                            {[...new Set(cars.map((car) => car.color))].map((color) => (
                                <div
                                    key={color}
                                    className={`color-box ${selectedColors.includes(color) ? 'selected' : ''}`}
                                    style={{
                                        backgroundColor: color.toLowerCase(),
                                        width: "30px",
                                        height: "30px",
                                        border: "1px solid #ccc",
                                        display: "inline-block",
                                        margin: "5px",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => {
                                        setSelectedColors((prev) =>
                                            prev.includes(color)
                                                ? prev.filter((c) => c !== color)
                                                : [...prev, color]
                                        );
                                    }}
                                ></div>
                            ))}
                        </div>
                    )}

                    {/* 연료 필터 (드롭다운) */}
                    <h3 onClick={() => setIsFuelDropdownOpen(!isFuelDropdownOpen)}>
                        연료 {isFuelDropdownOpen ? "▲" : "▼"}
                    </h3>
                    {isFuelDropdownOpen && (
                        <div className="dropdown-menu">
                            {fuelOptions.map((fuel) => (
                                <button
                                    key={fuel}
                                    className={selectedFuels.includes(fuel) ? "selected" : ""}
                                    onClick={() => {
                                        setSelectedFuels((prev) =>
                                            prev.includes(fuel)
                                                ? prev.filter((f) => f !== fuel)
                                                : [...prev, fuel]
                                        );
                                    }}
                                >
                                    {fuel}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* 변속기 필터 (드롭다운) */}
                    <h3 onClick={() => setIsTransmissionDropdownOpen(!isTransmissionDropdownOpen)}>
                        변속기 {isTransmissionDropdownOpen ? "▲" : "▼"}
                    </h3>
                    {isTransmissionDropdownOpen && (
                        <div className="dropdown-menu">
                            {transmissionOptions.map((transmission) => (
                                <button
                                    key={transmission}
                                    className={selectedTransmissions.includes(transmission) ? "selected" : ""}
                                    onClick={() => {
                                        setSelectedTransmissions((prev) =>
                                            prev.includes(transmission)
                                                ? prev.filter((t) => t !== transmission)
                                                : [...prev, transmission]
                                        );
                                    }}
                                >
                                    {transmission}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* 구동방식 필터 (드롭다운) */}
                    <h3 onClick={() => setIsDriveTypeDropdownOpen(!isDriveTypeDropdownOpen)}>
                        구동방식 {isDriveTypeDropdownOpen ? "▲" : "▼"}
                    </h3>
                    {isDriveTypeDropdownOpen && (
                        <div className="dropdown-menu">
                            {driveTypeOptions.map((type) => (
                                <button
                                    key={type}
                                    className={selectedDriveTypes.includes(type) ? "selected" : ""}
                                    onClick={() => {
                                        setSelectedDriveTypes((prev) =>
                                            prev.includes(type)
                                                ? prev.filter((d) => d !== type)
                                                : [...prev, type]
                                        );
                                    }}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    )}
                </aside>

                <main className="car-list">
                    {paginatedCars.length > 0 ? (
                        paginatedCars.map((car, index) => (
                            <div key={index} className="car-card">
                                <h3>{car.vehicleName}</h3>
                                <p>브랜드: {car.brand}</p>
                                <p>색상: {car.color}</p>
                                <p>연료: {car.fuelType}</p>
                                <p>변속기: {car.transmission}</p>
                                <p>구동방식: {car.driveType}</p>
                                <p>주행 거리: {car.car_km.toLocaleString()} km</p>
                            </div>
                        ))
                    ) : (
                        <p>조건에 맞는 차량이 없습니다.</p>
                    )}
                </main>
            </div>

            {/* 페이지네이션 */}
            <div className="pagination">
                {Array.from(
                    { length: Math.ceil(filteredCars.length / itemsPerPage) },
                    (_, i) => i + 1
                ).map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        disabled={page === currentPage}
                    >
                        {page}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default UsedCarBoard;
