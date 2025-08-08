import React from 'react';
import './LoadingModal.css';

const LoadingModal = ({ isLoading, message = "처리 중" }) => {
  if (!isLoading) return null;
  console.log("MODAL")
  return (
    <div className="loading-modal">
      <div className="loading-modal-content">
        <p>{message}</p>
        <div className="wave-text">
            <span> . </span><span> . </span><span> . </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;