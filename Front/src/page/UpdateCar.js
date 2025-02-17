import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/UsedCarUpdate.css';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import CodeBlock from '@tiptap/extension-code-block';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontSize from '@tiptap/extension-font-size';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';

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

    const editor = useEditor({
        extensions: [
          StarterKit,
          Bold,
          Italic,
          Underline,
          Strike,
          CodeBlock,
          Link.configure({ openOnClick: true }),
          TextAlign.configure({ types: ['paragraph'] }),
          TextStyle,
          FontSize.configure({ types: ['textStyle'] }),
          Color.configure({ types: ['textStyle'] }),
          Highlight.configure({ multicolor: true }),
          Image,
          Table.configure({ resizable: true }),
          TableRow,
          TableCell,
          TableHeader,
        ],
        content: `
          <div style="font-size:16px; color:gray;">
            <p>* 사고 유무, 옵션, 볼링 에버 등 차량 설명을 작성하세요 (예: 퍼펙트 30게임 이상시 70% 할인)*</p>
            <p>사고유무 : [내용 입력]</p>
            <p>차량옵션 : [내용 입력]</p>
            <p>차량특이사항 : [내용 입력]</p>
            <p>판매자 번호 : [내용 입력]</p>
            <p>판매자 이름 : [내용 입력]</p>
          </div>
        `,
      });
    

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
      
        // 대표 이미지 URL 처리 (상대경로 변환)
        let mainImage = selectedMainImage;
        if (mainImage && mainImage.startsWith(`${SERVER_URL}`)) {
            mainImage = mainImage.replace(`${SERVER_URL}`, "");
        }
      
        // 에디터에서 입력한 내용을 description으로 사용 (HTML 형식)
        const description = editor.getHTML();
      
        // 기존 formData와 mainImage 업데이트
        const carData = {
            ...formData,
            mainImage: mainImage,
            description: description  // 에디터 내용을 description에 저장
        };
      
        updatedFormData.append('carData', JSON.stringify(carData));
        updatedFormData.append('deletedImages', JSON.stringify(deletedImages));
        imageFiles.forEach((file) => {
            updatedFormData.append('images', file);
        });
      
        try {
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

              <label>차량 설명:</label>
                  <h4>*취소시 전 작업, 다시 실행시 앞 작업으로 돌아갑니다*</h4>
                  <div className="tiptap-editor">
                    {editor && <EditorContent editor={editor} />}
                  </div>
            
                  <div className="tiptap-toolbar">
                    <button type="button" onClick={() => editor.chain().focus().undo().run()}>↩ 취소</button>
                    <button type="button" onClick={() => editor.chain().focus().redo().run()}>↪ 다시 실행</button>
                    <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}><b>굵게</b></button>
                    <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}><i>기울임</i></button>
                    <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()}><u>밑줄</u></button>
                    <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()}>취소선</button>
                    <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()}>왼쪽 정렬</button>
                    <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()}>가운데 정렬</button>
                    <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()}>오른쪽 정렬</button>
                    <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}>● 리스트</button>
                    <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. 리스트</button>
                    <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
                    <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
                    <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
                    <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()}>❝ 인용문</button>
                    <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()}>— 구분선</button>
                    <button type="button" onClick={() => editor.chain().focus().insertTable({ rows: 2, cols: 2 }).run()}>📊 테이블 추가</button>
                    <button type="button" onClick={() => editor.chain().focus().addRowAfter().run()}>➕ 행 추가</button>
                    <button type="button" onClick={() => editor.chain().focus().addColumnAfter().run()}>➕ 열 추가</button>
                    <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()}>코드 블록</button>
                    <button type="button" onClick={() => {
                      const url = prompt('URL 입력:');
                      if (url) editor.chain().focus().setLink({ href: url }).run();
                    }}>🔗 링크 추가</button>
                    <select onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}>
                      <option value="12px">12px</option>
                      <option value="16px">16px</option>
                      <option value="20px">20px</option>
                      <option value="24px">24px</option>
                      <option value="28px">28px</option>
                    </select>
                    <input type="color" onChange={(e) => editor.chain().focus().setColor(e.target.value).run()} title="폰트 색상 변경" />
                    <input type="color" onChange={(e) => editor.chain().focus().setHighlight({ color: e.target.value }).run()} title="배경 색상 변경" />
                  </div>

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
