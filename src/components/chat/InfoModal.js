import React from 'react';
import './InfoModal.css';

const InfoModal = ({ place, onClose, onPrev, onNext, isFirst, isLast }) => {
    
    const handleSelect = () => {
        const isConfirmed = window.confirm(`${place.name} 예약하시겠습니까?`);
        if (isConfirmed) {
            alert(`${place.name} 예약이 완료되었습니다.`); 
        } else {
            alert(`예약이 취소되었습니다.`); 
        }
    };

    if (!place) return null;

    return (
        <div className="modal-overlay">
            <button onClick={onPrev} disabled={isFirst} className="nav-button">◁</button>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                    <h2>Preview</h2>
                    <h3>{place.name}</h3>
                        {place.space_id >=1 && place.space_id <= 8 ? (
                    <div className="place-image">
                        <img src={require(`../Image/${place.space_id}.png`)} alt={place.name} style={{
                                    width: '750px',
                                    height: '750px',
                                    objectFit: 'cover',
                                  }}/>
                    </div>
                    ) : (
                    <div className="place-image">
                        <p> 이미지 준비 중.. </p>
                    </div>
                )}
                    <p>📍 {place.address}</p>
                    <p>{place.abstract}</p>
                </div>
                <div className="modal-button">
                    <div className="close">                    
                        <button onClick={onClose}>close</button>
                    </div>
                     {/* 
                    <div className="selection">
                        <button onClick={handleSelect}>select</button>
                    </div> */}
                </div>
            </div>            
            <button onClick={onNext} disabled={isLast} className="nav-button">▷</button>
        </div>
    );
};

export default InfoModal;