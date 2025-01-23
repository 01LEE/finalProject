import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/UsedCar.css'; // CSS 파일 적용

const UsedCarBoard = () => {
    const [cars, setCars] = useState([]); // 중고차 데이터를 저장할 상태
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedYears, setSelectedYears] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // 데이터 로드
    useEffect(() => {
        axios.get('http://localhost:9999/used-cars/getAllUsedCars')
            .then((response) => {
                setCars(response.data); // API 호출 성공 시 데이터 저장
            })
            .catch((error) => {
                console.error('Failed to fetch used cars:', error);
            });
    }, []);

    // 필터링 로직
    const filteredCars = cars.filter((car) => {
        const matchesBrand =
            selectedBrands.length === 0 || selectedBrands.includes(car.brand);
        const matchesYear =
            selectedYears.length === 0 || selectedYears.includes(car.modelYear.toString());
        const matchesColor =
            selectedColors.length === 0 || selectedColors.includes(car.color);

        return matchesBrand && matchesYear && matchesColor;
    });

    // 현재 페이지의 차량 데이터
    const paginatedCars = filteredCars.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // 페이지 변경 핸들러
    const handlePageChange = (page) => setCurrentPage(page);

    return (
        <div className="used-car-board">
            <header className="header">
                <h1>중고차 목록</h1>
            </header>

            <div className="content">
                <aside className="sidebar">
                    <h2>필터</h2>

                    {/* 브랜드 필터 */}
                    <h3>브랜드</h3>
                    {['현대', '기아', '제네시스', '쉐보레(GM대우)', '르노코리아(삼성)', 'KG모빌리티(쌍용)'].map((brand) => (
                        <label key={brand}>
                            <input
                                type="checkbox"
                                onChange={() => {
                                    setSelectedBrands((prev) =>
                                        prev.includes(brand)
                                            ? prev.filter((b) => b !== brand)
                                            : [...prev, brand]
                                    );
                                }}
                                checked={selectedBrands.includes(brand)}
                            />
                            {brand}
                        </label>
                    ))}

                    {/* 연식 필터 */}
                    <h3>연식</h3>
                    {[...new Set(cars.map((car) => car.modelYear))].sort((a, b) => b - a).map((year) => (
                        <label key={year}>
                            <input
                                type="checkbox"
                                onChange={() => {
                                    setSelectedYears((prev) =>
                                        prev.includes(year.toString())
                                            ? prev.filter((y) => y !== year.toString())
                                            : [...prev, year.toString()]
                                    );
                                }}
                                checked={selectedYears.includes(year.toString())}
                            />
                            {year}
                        </label>
                    ))}

                    {/* 색상 필터 */}
                    <h3>색상</h3>
                    {[...new Set(cars.map((car) => car.color))].map((color) => (
                        <div
                            key={color}
                            className={`color-box ${selectedColors.includes(color) ? 'selected' : ''}`}
                            style={{ backgroundColor: color.toLowerCase() }}
                            onClick={() => {
                                setSelectedColors((prev) =>
                                    prev.includes(color)
                                        ? prev.filter((c) => c !== color)
                                        : [...prev, color]
                                );
                            }}
                        ></div>
                    ))}
                </aside>

                <main className="car-list">
                    {paginatedCars.length > 0 ? (
                        paginatedCars.map((car, index) => (
                            <div key={index} className="car-card">
                                <h3>{car.vehicleName}</h3>
                                <p>브랜드: {car.brand}</p>
                                <p>연식: {car.modelYear}년</p>
                                <p>가격: ₩{car.price.toLocaleString()}</p>
                                <p>색상: {car.color}</p>
                                <p>주행 거리: {car.car_km} km</p>
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
