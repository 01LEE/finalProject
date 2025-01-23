import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiAxios from '../lib/apiAxios';

const Map = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [mapInstance, setMapInstance] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {


        const loadMap = () => {
            const { kakao } = window;
            const mapContainer = document.getElementById('map');

            const mapOption = {
                center: new kakao.maps.LatLng(37.5665, 126.9780), // 서울 중심 좌표
                level: 3
            };

            const map = new kakao.maps.Map(mapContainer, mapOption);
            setMapInstance(map);
        };

        loadMap();
    }, []);

    const handleSearch = () => {
        const { kakao } = window;
        const ps = new kakao.maps.services.Places();

        ps.keywordSearch(searchQuery, (data, status) => {
            if (status === kakao.maps.services.Status.OK) {
                setSearchResults(data);
            } else {
                alert('검색 결과가 없습니다.');
            }
        });
    };

    const handleLogout = () => {
        navigate('/');
    };

    const handleResultClick = (place) => {
        window.open(`https://map.kakao.com/link/map/${place.id}`, '_blank');
    };

    return (
        <div>
            <div>
                <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={handleSearch}>검색</button>
            </div>
            <div id="map" style={{ width: '100%', height: '400px', marginTop: '20px' }}></div>
            <div style={{ marginTop: '20px' }}>
                <h3>검색 결과:</h3>
                <ul>
                    {searchResults.map((place, index) => (
                        <li key={index} onClick={() => handleResultClick(place)} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                            {place.place_name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Map;
