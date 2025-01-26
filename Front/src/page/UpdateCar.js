import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/UsedCarUpdate.css';

const UpdateCar = () => {
    const { vehicleNo } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [formData, setFormData] = useState({});
    const [imageFiles, setImageFiles] = useState([]); // 새로 업로드할 이미지 파일들
    const [previewImages, setPreviewImages] = useState([]); // 미리보기 이미지 객체 배열
    const [selectedMainImage, setSelectedMainImage] = useState(null); // 대표 이미지
    const [deletedImages, setDeletedImages] = useState([]); // 삭제된 이미지 URL 배열

    useEffect(() => {
        axios
            .get(`http://localhost:9999/used-cars/detail?vehicleNo=${vehicleNo}`)
            .then((response) => {
                const carData = response.data;
                setCar(carData);
                setFormData({ ...carData, vehicleNo });

                if (carData.usedCarImage) {
                    const images = carData.usedCarImage.split(',').map((img) => ({
                        url: `http://localhost:9999${img}`, // 절대 경로 설정
                        isServerImage: true,
                    }));
                    setPreviewImages(images);
                    setSelectedMainImage(carData.mainImage || images[0]?.url || null); // 서버에서 반환된 mainImage로 설정
                }
            })
            .catch((error) => {
                console.error('Failed to fetch car details:', error);
            });
    }, [vehicleNo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newPreviews = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
            isServerImage: false,
        }));
        setImageFiles((prev) => [...prev, ...files]);
        setPreviewImages((prev) => [...prev, ...newPreviews]);
    };

    const handleMainImageSelect = (imageObj) => {
        setSelectedMainImage(imageObj.url); // 선택한 대표 이미지 반영
        setFormData((prev) => ({
            ...prev,
            mainImage: imageObj.url,
        }));
    };

    const handleDeleteImage = (imageObj) => {
        setPreviewImages((prev) => prev.filter((img) => img.url !== imageObj.url));
        if (imageObj.isServerImage) {
            setDeletedImages((prev) => [...prev, imageObj.url]);
        } else {
            setImageFiles((prev) => prev.filter((file) => file !== imageObj.file));
        }
        if (selectedMainImage === imageObj.url) {
            const remainingImages = previewImages.filter((img) => img.url !== imageObj.url);
            setSelectedMainImage(remainingImages.length > 0 ? remainingImages[0].url : null); // 대표 이미지 재설정
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedFormData = new FormData();

        updatedFormData.append('carData', JSON.stringify({
            ...formData,
            mainImage: selectedMainImage,
            deletedImages: deletedImages.join(','),
        }));

        imageFiles.forEach((file) => {
            updatedFormData.append('images', file);
        });

        try {
            await axios.post('http://localhost:9999/used-cars/update-car-details', updatedFormData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('수정이 완료되었습니다.');
            navigate(`/used-cars/detail/${vehicleNo}`);
        } catch (error) {
            console.error('Failed to update car details:', error.response?.data || error.message);
            alert(`수정 중 오류 발생: ${error.response?.data || error.message}`);
        }
    };

    if (!car) {
        return <p>로딩 중...</p>;
    }

    return (
        <form className="edit-car-form" onSubmit={handleSubmit} encType="multipart/form-data">
            <h1>차량 정보 수정</h1>
            <label>
        차량 이름:
        <input type="text" name="vehicleName" value={formData.vehicleName || ''} onChange={handleChange} />
    </label>
    <label>
        브랜드:
        <select name="brand" value={formData.brand || ''} onChange={handleChange}>
            <option value="">브랜드 선택</option>
            <option value="현대">현대</option>
            <option value="기아">기아</option>
            <option value="제네시스">제네시스</option>
            <option value="쉐보레(GM대우)">쉐보레(GM대우)</option>
            <option value="르노코리아(삼성)">르노코리아(삼성)</option>
        </select>
    </label>
    <label>
        연식:
        <input type="number" name="modelYear" value={formData.modelYear || ''} onChange={handleChange} />
    </label>
    <label>
        가격:
        <input type="number" name="price" value={formData.price || ''} onChange={handleChange} />
    </label>
    <label>
        색상:
        <select name="color" value={formData.color || ''} onChange={handleChange}>
            <option value="">색상 선택</option>
            <option value="white">화이트</option>
            <option value="black">블랙</option>
            <option value="silver">실버</option>
            <option value="gray">그레이</option>
            <option value="red">레드</option>
        </select>
    </label>
    <label>
        변속기:
        <select name="transmission" value={formData.transmission || ''} onChange={handleChange}>
            <option value="">변속기 선택</option>
            <option value="오토">오토</option>
            <option value="수동">수동</option>
            <option value="CVT">CVT</option>
        </select>
    </label>
    <label>
        주행 거리 (km):
        <input type="number" name="car_km" value={formData.car_km || ''} onChange={handleChange} />
    </label>
    <label>
        인승:
        <select name="seatingCapacity" value={formData.seatingCapacity || ''} onChange={handleChange}>
            <option value="">인승 선택</option>
            <option value="4">4인승</option>
            <option value="5">5인승</option>
            <option value="6">6인승</option>
            <option value="7">7인승</option>
            <option value="8">8인승</option>
        </select>
    </label>
    <label>
        차종:
        <select name="vehicleType" value={formData.vehicleType || ''} onChange={handleChange}>
            <option value="">차종 선택</option>
            <option value="세단">세단</option>
            <option value="SUV">SUV</option>
            <option value="경차">경차</option>
            <option value="트럭">트럭</option>
        </select>
    </label>
    <label>
        구동방식:
        <select name="driveType" value={formData.driveType || ''} onChange={handleChange}>
            <option value="">구동방식 선택</option>
            <option value="FWD">FWD</option>
            <option value="RWD">RWD</option>
            <option value="AWD">AWD</option>
        </select>
    </label>
    <label>
        연료:
        <select name="fuelType" value={formData.fuelType || ''} onChange={handleChange}>
            <option value="">연료 선택</option>
            <option value="휘발유">휘발유</option>
            <option value="경유">경유</option>
            <option value="LPG">LPG</option>
            <option value="CNG">CNG</option>
        </select>
    </label>
    <label>
        판매점:
        <input type="text" name="dealerLocation" value={formData.dealerLocation || ''} onChange={handleChange} />
    </label>
    <label>
        차량 번호:
        <input type="text" name="vehiclePlate" value={formData.vehiclePlate || ''} onChange={handleChange} />
    </label>
            <label>
                이미지 미리 보기:
                <div className="preview-container">
                    {previewImages.map((imageObj, index) => (
                        <div key={index} className="image-preview">
                            <img
                                src={imageObj.url}
                                alt={`미리보기 ${index}`}
                                className={selectedMainImage === imageObj.url ? 'selected-image' : ''}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleMainImageSelect(imageObj);
                                }}
                            />
                            <button type="button" onClick={(e) => {
                                e.preventDefault();
                                handleDeleteImage(imageObj);
                            }}>
                                X
                            </button>
                        </div>
                    ))}
                </div>
            </label>
            <label>
                새 이미지 업로드:
                <input type="file" accept="image/*" multiple onChange={handleImageChange} />
            </label>
            <button type="submit">수정 완료</button>
        </form>
    );
};

export default UpdateCar;
