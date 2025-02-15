import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../lib/apiAxios";
import "../css/PostDetailPage.css";

const PostDetailPage = () => {
  const { postNo } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const userNo = 1; // TODO: 실제 로그인한 유저 ID로 변경 필요

  // ✅ 게시글 데이터 불러오기
  useEffect(() => {
    axios.get(`/posts/${postNo}`)
      .then((res) => setPost(res.data))
      .catch((err) => console.error("❌ 게시글 불러오기 오류:", err));

    fetchComments();
  }, [postNo]);

  // ✅ 댓글 목록 불러오기
  const fetchComments = () => {
    axios.get(`/comments/${postNo}`)
      .then((res) => setComments(res.data))
      .catch((err) => console.error("❌ 댓글 불러오기 오류:", err));
  };

  // ✅ 댓글 등록
  const handleCommentSubmit = () => {
    if (!commentContent.trim()) {
      alert("댓글을 입력하세요.");
      return;
    }

    axios.post("/comments", { postNo, userNo, content: commentContent }) // ✅ 경로 수정됨
      .then(() => {
        setCommentContent("");
        fetchComments(); // ✅ 댓글 목록 새로고침
      })
      .catch((err) => console.error("❌ 댓글 등록 오류:", err));
  };

  if (!post) return <p>게시글을 불러오는 중...</p>;

  return (
    <div className="container">
      {/* ✅ 사이드바 추가 */}
      <nav className="sidebar">
        <ul>
          <li onClick={() => navigate("/customer-service")} className="menu-item">대여 자격 및 안내</li>
          <li onClick={() => navigate("/customer-service")} className="menu-item">계약조건</li>
          <li onClick={() => navigate("/customer-service")} className="menu-item">예약금 및 취소·환불 규정</li>
          <li onClick={() => navigate("/inquiry")} className="menu-item active">문의하기</li>
        </ul>
      </nav>

      {/* ✅ 게시글 내용 */}
      <div className="post-detail-content">
        <div className="post-detail-box">
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <button className="back-button" onClick={() => navigate(-1)}>뒤로가기</button>

          {/* ✅ 댓글 영역 */}
          <h3>댓글</h3>
          {comments.length === 0 ? (
            <p>아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
          ) : (
            <ul className="comment-list">
              {comments.map((c) => (
                <li key={c.commentNo}>{c.content}</li>
              ))}
            </ul>
          )}

          {/* ✅ 댓글 입력 */}
          <textarea 
            value={commentContent} 
            onChange={(e) => setCommentContent(e.target.value)} 
            placeholder="댓글을 입력하세요..."
          />
          <button className="comment-submit-button" onClick={handleCommentSubmit}>댓글 등록</button>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
