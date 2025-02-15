import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
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
import '../css/UsedCarUpdate.css';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const AdminUsedCarAdd = () => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    vehicleName: '',
    brand: '',
    modelYear: '',
    price: '',
    color: '',
    dealerLocation: '',
    vehiclePlate: '',
    vehicleNo: '',       // 차량 번호 (차대 번호)
    vehicleType: '',     // 차종
    fuelType: '',        // 연료 타입
    transmission: '',    // 변속기
    driveType: ''        // 구동 방식
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedMainImage, setSelectedMainImage] = useState(null);

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
    content: "<p style='font-size:16px; color:gray;'>* 사고 유무, 옵션, 볼링 에버 등 차량 설명을 작성하세요 (예: 퍼펙트 30게임 이상시 70% 할인)*</p>",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 파일 업로드 시 서버에 업로드하여 서버가 반환한 상대 URL을 사용합니다.
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = await Promise.all(
      files.map(async file => {
        const uploadFormData = new FormData();
        uploadFormData.append('image', file);
        try {
          const response = await axios.post(`${SERVER_URL}/upload-image`, uploadFormData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          const serverImageUrl = response.data.imageUrl; // 예: "/car-images/xxx.png"
          return {
            file,
            url: serverImageUrl, // 상대 URL 사용
            isServerImage: true,
            mainImage: false,
            key: `${file.name}-${Date.now()}`
          };
        } catch (error) {
          console.error('Image upload failed:', error);
          const blobUrl = URL.createObjectURL(file);
          return {
            file,
            url: blobUrl,
            isServerImage: false,
            mainImage: false,
            key: `${file.name}-${Date.now()}`
          };
        }
      })
    );
    setImageFiles(prev => [...prev, ...files]);
    setPreviewImages(prev => [...prev, ...newPreviews]);
    if (!selectedMainImage && newPreviews.length > 0) {
      setSelectedMainImage(newPreviews[0].url);
    }
  };

  const handleMainImageSelect = (imageObj) => {
    setSelectedMainImage(imageObj.url);
  };

  // 이미지 삭제 시, Blob URL이면 해제 및 상태 업데이트 최적화
  const handleDeleteImage = (imageObj) => {
    setPreviewImages(prev => {
      const newImages = prev.filter(img => img.key !== imageObj.key);
      if (selectedMainImage === imageObj.url) {
        setSelectedMainImage(newImages.length > 0 ? newImages[0].url : null);
      }
      return newImages;
    });
    setImageFiles(prev => prev.filter(file => file !== imageObj.file));
    if (!imageObj.isServerImage) {
      URL.revokeObjectURL(imageObj.url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editor) {
      alert("에디터가 초기화되지 않았습니다.");
      return;
    }
    if (!formData.vehicleNo || formData.vehicleNo.trim() === "") {
      alert("차대 번호를 입력해주세요.");
      return;
    }
    const updatedFormData = new FormData();
    const carData = {
      ...formData,
      description: editor.getHTML() || "",
      mainImage: selectedMainImage,  // 서버에서 업로드된 상대 URL 사용
    };
    updatedFormData.append('carData', JSON.stringify(carData));
    imageFiles.forEach(file => {
      updatedFormData.append('images', file);
    });
    try {
      await axios.post(`${SERVER_URL}/api/admin/used-cars/add-car-details`, updatedFormData);
      alert('차량 등록이 완료되었습니다.');
      window.location.reload();
    } catch (error) {
      console.error('Failed to add car details:', error.response?.data || error.message);
      alert(`등록 중 오류 발생: ${error.response?.data || error.message}`);
    }
  };

  return (
    <form className="edit-car-form" onSubmit={handleSubmit} encType="multipart/form-data">
      <h1>차량 정보 등록</h1>

      <label>차량 이름:</label>
      <input type="text" name="vehicleName" value={formData.vehicleName} onChange={handleChange} />

      <label>브랜드:</label>
      <select name="brand" value={formData.brand} onChange={handleChange}>
        <option value="">브랜드 선택</option>
        <option value="현대">현대</option>
        <option value="기아">기아</option>
        <option value="제네시스">제네시스</option>
        <option value="쉐보레(GM대우)">쉐보레(GM대우)</option>
        <option value="르노코리아(삼성)">르노코리아(삼성)</option>
      </select>


      <label>색상:</label>
      <select name="color" value={formData.color} onChange={handleChange}>
        <option value="">색상 선택</option>
        <option value="white">화이트</option>
        <option value="black">블랙</option>
        <option value="silver">실버</option>
        <option value="gray">그레이</option>
        <option value="red">레드</option>
      </select>

      <label>판매점:</label>
      <select name="dealerLocation" value={formData.dealerLocation} onChange={handleChange}>
        <option value="">판매점 선택</option>
        <option value="서울">서울</option>
        <option value="경기">경기</option>
        <option value="부산">부산</option>
        <option value="인천">인천</option>
        <option value="대전">대전</option>
        <option value="대구">대구</option>
        <option value="울산">울산</option>
        </select>

      <label>차종:</label>
      <select name="vehicleType" value={formData.vehicleType} onChange={handleChange}>  
        <option value="">차종 선택</option>
        <option value="경차">경차</option>
        <option value="소형차">소형차</option>
        <option value="준중형차">준중형차</option>
        <option value="중형차">중형차</option>
        <option value="대형차">대형차</option>
        <option value="SUV">SUV</option>
      </select>
      
      <label>연료 타입:</label>
      <select name="fuelType" value={formData.fuelType} onChange={handleChange}>  
        <option value="">연료 선택</option>
        <option value="휘발유">휘발유</option>
        <option value="경유">경유</option>
        <option value="디젤">디젤</option>
        <option value="LPG">LPG</option>
      </select>


      <label>차량 번호:</label>
      <input type="text" name="vehiclePlate" value={formData.vehiclePlate} onChange={handleChange} />

      <label>차량 연식:</label>
      <input type="text" name='caryear' value={formData.caryear} onChange={handleChange} />


      <label>연식:</label>
      <input type="number" name="modelYear" value={formData.modelYear} onChange={handleChange} />

      <label>가격:</label>
      <input type="number" name="price" value={formData.price} onChange={handleChange} />

      <label>차대 번호:</label>
      <input type="text" name="vehicleNo" value={formData.vehicleNo} onChange={handleChange} />

      <label>변속기:</label>
      <input type="text" name="transmission" value={formData.transmission} onChange={handleChange} />

      <label>구동 방식:</label>
      <input type="text" name="driveType" value={formData.driveType} onChange={handleChange} />

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
          {previewImages.map((imageObj) => (
            <div key={imageObj.key} className="image-preview">
              <img
                src={`${SERVER_URL}${imageObj.url}`}
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
              }}>X</button>
            </div>
          ))}
        </div>
      </label>

      <label>
        새 이미지 업로드:
        <input type="file" accept="image/*" multiple onChange={handleImageChange} />
      </label>

      <button type="submit">등록 완료</button>
    </form>
  );
};

export default AdminUsedCarAdd;
