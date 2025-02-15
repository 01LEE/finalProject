import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/UsedCarUpdate.css';

// 서버 주소 상수 선언
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const UpdateCar = () => {
    const { vehicleNo } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [formData, setFormData] = useState({});
    const [imageFiles, setImageFiles] = useState([]); // 새로 업로드할 이미지 파일들
    const [previewImages, setPreviewImages] = useState([]); // 이미지 미리보기
    const [selectedMainImage, setSelectedMainImage] = useState(null); // 대표 이미지
    const [deletedImages, setDeletedImages] = useState([]); // 삭제된 이미지 목록

    useEffect(() => {
        axios
            .get(`${SERVER_URL}/used-cars/detail?vehicleNo=${vehicleNo}`)
            .then((response) => {
                const carData = response.data;
                setCar(carData);
                setFormData({ ...carData, vehicleNo });

                console.log("update...")

                if (carData.usedCarImages) {
                    const images = carData.usedCarImages.map((img) => ({
                        file: null,
                        url: `${SERVER_URL}${img.imageUrl}`, // 서버에서 받은 상대경로를 절대 URL로 만듦
                        isServerImage: true,
                        mainImage: img.mainImage === 'Y'
                    }));
                    setPreviewImages(images);
                    // carData.mainImage가 '/'로 시작하면 서버 URL을 붙여줌
                    const initialMainImage = carData.mainImage 
                        ? (carData.mainImage.startsWith('/') 
                            ? `${SERVER_URL}${carData.mainImage}` 
                            : carData.mainImage)
                        : images[0]?.url || null;
                    setSelectedMainImage(initialMainImage);
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

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        const newPreviews = await Promise.all(files.map(async (file) => {
            const uploadFormData = new FormData();
            uploadFormData.append('image', file);
    
            try {
                const response = await axios.post(`${SERVER_URL}/upload-image`, uploadFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                const serverImageUrl = response.data.imageUrl;
                return {
                    file: file,
                    url: `${SERVER_URL}${serverImageUrl}`, // 서버 URL과 결합하여 절대 URL 생성
                    isServerImage: true,
                    mainImage: false,
                };
            } catch (error) {
                console.error('Image upload failed:', error);
                return {
                    file: file,
                    url: URL.createObjectURL(file),
                    isServerImage: false,
                    mainImage: false,
                };
            }
        }));
    
        setImageFiles((prev) => [...prev, ...files]);
        setPreviewImages((prev) => [...prev, ...newPreviews]);
    };
    // 대표 이미지 선택 시 (update-car-details 요청 시 함께 전송)
    const handleMainImageSelect = (imageObj) => {
        setSelectedMainImage(imageObj.url);
    };

    const handleDeleteImage = (imageObj) => {
        setPreviewImages((prev) => prev.filter((img) => img.url !== imageObj.url));

        if (imageObj.isServerImage) {
            const cleanUrl = imageObj.url.replace(`${SERVER_URL}`, "");
            setDeletedImages((prev) => [...prev, cleanUrl]);
        } else {
            setImageFiles((prev) => prev.filter((file) => file !== imageObj.file));
        }

        if (selectedMainImage === imageObj.url) {
            const remainingImages = previewImages.filter((img) => img.url !== imageObj.url);
            setSelectedMainImage(remainingImages.length > 0 ? remainingImages[0].url : null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedFormData = new FormData();

        // 대표 이미지 URL이 절대경로라면 상대경로로 변환 (백엔드/DB에서는 상대경로 저장)
        let mainImage = selectedMainImage;
        console.log("mainImage: ", mainImage);
        if (mainImage && mainImage.startsWith(`${SERVER_URL}`)) {
            mainImage = mainImage.replace(`${SERVER_URL}`, "");

            console.log("mainImage  value1 : ", mainImage);
        }

        const carData = {
            ...formData,
            mainImage: mainImage // 대표 이미지의 상대경로
        };
        console.log("mainImage  value2 : ", mainImage);

        // JSON 데이터를 단순 문자열로 추가
        updatedFormData.append('carData', JSON.stringify(carData));
        updatedFormData.append('deletedImages', JSON.stringify(deletedImages));

        // 업로드할 이미지들 추가
        imageFiles.forEach((file) => {
            updatedFormData.append('images', file);
        });

        try {
            // 헤더를 명시하지 않으면 axios가 multipart/form-data에 맞게 자동으로 설정함
            await axios.post(`${SERVER_URL}/used-cars/update-car-details`, updatedFormData);
            alert('수정이 완료되었습니다.');
            window.location.reload();
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
                판매점:
                <input type="text" name="dealerLocation" value={formData.dealerLocation || ''} onChange={handleChange} />
            </label>

            <label>
                차량 번호:
                <input type="text" name="vehiclePlate" value={formData.vehiclePlate || ''} onChange={handleChange} />
            </label>

            <label>
                대표 이미지:
                <div className="preview-container">
                    {previewImages.map((imageObj, index) => (
                        <div key={index} className="image-preview">
                            <img
                                src={imageObj.url}
                                alt="차량 이미지"
                                className={selectedMainImage === imageObj.url ? 'selected-image' : ''}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleMainImageSelect(imageObj);
                                }}
                                onError={(e) => (e.target.src = "/default-image.png")}
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
