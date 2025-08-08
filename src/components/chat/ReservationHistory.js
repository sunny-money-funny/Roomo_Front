import React, { useEffect, useState } from 'react';
import ReviewModal from './ReviewModal';
import './ReservationHistory.css'; 

const ReservationHistory = () => {
    const [places, setPlaces] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [currentPlace, setCurrentPlace] = useState(null);

    useEffect(() => {
    const fetchReservations = async () => {
            try {
                const response = await fetch(`http://${process.env.REACT_APP_API_URL}:8080/userReservation/0`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
    
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
    
                const data = await response.json();
                setPlaces(data.list);
                console.log(data);  // 서버 응답 확인    
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchReservations();
    }, []);

    // 예약 삭제
    const deleteReservation = async (reservationId) => {
        console.log('Deleting reservation with ID:', reservationId);

        if (!window.confirm('정말로 이 예약을 삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`http://${process.env.REACT_APP_API_URL}:8080/reservation/${reservationId}`, {
                method: 'DELETE',
            });

            console.log('Server response:', response);

            if (!response.ok) {
                throw new Error(`Failed to delete reservation! Status: ${response.status}`);
            }

            setPlaces((prevPlaces) => prevPlaces.filter((place) => place.reservation_id  !== reservationId));
            alert('예약이 삭제되었습니다.');

        } catch (err) {
            alert(`삭제에 실패했습니다: ${err.message}`);
        }
    };

    // 리뷰 조회
    const handleReviewClick = async (place) => {
        if (place.reviewed === 1) {
            try {
                const response = await fetch(`http://${process.env.REACT_APP_API_URL}:8080/review/${place.space_id}`, {
                    method: 'GET',
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch review! Status: ${response.status}`);
                }

                const data = await response.json();
                setModalContent(data.content); 
                setCurrentPlace(null);
                setIsModalOpen(true);
            } catch (err) {
                alert(`리뷰 조회에 실패했습니다: ${err.message}`);
            }
        } else {
            // 리뷰 작성
            setModalContent(''); // 새 리뷰 작성 시 내용 초기화
            setCurrentPlace(place);
            setIsModalOpen(true);
        }
    };

    // 리뷰 작성
    const handleSubmitReview = async (content) => {
        if (!content) {
            alert('리뷰 내용을 작성해주세요.');
            return;
        }

        try {
            const response = await fetch(`http://${process.env.REACT_APP_API_URL}:8080/review/${currentPlace.space_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content }),
            });

            if (!response.ok) {
                throw new Error(`Failed to post review! Status: ${response.status}`);
            }

            setPlaces((prevPlaces) =>
                prevPlaces.map((place) => {
                    if (place.id === currentPlace.place_id) {
                        return { ...place, reviewed: 1 };
                    }
                    return place;
                })
            );

            alert('리뷰가 성공적으로 작성되었습니다.');
            setIsModalOpen(false);
        } catch (err) {
            alert(`리뷰 작성에 실패했습니다: ${err.message}`);
        }
    };

    if (loading) {
        return <p>Loading reservations...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="history-container">
            <div className="gray-container">
                <h2>Reservation History</h2>
                <ul>
                    {places.length > 0 ? (
                        places.map((place) => (
                            <li key={place.id} className="reservation-item">
                                 {/* 이미지 부분 
                                <img
                                    src={require('./room1.jpg')}
                                    alt={place.name}
                                    className="reservedPlace-image"
                                />                      
                                이미지 부분 */}          
                                <div className="reservedPlace-details">
                                    <h3>{place.space_name}</h3>
                                    <p>📍 {place.space_address}</p>
                                    <p>{place.space_abstract}</p>
                                    <p>🕒 이용시간: {formatDate(place.reservation_start_time)} ~ {formatDate(place.reservation_end_time)}</p>
                                    <button className="review-button" onClick={() => handleReviewClick(place)}>
                                        {place.reviewed === 1 ? '리뷰 확인' : '리뷰 작성'}
                                    </button>
                                    <button
                                        className="delete-button"
                                        onClick={() => {
                                            console.log('Place object:', place);
                                            if (!place.reservation_id) {
                                                console.error('place.reservation_id is undefined!');
                                                return;
                                            }
                                            deleteReservation(place.reservation_id)}
                                        }
                                    >
                                        예약 삭제
                                    </button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>No reservations yet.</p>
                    )}
                </ul>
            </div>
            {isModalOpen && (
             <ReviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)} // 모달 닫기 핸들러
                content={modalContent} // 모달에 표시할 리뷰 내용
                onSubmit={handleSubmitReview} // 리뷰 작성 시 호출
                placeName={currentPlace?.space_name || ''} // 공간 이름 전달
            />
            )}            
        </div>
    );
};
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')} ` +
           `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`;
  };
  
export default ReservationHistory;