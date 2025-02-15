// UsedCarFilter.js
import React, { useState } from 'react';

const UsedCarFilter = ({ filters, setFilters }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  // 드롭다운 열고 닫기
  const toggleDropdown = (filterName) => {
    setOpenDropdown(openDropdown === filterName ? null : filterName);
  };

  // 공통 필터 변경 핸들러
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 가격 범위 변경
  const handlePriceRangeChange = (value) => {
    const [min, max] = value.split('-').map(Number);
    setFilters((prev) => ({
      ...prev,
      priceRange: value,
      minPrice: min,
      maxPrice: max === undefined ? Infinity : max,
    }));
  };

  // 색상 변경
  const handleColorChange = (color) => {
    setFilters((prev) => ({
      ...prev,
      color: prev.color === color ? '' : color,
    }));
  };

  // 정렬 변경
  const handleSortChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "default") {
      setFilters((prev) => ({
        ...prev,
        sortBy: 'car_km',
        order: 'asc',
      }));
      return;
    }
    const parts = selectedValue.split("_");
    let sortBy, order;
    if (parts.length === 3) {
      sortBy = parts[0] + "_" + parts[1];
      order = parts[2];
    } else if (parts.length === 2) {
      sortBy = parts[0];
      order = parts[1];
    } else {
      console.error("정렬 값 형식 오류:", selectedValue);
      return;
    }
    if (!["asc", "desc"].includes(order)) {
      console.error("잘못된 정렬 order 값:", order);
      return;
    }
    setFilters((prev) => ({
      ...prev,
      sortBy,
      order,
    }));
  };

  // 정렬 옵션
  const sortOptions = [
    { label: '전체 보기', value: 'default' },
    { label: '적은 주행거리 순', value: 'car_km_asc' },
    { label: '많은 주행거리 순', value: 'car_km_desc' },
    { label: '낮은 가격 순', value: 'price_asc' },
    { label: '높은 가격 순', value: 'price_desc' },
    { label: '최근 연식 순', value: 'model_year_desc' },
    { label: '오래된 연식 순', value: 'model_year_asc' },
  ];

  // 가격 옵션
  const priceOptions = [
    { label: '5백만 이하', value: '0-5000000' },
    { label: '1천만 이하', value: '0-10000000' },
    { label: '2천만 이하', value: '0-20000000' },
    { label: '3천만 이하', value: '0-30000000' },
    { label: '4천만 이하', value: '0-40000000' },
    { label: '5천만 이하', value: '0-50000000' },
    { label: '1억 이상', value: '100000000-' },
  ];

  return (
    <aside className="sidebar">
      {/* 정렬 옵션 */}
      <div className="dropdown">
        <label>정렬 기준</label>
        <select onChange={handleSortChange} value={`${filters.sortBy}_${filters.order}`}>
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 브랜드 필터 */}
      <div className="dropdown">
        <button className="dropdown-toggle" onClick={() => toggleDropdown('brand')}>
          {filters.brand || '브랜드'} <span className={`arrow ${openDropdown === 'brand' ? 'open' : ''}`}>▼</span>
        </button>
        {openDropdown === 'brand' && (
          <div className="dropdown-menu">
            {['전체', '현대', '기아', '제네시스', '쉐보레(GM대우)', '르노코리아(삼성)'].map((brand) => (
              <button
                key={brand}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    brand: brand === '전체' ? '' : brand,
                  }))
                }
                className="dropdown-item"
              >
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
            <button
              onClick={() => setFilters((prev) => ({ ...prev, modelYear: '' }))}
              className="dropdown-item"
            >
              전체
            </button>
            {[2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025].map((year) => (
              <button
                key={year}
                onClick={() => setFilters((prev) => ({ ...prev, modelYear: year }))}
                className="dropdown-item"
              >
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
            <button
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  priceRange: '',
                  minPrice: '',
                  maxPrice: '',
                }))
              }
              className="dropdown-item"
            >
              전체
            </button>
            {priceOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  handlePriceRangeChange(option.value);
                  setOpenDropdown(null);
                }}
                className="dropdown-item"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 주행 거리 (최소) 필터 */}
      <div className="dropdown">
        <button className="dropdown-toggle" onClick={() => toggleDropdown('minKm')}>
          {filters.minKm ? `${filters.minKm} km` : '주행 거리(최소)'}{' '}
          <span className={`arrow ${openDropdown === 'minKm' ? 'open' : ''}`}>▼</span>
        </button>
        {openDropdown === 'minKm' && (
          <div className="dropdown-menu">
            <button
              onClick={() => setFilters((prev) => ({ ...prev, minKm: '' }))}
              className="dropdown-item"
            >
              전체
            </button>
            {[10000, 20000, 30000, 40000, 50000, 60000].map((km) => (
              <button
                key={km}
                onClick={() => setFilters((prev) => ({ ...prev, minKm: km }))}
                className="dropdown-item"
              >
                {km.toLocaleString()} km
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 주행 거리 (최대) 필터 */}
      <div className="dropdown">
        <button className="dropdown-toggle" onClick={() => toggleDropdown('maxKm')}>
          {filters.maxKm ? `${filters.maxKm} km` : '주행 거리(최대)'}{' '}
          <span className={`arrow ${openDropdown === 'maxKm' ? 'open' : ''}`}>▼</span>
        </button>
        {openDropdown === 'maxKm' && (
          <div className="dropdown-menu">
            <button
              onClick={() => setFilters((prev) => ({ ...prev, maxKm: '' }))}
              className="dropdown-item"
            >
              전체
            </button>
            {[80000, 100000, 120000, 140000, 160000, 180000, 200000].map((km) => (
              <button
                key={km}
                onClick={() => setFilters((prev) => ({ ...prev, maxKm: km }))}
                className="dropdown-item"
              >
                {km.toLocaleString()} km
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 차종 필터 */}
      <div className="dropdown">
        <button className="dropdown-toggle" onClick={() => toggleDropdown('vehicleType')}>
          {filters.vehicleType || '차종'} <span className={`arrow ${openDropdown === 'vehicleType' ? 'open' : ''}`}>▼</span>
        </button>
        {openDropdown === 'vehicleType' && (
          <div className="dropdown-menu">
            <button
              onClick={() => setFilters((prev) => ({ ...prev, vehicleType: '' }))}
              className="dropdown-item"
            >
              전체
            </button>
            {['경차', '소형차', '준중형차', '중형차', '대형차', 'SUV'].map((type) => (
              <button
                key={type}
                onClick={() => setFilters((prev) => ({ ...prev, vehicleType: type }))}
                className="dropdown-item"
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 인승 필터 */}
      <div className="dropdown">
        <button className="dropdown-toggle" onClick={() => toggleDropdown('seatingCapacity')}>
          {filters.seatingCapacity || '인승'} <span className={`arrow ${openDropdown === 'seatingCapacity' ? 'open' : ''}`}>▼</span>
        </button>
        {openDropdown === 'seatingCapacity' && (
          <div className="dropdown-menu">
            <button
              onClick={() => setFilters((prev) => ({ ...prev, seatingCapacity: '' }))}
              className="dropdown-item"
            >
              전체
            </button>
            {['4', '5', '6', '7', '8'].map((seat) => (
              <button
                key={seat}
                onClick={() => setFilters((prev) => ({ ...prev, seatingCapacity: seat }))}
                className="dropdown-item"
              >
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
            <button
              onClick={() => setFilters((prev) => ({ ...prev, transmission: '' }))}
              className="dropdown-item"
            >
              전체
            </button>
            {['오토', '수동', '새마오토', 'CVT'].map((type) => (
              <button
                key={type}
                onClick={() => setFilters((prev) => ({ ...prev, transmission: type }))}
                className="dropdown-item"
              >
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
            <button
              onClick={() => setFilters((prev) => ({ ...prev, fuelType: '' }))}
              className="dropdown-item"
            >
              전체
            </button>
            {['휘발유', '경유', '디젤', 'LPG', 'CNG'].map((fuel) => (
              <button
                key={fuel}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, fuelType: fuel === '전체' ? '' : fuel }))
                }
                className="dropdown-item"
              >
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
            <button
              onClick={() => setFilters((prev) => ({ ...prev, driveType: '' }))}
              className="dropdown-item"
            >
              전체
            </button>
            {['RWD', 'FWD', 'AWD'].map((type) => (
              <button
                key={type}
                onClick={() => setFilters((prev) => ({ ...prev, driveType: type }))}
                className="dropdown-item"
              >
                {type}
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
  );
};

export default UsedCarFilter;
