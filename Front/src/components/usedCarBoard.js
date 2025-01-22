import React, { useState } from 'react';
import '../css/UsedCar.css';

const UsedCarPage = () => {
    const cars = [
        { brand: '현대', model: '소나타', year: 2015, price: 9000, color: 'White' },
        { brand: '현대', model: '아반떼', year: 2016, price: 8000, color: 'Gray' },
        { brand: '현대', model: '그랜저', year: 2020, price: 27000, color: 'Black' },
        { brand: '현대', model: '팰리세이드', year: 2021, price: 45000, color: 'White' },
        { brand: '현대', model: '투싼', year: 2019, price: 23000, color: 'Blue' },
        { brand: '현대', model: '싼타페', year: 2022, price: 38000, color: 'Red' },
        { brand: '현대', model: '아이오닉 5', year: 2023, price: 52000, color: 'Gray' },
        { brand: '현대', model: '캐스퍼', year: 2022, price: 16000, color: 'Black' },
        { brand: '현대', model: '베뉴', year: 2021, price: 19000, color: 'White' },
        { brand: '현대', model: '넥쏘', year: 2020, price: 35000, color: 'Blue' },

        { brand: '기아', model: 'K5', year: 2019, price: 22000, color: 'White' },
        { brand: '기아', model: '스포티지', year: 2018, price: 25000, color: 'Black' },
        { brand: '기아', model: '쏘렌토', year: 2020, price: 32000, color: 'Gray' },
        { brand: '기아', model: '카니발', year: 2022, price: 40000, color: 'Red' },
        { brand: '기아', model: '모닝', year: 2021, price: 14000, color: 'Blue' },
        { brand: '기아', model: '니로 EV', year: 2023, price: 45000, color: 'White' },
        { brand: '기아', model: '셀토스', year: 2022, price: 27000, color: 'Black' },
        { brand: '기아', model: 'K7', year: 2019, price: 29000, color: 'Gray' },
        { brand: '기아', model: '레이', year: 2020, price: 15000, color: 'Blue' },
        { brand: '기아', model: '봉고3', year: 2021, price: 21000, color: 'White' },

        { brand: '제네시스', model: 'G70', year: 2020, price: 37000, color: 'Black' },
        { brand: '제네시스', model: 'G80', year: 2021, price: 50000, color: 'White' },
        { brand: '제네시스', model: 'G90', year: 2022, price: 70000, color: 'Gray' },
        { brand: '제네시스', model: 'GV70', year: 2023, price: 62000, color: 'Red' },
        { brand: '제네시스', model: 'GV80', year: 2023, price: 72000, color: 'Blue' },
        { brand: '제네시스', model: 'G70 Shooting Brake', year: 2023, price: 55000, color: 'White' },
        { brand: '제네시스', model: 'Electrified G80', year: 2023, price: 80000, color: 'Black' },
        { brand: '제네시스', model: 'GV60', year: 2023, price: 69000, color: 'Gray' },
        { brand: '제네시스', model: 'X Concept', year: 2024, price: 95000, color: 'Red' },
        { brand: '제네시스', model: 'Essentia Concept', year: 2024, price: 120000, color: 'Blue' },

        { brand: '쉐보레(GM대우)', model: '말리부', year: 2020, price: 28000, color: 'Red' },
        { brand: '쉐보레(GM대우)', model: '트랙스', year: 2022, price: 23000, color: 'Black' },
        { brand: '쉐보레(GM대우)', model: '임팔라', year: 2019, price: 35000, color: 'Gray' },
        { brand: '쉐보레(GM대우)', model: '이쿼녹스', year: 2021, price: 34000, color: 'White' },
        { brand: '쉐보레(GM대우)', model: '스파크', year: 2020, price: 15000, color: 'Blue' },
        { brand: '쉐보레(GM대우)', model: '볼트 EV', year: 2023, price: 45000, color: 'Red' },
        { brand: '쉐보레(GM대우)', model: '카마로', year: 2018, price: 50000, color: 'Black' },
        { brand: '쉐보레(GM대우)', model: '트레일블레이저', year: 2022, price: 31000, color: 'Gray' },
        { brand: '쉐보레(GM대우)', model: '콜로라도', year: 2023, price: 46000, color: 'White' },
        { brand: '쉐보레(GM대우)', model: '아베오', year: 2017, price: 12000, color: 'Blue' },

        { brand: '르노코리아(삼성)', model: 'SM6', year: 2020, price: 18000, color: 'Gray' },
        { brand: '르노코리아(삼성)', model: 'QM6', year: 2022, price: 27000, color: 'White' },
        { brand: '르노코리아(삼성)', model: 'XM3', year: 2021, price: 26000, color: 'Black' },
        { brand: '르노코리아(삼성)', model: '캡처', year: 2023, price: 28000, color: 'Blue' },
        { brand: '르노코리아(삼성)', model: '마스터', year: 2019, price: 32000, color: 'Red' },
        { brand: '르노코리아(삼성)', model: '트위지', year: 2020, price: 9000, color: 'Gray' },
        { brand: '르노코리아(삼성)', model: '조에', year: 2023, price: 36000, color: 'White' },
        { brand: '르노코리아(삼성)', model: 'SM3', year: 2018, price: 13000, color: 'Black' },
        { brand: '르노코리아(삼성)', model: 'SM5', year: 2017, price: 18000, color: 'Blue' },
        { brand: '르노코리아(삼성)', model: 'SM7', year: 2019, price: 22000, color: 'Red' },

        { brand: 'KG모빌리티(쌍용)', model: '코란도', year: 2020, price: 23000, color: 'Blue' },
        { brand: 'KG모빌리티(쌍용)', model: '티볼리', year: 2021, price: 20000, color: 'Gray' },
        { brand: 'KG모빌리티(쌍용)', model: '렉스턴', year: 2023, price: 37000, color: 'White' },
        { brand: 'KG모빌리티(쌍용)', model: '토레스', year: 2022, price: 32000, color: 'Black' },
        { brand: 'KG모빌리티(쌍용)', model: '엑티언', year: 2017, price: 12000, color: 'Red' },
        { brand: 'KG모빌리티(쌍용)', model: '카이런', year: 2018, price: 14000, color: 'Blue' },
        { brand: 'KG모빌리티(쌍용)', model: '로디우스', year: 2019, price: 18000, color: 'Gray' },
        { brand: 'KG모빌리티(쌍용)', model: '무쏘', year: 2020, price: 15000, color: 'White' },
        { brand: 'KG모빌리티(쌍용)', model: '렉스턴 스포츠', year: 2023, price: 33000, color: 'Black' },
        { brand: 'KG모빌리티(쌍용)', model: '스포츠 칸', year: 2022, price: 35000, color: 'Red' },
    ];

    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedYears, setSelectedYears] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 50000]);
    const [searchTerm, setSearchTerm] = useState('');

    const handleBrandChange = (brand) => {
        setSelectedBrands((prev) =>
            prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
        );
    };

    const handleYearChange = (year) => {
        setSelectedYears((prev) =>
            prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
        );
    };

    const handleColorChange = (color) => {
        setSelectedColors((prev) =>
            prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
        );
    };

    const handlePriceRangeChange = (e) => {
        const { name, value } = e.target;
        setPriceRange((prev) =>
            name === 'min' ? [Number(value), prev[1]] : [prev[0], Number(value)]
        );
    };

    const filteredCars = cars.filter((car) => {
        const matchesBrand =
            selectedBrands.length === 0 || selectedBrands.includes(car.brand);
        const matchesYear =
            selectedYears.length === 0 || selectedYears.includes(car.year.toString());
        const matchesColor =
            selectedColors.length === 0 || selectedColors.includes(car.color);
        const matchesPrice = car.price >= priceRange[0] && car.price <= priceRange[1];
        const matchesSearch = car.model.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesBrand && matchesYear && matchesColor && matchesPrice && matchesSearch;
    });

    return (
        <div className="used-car-page">
            <header className="header">
                <h1>호진 Car</h1>
            </header>

            <div className="content">
                <aside className="sidebar">
                    <h2>필터</h2>

                    <h3>브랜드</h3>
                    {['현대', '기아', '제네시스', '쉐보레(GM대우)', '르노코리아(삼성)', 'KG모빌리티(쌍용)'].map((brand) => (
                        <label key={brand}>
                            <input
                                type="checkbox"
                                onChange={() => handleBrandChange(brand)}
                                checked={selectedBrands.includes(brand)}
                            />
                            {brand}
                        </label>
                    ))}

                    <h3>연식</h3>
                    {['2015', '2016', '2018', '2019', '2020', '2021', '2022', '2023', '2024'].map((year) => (
                        <label key={year}>
                            <input
                                type="checkbox"
                                onChange={() => handleYearChange(year)}
                                checked={selectedYears.includes(year)}
                            />
                            {year}
                        </label>
                    ))}

                    <h3>색상</h3>
                    {['White', 'Black', 'Red', 'Gray', 'Blue'].map((color) => (
                        <div key={color} style={{ display: 'inline-block', margin: '5px' }}>
                            <input
                                type="checkbox"
                                onChange={() => handleColorChange(color)}
                                checked={selectedColors.includes(color)}
                                style={{ display: 'none' }}
                            />
                            <div
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: color.toLowerCase(),
                                    border: selectedColors.includes(color) ? '2px solid #000' : '1px solid #aaa',
                                    cursor: 'pointer',
                                }}
                                onClick={() => handleColorChange(color)}
                            ></div>
                        </div>
                    ))}

                    <h3>가격 범위</h3>
                    <label>
                        최소:
                        <input
                            type="number"
                            name="min"
                            value={priceRange[0]}
                            onChange={handlePriceRangeChange}
                        />
                    </label>
                    <label>
                        최대:
                        <input
                            type="number"
                            name="max"
                            value={priceRange[1]}
                            onChange={handlePriceRangeChange}
                        />
                    </label>

                    <h3>검색</h3>
                    <input
                        type="text"
                        placeholder="모델 검색"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </aside>

                <main className="car-list">
                    {filteredCars.length > 0 ? (
                        filteredCars.map((car, index) => (
                            <div key={index} className="car-card">
                                <h3>{car.model}</h3>
                                <p>{car.brand}</p>
                                <p>{car.year}년</p>
                                <p>₩{car.price.toLocaleString()}</p>
                                <p>색상: {car.color}</p>
                            </div>
                        ))
                    ) : (
                        <p>조건에 맞는 차량이 없습니다.</p>
                    )}
                </main>
            </div>
        </div>
    );
};

export default UsedCarPage;
