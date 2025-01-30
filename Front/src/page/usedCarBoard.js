import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/UsedCar.css';
import { useNavigate } from 'react-router-dom';

const UsedCarBoard = () => {
    const [cars, setCars] = useState([]);
    const [base64Images, setBase64Images] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const [filters, setFilters] = useState({
        vehicleName: '',
        brand: '',
        modelYear: '',
        minKm: '',
        maxKm: '',
        priceRange: '',
        minPrice: '',
        maxPrice: '',
        vehicleType: '',
        fuelType: '',
        driveType: '',
        dealerLocation: '',
        color: '',
        seatingCapacity: '',
        transmission: '',
        sortBy: 'car_km',  // 기본 정렬값
        order: 'asc',  // 기본 오름차순 정렬
    });

    const sortOptions = [
        { label: '적은 주행거리 순', value: 'car_km_asc' },
        { label: '많은 주행거리 순', value: 'car_km_desc' },
        { label: '낮은 가격 순', value: 'price_asc' },
        { label: '높은 가격 순', value: 'price_desc' },
        { label: '최근 연식 순', value: 'model_year_desc' },
        { label: '오래된 연식 순', value: 'model_year_asc' },
    ];

    const handleSearchChange = (e) => {
        setFilters((prev) => ({
            ...prev,
            vehicleName: e.target.value,
        }));
    };

    const handleSortChange = (e) => {
        const selectedValue = e.target.value;
        console.log("🔹 선택한 정렬 값:", selectedValue);
    
        // 선택된 값이 비어있으면 반환
        if (!selectedValue) {
            console.error("❌ 선택된 정렬 값이 없습니다.");
            return;
        }
    
        // 선택된 정렬 값을 언더스코어(_) 기준으로 분리
        const parts = selectedValue.split("_");
    
        console.log("🔍 분리된 값:", parts);
    
        let sortBy, order;
    
        // "car_km_asc" → ["car", "km", "asc"]
        // "model_year_desc" → ["model", "year", "desc"]
        if (parts.length === 3) {
            sortBy = parts[0] + "_" + parts[1]; // "car_km", "model_year"
            order = parts[2]; // "asc", "desc"
        } else if (parts.length === 2) {
            sortBy = parts[0]; // "price"
            order = parts[1]; // "asc", "desc"
        } else {
            console.error("❌ 정렬 값이 올바른 형식이 아닙니다:", selectedValue);
            return;
        }
    
        // order가 "asc" 또는 "desc"가 아닌 경우 예외 처리
        if (!["asc", "desc"].includes(order)) {
            console.error("❌ 잘못된 정렬 order 값:", order);
            return;
        }
    
        console.log("✅ 정렬 변경됨:", { sortBy, order });
    
        setFilters((prev) => ({
            ...prev,
            sortBy,
            order,
        }));
    };
    
    
    

    const priceOptions = [
        { label: '5백만 이하', value: '0-5000000' },
        { label: '1천만 이하', value: '0-10000000' },
        { label: '2천만 이하', value: '0-20000000' },
        { label: '3천만 이하', value: '0-30000000' },
        { label: '4천만 이하', value: '0-40000000' },
        { label: '5천만 이하', value: '0-50000000' },
        { label: '6천만 이하', value: '0-60000000' },
        { label: '7천만 이하', value: '0-70000000' },
        { label: '8천만 이하', value: '0-80000000' },
        { label: '9천만 이하', value: '0-90000000' },
        { label: '1억 이상', value: '100000000-' },
    ];

    const navigate = useNavigate();

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePriceRangeChange = (value) => {
        const [min, max] = value.split('-').map(Number);
        setFilters((prev) => ({
            ...prev,
            priceRange: value,
            minPrice: min,
            maxPrice: max === undefined ? Infinity : max, // 최대값이 없으면 Infinity로 설정
        }));
    };

    const handleColorChange = (color) => {
        setFilters((prev) => ({
            ...prev,
            color: prev.color === color ? '' : color,  // 이미 선택된 색상이면 필터에서 제거
        }));
    };

    const fetchCars = (filterParams) => {
        axios.get('http://localhost:9999/used-cars/getFilteredUsedCars', {
            params: {
                ...filterParams,
                sortBy: filterParams.sortBy || 'car_km', // 기본 정렬 기준 설정
                order: filterParams.order || 'asc', // 기본 정렬 순서 설정
            },
        })
        .then((response) => {
            setCars(response.data);
        })
        .catch((error) => {
            console.error('Failed to fetch used cars:', error);
        });
    };

    const blobToBase64 = (blobUrl) => {
        return new Promise((resolve, reject) => {
            fetch(blobUrl)
                .then((response) => response.blob())
                .then((blob) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result); // Base64 변환 결과 반환
                    reader.onerror = (error) => reject(error); // 에러 처리
                    reader.readAsDataURL(blob);
                })
                .catch((error) => reject(error)); // fetch 에러 처리
        });
    };

    useEffect(() => {
        console.log("필터가 변경되어 API 호출:", filters);
        fetchCars(filters);
    }, [filters]);

    useEffect(() => {
        const filteredParams = { ...filters };
        Object.keys(filteredParams).forEach((key) => {
            if (!filteredParams[key]) {
                delete filteredParams[key];
            }
        });
        fetchCars(filteredParams);  // 필터링된 데이터 요청
    }, [filters]);

    useEffect(() => {
        const fetchBase64Images = async () => {
            const updatedImages = {}; // Base64 이미지 저장용 객체
            for (const car of cars) {
                if (car.mainImage && car.mainImage.startsWith('blob:')) {
                    try {
                        // Blob URL을 Base64로 변환
                        const base64 = await blobToBase64(car.mainImage);
                        updatedImages[car.vehicleNo] = base64; // 차량 번호를 키로 사용해 저장
                    } catch (error) {
                        console.error(`Failed to convert Blob to Base64 for ${car.vehicleNo}:`, error);
                    }
                } else if (car.mainImage) {
                    // Blob이 아닌 일반 URL 처리
                    updatedImages[car.vehicleNo] = `http://localhost:9999${car.mainImage}`;
                }
            }
            setBase64Images(updatedImages); // Base64 이미지를 상태로 업데이트
        };
    
        if (cars.length > 0) {
            fetchBase64Images(); // 차량 데이터가 있으면 Base64 변환 시작
        }
    }, [cars]); // 차량 데이터 변경 시 실행

    const paginatedCars = cars.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => setCurrentPage(page);

    const handleCardClick = (vehicleNo) => {
        navigate(`/used-cars/detail/${vehicleNo}`);
    };

    // 드롭다운 열고 닫는 기능 추가
    const [openDropdown, setOpenDropdown] = useState(null);

    const [allModelYears, setAllModelYears] = useState([]);

    const toggleDropdown = (filterName) => {
        setOpenDropdown(openDropdown === filterName ? null : filterName);
    };

    return (
        <div className="used-car-board">
            <header className="header">
                <h1>중고차 목록</h1>
                <select onChange={(e) => handleSortChange(e)}>
    <option value="">정렬 선택</option>
    {sortOptions.map((option) => (
        <option key={option.value} value={option.value}>
            {option.label}
        </option>
    ))}
</select>
                <input
                    type="text"
                    placeholder="차량명을 입력하세요..."
                    value={filters.vehicleName}
                    onChange={handleSearchChange}
                    className="search-input"
                />
            </header>

            <div className="content">
                <aside className="sidebar">

                    {/* 브랜드 필터 */}
                    <div className="dropdown">
                        <button className="dropdown-toggle" onClick={() => toggleDropdown('brand')}>
                            {filters.brand || '브랜드'} <span className={`arrow ${openDropdown === 'brand' ? 'open' : ''}`}>▼</span>
                        </button>
                        {openDropdown === 'brand' && (
                            <div className="dropdown-menu">
                                <button onClick={() => { setFilters(prev => ({ ...prev, brand: '' })); setOpenDropdown(null); }} className="dropdown-item">
                                    전체
                                </button>
                                {['현대', '기아', '제네시스', '쉐보레(GM대우)', '르노코리아(삼성)'].map((brand) => (
                                    <button key={brand} onClick={() => { setFilters(prev => ({ ...prev, brand })); setOpenDropdown(null); }} className="dropdown-item">
                                        {brand}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

             {/* 연식 필터 */}
             <div className="dropdown">
                        <button className="dropdown-toggle" onClick={() => toggleDropdown('modelYear')}>
                            {filters.modelYear || '연식'} <span className={`arrow ${openDropdown === 'modelYear' ? 'open' : ''}`}>▼</span>
                        </button>
                        {openDropdown === 'modelYear' && (
                            <div className="dropdown-menu">
                                <button onClick={() => { setFilters(prev => ({ ...prev, modelYear: '' })); setOpenDropdown(null); }} className="dropdown-item">
                                    전체
                                </button>
                                {[2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025].map((year) => (
                                    <button key={year} onClick={() => { setFilters(prev => ({ ...prev, modelYear: year })); setOpenDropdown(null); }} className="dropdown-item">
                                        {year}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 가격 범위 필터 */}
                    <div className="dropdown">
                        <button className="dropdown-toggle" onClick={() => toggleDropdown('priceRange')}>
                            {filters.priceRange || '가격'} <span className={`arrow ${openDropdown === 'priceRange' ? 'open' : ''}`}>▼</span>
                        </button>
                        {openDropdown === 'priceRange' && (
                            <div className="dropdown-menu">
                                <button onClick={() => { setFilters(prev => ({ ...prev, priceRange: '', minPrice: '', maxPrice: '' })); setOpenDropdown(null); }} className="dropdown-item">
                                    전체
                                </button>
                                {priceOptions.map((option) => (
                                    <button key={option.value} onClick={() => { handlePriceRangeChange(option.value); setOpenDropdown(null); }} className="dropdown-item">
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 주행 거리 필터 */}
                    <div className="dropdown">
                        <button className="dropdown-toggle" onClick={() => toggleDropdown('minKm')}>
                            {filters.minKm ? `${filters.minKm} km` : '주행 거리(최소)'} <span className={`arrow ${openDropdown === 'minKm' ? 'open' : ''}`}>▼</span>
                        </button>
                        {openDropdown === 'minKm' && (
                            <div className="dropdown-menu">
                                <button onClick={() => { setFilters(prev => ({ ...prev, minKm: '' })); setOpenDropdown(null); }} className="dropdown-item">
                                    전체
                                </button>
                                {[10000, 20000, 30000, 40000, 50000, 60000].map((km) => (
                                    <button key={km} onClick={() => { setFilters(prev => ({ ...prev, minKm: km })); setOpenDropdown(null); }} className="dropdown-item">
                                        {km.toLocaleString()} km
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 최대 주행 거리 필터 */}
                    <div className="dropdown">
                        <button className="dropdown-toggle" onClick={() => toggleDropdown('maxKm')}>
                            {filters.maxKm ? `${filters.maxKm} km` : '주행 거리(최대)'} <span className={`arrow ${openDropdown === 'maxKm' ? 'open' : ''}`}>▼</span>
                        </button>
                        {openDropdown === 'maxKm' && (
                            <div className="dropdown-menu">
                                <button onClick={() => { setFilters(prev => ({ ...prev, maxKm: '' })); setOpenDropdown(null); }} className="dropdown-item">
                                    전체
                                </button>
                                {[80000, 100000, 120000, 140000, 160000, 180000, 200000].map((km) => (
                                    <button key={km} onClick={() => { setFilters(prev => ({ ...prev, maxKm: km })); setOpenDropdown(null); }} className="dropdown-item">
                                        {km.toLocaleString()} km
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 나머지 필터들 */}
                    <div className="dropdown">
                        <button className="dropdown-toggle" onClick={() => toggleDropdown('vehicleType')}>
                            {filters.vehicleType || '차종'} <span className={`arrow ${openDropdown === 'vehicleType' ? 'open' : ''}`}>▼</span>
                        </button>
                        {openDropdown === 'vehicleType' && (
                            <div className="dropdown-menu">
                                <button onClick={() => { setFilters(prev => ({ ...prev, vehicleType: '' })); setOpenDropdown(null); }} className="dropdown-item">
                                    전체
                                </button>
                                {['경차', '소형차', '준중형차', '중형차', '대형차', 'SUV'].map((type) => (
                                    <button key={type} onClick={() => { setFilters(prev => ({ ...prev, vehicleType: type })); setOpenDropdown(null); }} className="dropdown-item">
                                        {type}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="dropdown">
                        <button className="dropdown-toggle" onClick={() => toggleDropdown('seatingCapacity')}>
                            {filters.seatingCapacity || '인승'} <span className={`arrow ${openDropdown === 'seatingCapacity' ? 'open' : ''}`}>▼</span>
                        </button>
                        {openDropdown === 'seatingCapacity' && (
                            <div className="dropdown-menu">
                                <button onClick={() => { setFilters(prev => ({ ...prev, seatingCapacity: '' })); setOpenDropdown(null); }} className="dropdown-item">
                                    전체
                                </button>
                                {['4', '5', '6', '7', '8'].map((seat) => (
                                    <button key={seat} onClick={() => { setFilters(prev => ({ ...prev, seatingCapacity: seat })); setOpenDropdown(null); }} className="dropdown-item">
                                        {seat}인승
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 변속기 필터 */}
                    <div className="dropdown">
                        <button className="dropdown-toggle" onClick={() => toggleDropdown('transmission')}>
                            {filters.transmission || '변속기'} <span className={`arrow ${openDropdown === 'transmission' ? 'open' : ''}`}>▼</span>
                        </button>
                        {openDropdown === 'transmission' && (
                            <div className="dropdown-menu">
                                <button onClick={() => { setFilters(prev => ({ ...prev, transmission: '' })); setOpenDropdown(null); }} className="dropdown-item">
                                    전체
                                </button>
                                {['오토', '수동', '새마오토', 'CVT'].map((type) => (
                                    <button key={type} onClick={() => { setFilters(prev => ({ ...prev, transmission: type })); setOpenDropdown(null); }} className="dropdown-item">
                                        {type}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 연료 필터 */}
                    <div className="dropdown">
                        <button className="dropdown-toggle" onClick={() => toggleDropdown('fuelType')}>
                            {filters.fuelType || '연료'} <span className={`arrow ${openDropdown === 'fuelType' ? 'open' : ''}`}>▼</span>
                        </button>
                        {openDropdown === 'fuelType' && (
                            <div className="dropdown-menu">
                                <button onClick={() => { setFilters(prev => ({ ...prev, fuelType: '' })); setOpenDropdown(null); }} className="dropdown-item">
                                    전체
                                </button>
                                {['휘발유', '경유', '디젤', 'LPG', 'CNG'].map((fuel) => (
                                    <button key={fuel} onClick={() => { handleColorChange(fuel); setOpenDropdown(null); }} className="dropdown-item">
                                        {fuel}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 구동방식 필터 */}
                    <div className="dropdown">
                        <button className="dropdown-toggle" onClick={() => toggleDropdown('driveType')}>
                            {filters.driveType || '구동방식'} <span className={`arrow ${openDropdown === 'driveType' ? 'open' : ''}`}>▼</span>
                        </button>
                        {openDropdown === 'driveType' && (
                            <div className="dropdown-menu">
                                <button onClick={() => { setFilters(prev => ({ ...prev, driveType: '' })); setOpenDropdown(null); }} className="dropdown-item">
                                    전체
                                </button>
                                {['RWD', 'FWD', 'AWD'].map((type) => (
                                    <button key={type} onClick={() => { setFilters(prev => ({ ...prev, driveType: type })); setOpenDropdown(null); }} className="dropdown-item">
                                        {type}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 판매점 필터 */}
                    <div className="dropdown">
                        <button className="dropdown-toggle" onClick={() => toggleDropdown('dealerLocation')}>
                            {filters.dealerLocation || '판매점'} <span className={`arrow ${openDropdown === 'dealerLocation' ? 'open' : ''}`}>▼</span>
                        </button>
                        {openDropdown === 'dealerLocation' && (
                            <div className="dropdown-menu">
                                <button onClick={() => { setFilters(prev => ({ ...prev, dealerLocation: '' })); setOpenDropdown(null); }} className="dropdown-item">
                                    전체
                                </button>
                                {['서울', '경기', '인천', '대구', '대전', '부산'].map((location) => (
                                    <button key={location} onClick={() => { setFilters(prev => ({ ...prev, dealerLocation: location })); setOpenDropdown(null); }} className="dropdown-item">
                                        {location}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                   {/* 색상 필터 */}
                   <div className="dropdown">
    <button className="dropdown-toggle" onClick={() => toggleDropdown('color')}>
        {filters.color || '색상'} <span className={`arrow ${openDropdown === 'color' ? 'open' : ''}`}>▼</span>
    </button>
    {openDropdown === 'color' && (
        <div className="dropdown-menu">
            <button 
                onClick={() => { setFilters(prev => ({ ...prev, color: '' })); setOpenDropdown(null); }} 
                className="dropdown-item">
                전체
            </button>
            {['white', 'yellow', 'black', 'gray', 'silver'].map((color) => (
                <button 
                    key={color} 
                    onClick={() => { handleColorChange(color); setOpenDropdown(null); }} 
                    className="dropdown-item">
                    <div 
                        className={`color-box ${filters.color === color ? 'selected' : ''}`}
                        style={{ backgroundColor: color }}>
                    </div>
                </button>
            ))}
        </div>
    )}
</div>
                </aside>
                <main className="car-list">
    {paginatedCars.length > 0 ? (
        paginatedCars.map((car) => {
            const imageSrc = base64Images[car.vehicleNo] || '/default-image.png'; // Base64 이미지가 있으면 사용, 없으면 기본 이미지
            return (
                <div
                    key={car.vehicleNo}
                    className="car-card"
                    onClick={() => handleCardClick(car.vehicleNo)}
                    style={{ cursor: 'pointer' }}
                >
                    <h3>{car.vehicleName}</h3>
                    <img
                        src={imageSrc} // Base64 이미지 또는 기본 이미지
                        alt={`${car.vehicleName} 대표 이미지`}
                        style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }}
                    />
                    {!car.mainImage && console.log('대표 이미지가 없습니다:', car.vehicleNo)} {/* 디버깅용 로그 */}
                    <p>브랜드: {car.brand}</p>
                    <p>연식: {car.modelYear}년</p>
                    <p>{car.car_km.toLocaleString()}km</p>
                    <p>가격: ₩{car.price.toLocaleString()}</p>
                    <p>색상: {car.color}</p>
                    <p>{car.seatingCapacity}인승</p>
                    <p>변속기: {car.transmission}</p>
                    <p>판매점: {car.dealerLocation}</p>
                </div>
            );
        })
    ) : (
        <p>등록된 차량이 없습니다.</p>
    )}
</main>
            </div>

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
