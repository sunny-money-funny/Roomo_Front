import React, { useState } from 'react';
import './ReviewModal.css'; 

const ReviewModal = ({ isOpen, onClose, content, onSubmit, placeName }) => {
    const [reviewContent, setReviewContent] = useState(content || '');

    if (!isOpen) return null; // 모달이 열려 있지 않으면 아무것도 렌더링하지 않음

    const handleSubmit = () => {
        if (reviewContent.trim()) {
            onSubmit(reviewContent); // 리뷰 내용을 부모 컴포넌트로 전달
        } else {
            alert('리뷰 내용을 입력해주세요.');
        }
    };

    return (
        <div className="review-modal">
        <div className="review-box">
        <div className="review-content">
            {(() => {
                if (content) {
                    return (
                    <>
                    <h2>My Review</h2>
                    <h3>{placeName}</h3>
                    <div className="review-rectangle">
                        <p>{content}</p>
                    </div>
                    <button className="close-button" onClick={onClose}>
                        닫 기
                    </button>
                    </>
                    );
                } else {
                    return (
                    <>
                    <h2>리뷰 작성</h2>
                    <h3>{placeName}</h3>
                    <textarea value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        placeholder="리뷰를 입력하세요" 
                        className="textarea-style" />
                    <div className="review-button">
                        <button className="submit-button" onClick={handleSubmit}>
                            submit
                        </button>
                        <button className="close-button" onClick={onClose}>
                            close
                        </button>
                    </div>
                    </>
                    );
                }
            }
            )()}
        </div>
        </div>
        </div>
    );
};

export default ReviewModal;