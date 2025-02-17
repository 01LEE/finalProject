// UsedCarBoard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/UsedCar.css';
import { useNavigate } from 'react-router-dom';
import UsedCarFilter from '../components/UsedCarFilter';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const DEFAULT_IMAGE_URL = `${SERVER_URL}/images/usedcar_imageX.png`;

const UsedCarBoard = () => {
  const [cars, setCars] = useState([]);
  const [base64Images, setBase64Images] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18;

  // 필터 상태
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
    sortBy: 'car_km',
    order: 'asc',
  });

  const navigate = useNavigate();

  // 차량 데이터 불러오기
  const fetchCars = (filterParams) => {
    axios
      .get(`${SERVER_URL}/used-cars/getFilteredUsedCars`, {
        params: {
          ...filterParams,
          sortBy: filterParams.sortBy || 'car_km',
          order: filterParams.order || 'asc',
        },
      })
      .then((response) => {
        setCars(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch used cars:', error);
      });
  };

  useEffect(() => {
    fetchCars(filters);
  }, [filters]);

  // 이미지 처리 (blob to Base64)
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
  };

  useEffect(() => {
    const fetchBase64Images = async () => {
      const updatedImages = {};
      for (const car of cars) {
        if (car.mainImage && car.mainImage.startsWith('blob:')) {
          try {
            const base64 = await blobToBase64(car.mainImage);
            updatedImages[car.vehicleNo] = base64;
          } catch (error) {
            console.error(`Failed to convert Blob to Base64 for ${car.vehicleNo}:`, error);
          }
        } else if (car.mainImage) {
          updatedImages[car.vehicleNo] = `${SERVER_URL}${car.mainImage}`;
        }
      }


      setBase64Images(updatedImages);
    };

    if (cars.length > 0) {
      fetchBase64Images();
    }
  }, [cars]);

  const paginatedCars = cars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => setCurrentPage(page);

  const handleCardClick = (vehicleNo) => {
    navigate(`/used-cars/detail/${vehicleNo}`);
  };

  return (
    <div className="used-car-board">
      <header className="header">
        <h1>중고차 목록</h1>
        <input
          type="text"
          placeholder="차량명을 입력하세요..."
          value={filters.vehicleName}
          onChange={(e) => setFilters((prev) => ({ ...prev, vehicleName: e.target.value }))}
          className="search-input"
        />
      </header>

      <div className="content">
        {/* 필터 컴포넌트 */}
        <UsedCarFilter filters={filters} setFilters={setFilters} />

        <main className="car-list">
          {paginatedCars.length > 0 ? (
            paginatedCars.map((car) => {
              const imageSrc = base64Images[car.vehicleNo] || '/default-image.png';
              return (
                <div
                  key={car.vehicleNo}
                  className="car-card"
                  onClick={() => handleCardClick(car.vehicleNo)}
                  style={{ cursor: 'pointer' }}
                >
                  <h3>{car.vehicleName}</h3>
                  <img
                    src={imageSrc}
                    alt={`${car.vehicleName} 대표 이미지`}
                    style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }}
                  />
                  {!car.mainImage && console.log('대표 이미지가 없습니다:', car.vehicleNo)}
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
        {Array.from({ length: Math.ceil(cars.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
          <button key={page} onClick={() => handlePageChange(page)} disabled={page === currentPage}>
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UsedCarBoard;
