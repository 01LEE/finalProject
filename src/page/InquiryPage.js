import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../lib/apiAxios";
import "../css/InquiryPage.css";

const InquiryPage = () => {
  const [posts, setPosts] = useState([]);
  const [isWriting, setIsWriting] = useState(false);
  const [category, setCategory] = useState("렌트카");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const userNo = 1;
  const navigate = useNavigate();

  // ✅ 페이징을 위한 상태 추가
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10; // ✅ 한 페이지에 표시할 게시글 개수

  // ✅ 모든 게시글 불러오기
  const fetchPosts = () => {
    axios.get("/posts")
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("❌ 게시글 불러오기 오류:", err));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ✅ 글쓰기 버튼 클릭
  const handleWriteClick = () => {
    setIsWriting(true);
    setTitle("");
    setContent("");
  };

  // ✅ 게시글 등록
  const handlePostSubmit = () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력하세요.");
      return;
    }

    axios.post("/posts/create", { userNo, title, content })
      .then(() => {
        setIsWriting(false);
        fetchPosts(); // ✅ 등록 후 목록 새로고침
      })
      .catch((err) => console.error("❌ 게시글 등록 오류:", err));
  };

  // ✅ 페이지네이션 관련 로직
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <div className="container">
      <nav className="sidebar">
        <ul>
          <li onClick={() => navigate("/customer-service")} className="menu-item">대여 자격 및 안내</li>
          <li onClick={() => navigate("/customer-service")} className="menu-item">계약조건</li>
          <li onClick={() => navigate("/customer-service")} className="menu-item">예약금 및 취소·환불 규정</li>
          <li onClick={() => navigate("/inquiry")} className="menu-item active">문의하기</li>
        </ul>
      </nav>

      <div className="inquiry-content">
        <div className="inquiry-box">
          <h2>📢 문의 게시판</h2>
          <button onClick={handleWriteClick} className="write-button">글쓰기</button>

          {isWriting && (
            <div className="write-form">
              <h3>📝 글쓰기</h3>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="category-select">
                <option value="렌트카">렌트카</option>
                <option value="중고차">중고차</option>
                <option value="차량용품">차량용품</option>
              </select>
              <input type="text" placeholder="제목을 입력하세요" value={title} onChange={(e) => setTitle(e.target.value)} />
              <textarea placeholder="내용을 입력하세요..." value={content} onChange={(e) => setContent(e.target.value)} />
              <div className="button-group">
                <button onClick={handlePostSubmit} className="submit-button">등록</button>
                <button onClick={() => setIsWriting(false)} className="cancel-button">취소</button>
              </div>
            </div>
          )}

          {/* ✅ 게시판 목록 (페이징 적용) */}
          <div className="inquiry-list">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>제목</th>
                  <th>작성일</th>
                </tr>
              </thead>
              <tbody>
                {currentPosts.map((post, index) => (
                  <tr key={post.postNo} onClick={() => navigate(`/inquiry/${post.postNo}`)} style={{ cursor: "pointer" }}>
                    <td>{indexOfFirstPost + index + 1}</td>
                    <td>{post.title}</td>
                    <td>{new Date(post.createDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ 페이지네이션 버튼 추가 */}
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              이전
            </button>
            <span className="page-info">{currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              다음
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InquiryPage;
