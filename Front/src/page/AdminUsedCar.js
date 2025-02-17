import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; //  페이지 이동을 위한 useNavigate 추가

export default function AdminUsedCar() {
  const [cars, setCars] = useState([]); // 전체 차량 목록
  const [filteredCars, setFilteredCars] = useState([]); // 검색 결과
  const [searchName, setSearchName] = useState(''); // 차량명 검색어
  const [searchNo, setSearchNo] = useState(''); // 차량번호 검색어
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 드롭다운 열림/닫힘 상태
  const navigate = useNavigate(); //  페이지 이동을 위한 useNavigate 훅

  //  중고차 목록 읽어옴
  useEffect(() => {
    fetch('http://localhost:9999/api/admin/used-cars')
      .then((res) => res.json())
      .then((data) => {
        setCars(data);
        setFilteredCars(data); // 초기값 설정
      })
      .catch((err) => console.error(err));
  }, []);

  //  검색 기능
  const handleSearch = () => {
    let result = cars;

    //  차량명 검색 (입력값으로 시작하는 차량만)
    if (searchName.trim()) {
      result = result.filter((car) =>
        car.vehicleName.startsWith(searchName.trim()) // "이"로 시작하는 차량만 검색
      );
    }

    //  차량번호 검색 (정확한 앞자리 검색)
    if (searchNo.trim()) {
      result = result.filter((car) =>
        String(car.vehicleNo).startsWith(searchNo.trim()) // "1"로 시작하는 차량만 검색
      );
    }

    setFilteredCars(result);
  };

  //  삭제 기능
  const handleDelete = (vehicleNo) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      fetch(`http://localhost:9999/api/admin/used-cars/${vehicleNo}`, {
        method: 'DELETE',
      })
        .then((res) => {
          if (res.ok) {
            const updatedCars = cars.filter((car) => car.vehicleNo !== vehicleNo);
            setCars(updatedCars);
            setFilteredCars(updatedCars);
          } else {
            alert('삭제 실패');
          }
        })
        .catch((err) => console.error('Error deleting car:', err));
    }
  };

  return (
    <div>
      <h1>중고차 게시판 관리</h1>
      <h2>"▼" 차량 목록보기 클릭시 수정 삭제 버튼 동작합니다</h2>


      {/*  차량명 및 차량번호 검색 */}
      <div>
        <input
          type="text"
          placeholder="차량명 검색"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="text"
          placeholder="차량번호 검색"
          value={searchNo}
          onChange={(e) => setSearchNo(e.target.value)}
        />
        <button onClick={handleSearch}>검색</button>
      </div>
          {/*  차량 등록 버튼 추가 */}
          <button onClick={() => navigate('/admin/used-car-add')}>🚗 새로운 차량 등록</button>

      {/*  드롭다운 버튼 */}
      <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        {isDropdownOpen ? '▲ 목록 닫기' : '▼ 차량 목록 보기'}
      </button>

      {/* 드롭다운으로 차량 목록 표시 */}
      {isDropdownOpen && (
        <div style={{ marginTop: "10px", border: "1px solid #ddd", padding: "10px", width: "400px" }}>
          <table border="1" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>차량번호</th>
                <th>차량명</th>
                <th>가격</th>
                <th>삭제</th>
                <th>수정</th>
              </tr>
            </thead>
            <tbody>
              {filteredCars.length > 0 ? (
                filteredCars.map((car) => (
                  <tr key={car.vehicleNo}>
                    <td>{car.vehicleNo}</td>
                    <td>{car.vehicleName}</td>
                    <td>{car.price.toLocaleString()} 원</td>
                    <td>
                      <button onClick={() => handleDelete(car.vehicleNo)}>삭제</button>
                    </td>
                    <td>
          <button
            onClick={() => {
              console.log("수정할 차량 번호:", car.vehicleNo);
              navigate(`/admin/used-car-update/${car.vehicleNo}`);
            }}
          >
            수정
          </button>
        </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>검색 결과 없음</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
