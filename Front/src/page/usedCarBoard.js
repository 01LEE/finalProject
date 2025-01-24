import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/UsedCar.css'; // CSS 파일 적용

const UsedCarBoard = () => {
    const [cars, setCars] = useState([]); // 중고차 데이터를 저장할 상태
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // 필터 상태
    const [filters, setFilters] = useState({
        brand: '',
        modelYear: '',
        minPrice: '',
        maxPrice: '',
    });

    // 데이터 로드
    useEffect(() => {
        fetchCars();
    }, [filters]);

    const fetchCars = () => {
        // 빈 값 제거
        const queryParams = new URLSearchParams(
            Object.entries(filters).filter(([_, value]) => value !== '')
        ).toString();
    
        axios.get(`http://localhost:9999/used-cars/getAllUsedCars${queryParams ? `?${queryParams}` : ''}`)
            .then((response) => {
                setCars(response.data); // API 호출 성공 시 데이터 저장
            })
            .catch((error) => {
                console.error('Failed to fetch used cars:', error);
            });
    };

    // 필터 상태 변경 핸들러
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 현재 페이지의 차량 데이터
    const paginatedCars = cars.slice(
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
                    <label>
                        브랜드:
                        <select name="brand" onChange={handleFilterChange} value={filters.brand}>
                            <option value="">전체</option>
                            <option value="현대">현대</option>
                            <option value="기아">기아</option>
                            <option value="제네시스">제네시스</option>
                            <option value="쉐보레(GM대우)">쉐보레(GM대우)</option>
                            <option value="르노코리아(삼성)">르노코리아(삼성)</option>
                            <option value="KG모빌리티(쌍용)">KG모빌리티(쌍용)</option>
                        </select>
                    </label>

                    {/* 연식 필터 */}
                    <label>
                        연식:
                        <select name="modelYear" onChange={handleFilterChange} value={filters.modelYear}>
                            <option value="">전체</option>
                            {Array.from(new Set(cars.map((car) => car.modelYear))).sort((a, b) => b - a).map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </label>

                    {/* 가격 필터 */}
                    <label>
                        최소 가격:
                        <input
                            type="number"
                            name="minPrice"
                            placeholder="예: 10000000"
                            onChange={handleFilterChange}
                            value={filters.minPrice}
                        />
                    </label>
                    <label>
                        최대 가격:
                        <input
                            type="number"
                            name="maxPrice"
                            placeholder="예: 50000000"
                            onChange={handleFilterChange}
                            value={filters.maxPrice}
                        />
                    </label>
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
                        <p>등록된 차량이 없습니다.</p>
                    )}
                </main>
            </div>

            {/* 페이지네이션 */}
            <div className="pagination">
                {Array.from(
                    { length: Math.ceil(cars.length / itemsPerPage) },
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