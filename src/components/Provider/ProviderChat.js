import React, { useState, useEffect } from 'react';
import './ProviderChat.css';
import ProviderInfo from './ProviderInfo'; 
import '../LoadingModal/LoadingModal.css'

const ProviderChat = () => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [selectedSection, setSelectedSection] = useState('chat');
    const [reservations, setReservations] = useState([]); // 예약 기록
    const [reviews, setReviews] = useState([]); // 리뷰 정보
    const [error, setError] = useState(null); // 에러 상태

    // 대시보드 초기 메시지 출력
    useEffect(() => {
        const fetchWelcomeMessage = async () => {
            try {
                setChatHistory([...chatHistory, { sender: 'bot' }]);
                const response = await fetch(`http://${process.env.REACT_APP_API_URL}:8080/providerWelcome`, {
                    method: 'GET',
                });
                if (!response.ok) {
                    throw new Error('환영 메시지를 불러오지 못했습니다.');
                }
                const data = await response.json();
                setChatHistory((prev) => [
                    ...prev.slice(0, prev.length - 1 > 0 ? prev.length - 1 : 0),
                    { sender: 'bot', text: data.content },
                ]);
                console.log(data)
            } catch (err) {
                console.error('환영 메시지 요청 실패:', err);
            }
        };

        if (selectedSection === 'chat') {
            fetchWelcomeMessage();
        }
    }, []);


    // 채팅 기록 초기화 기능 (+New Chat)
    const handleNewChat = async () => {
            try {
                const response = await fetch(`http://${process.env.REACT_APP_API_URL}:8080/clsUser`, {
                    method: 'GET',
                });
                if (response.ok) {
                    console.log('채팅 기록 초기화 성공');
                    setChatHistory([]); 
                } else {
                    console.error('기록 초기화 실패:', response.status);
                }
            } catch (error) {
                console.error('기록 초기화 요청 실패:', error);
            }
        };

    // 제공자 에이전트와 chat
    const handleSendMessage = async () => {
        if (message.trim()) {
            setChatHistory([...chatHistory, { sender: 'user', text: message }, { sender: 'bot' }]);
            setMessage('');
    
            try {
                const response = await fetch(`http://${process.env.REACT_APP_API_URL}:8080/providerAgent`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ content: message }),
                });
                if (!response.ok) {
                    throw new Error('메시지 전송 실패');
                }
                const data = await response.json();
                setChatHistory((prev) => [...prev.slice(0, prev.length - 1), { sender: 'bot', text: data.content }]);
            } catch (err) {
                console.error('Bot 대화 실패:', err);
            }
        }
    };

    // 예약 기록 보기
    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await fetch(`http://${process.env.REACT_APP_API_URL}:8080/providerReservations`, {
                    method: 'GET',
                });

                if (!response.ok) {
                    throw new Error('데이터를 불러오지 못했습니다.');
                }
                const data = await response.json();
                setReservations(data.list || []); 
            } catch (err) {
                setError(err.message);
            }
        };
        fetchReservations(); 
    }, []);

    // 리뷰 받아오기
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`http://${process.env.REACT_APP_API_URL}:8080/providerReviews`, {
                    method: 'GET',
                });

                if (!response.ok) {
                    throw new Error('데이터를 불러오지 못했습니다.');
                }

                const data = await response.json();
                console.log('서버 응답:', data.list); // 서버에서 받은 전체 데이터 출력
                setReviews(data.list || []); 
            } catch (err) {
                console.error('오류 발생:', err);
                setError(err.message);
            }
        };
        fetchReviews();
    }, []);

    return (
    <div className="container">
        {/* 왼쪽 영역 */}
        <div className="left-section">
        <div className="logo-container">
            <img src={require('../Image/logo1.png')} alt="로고" className="logo" />
        </div>
        <div className="separator"></div>
        <div className="rec-newchat" onClick={handleNewChat}>+ New Chat</div>
        <div
            className={`rec-chat ${selectedSection === 'chat' ? 'active' : ''}`}
            onClick={() => setSelectedSection('chat')}
        >
            Chat
        </div>
        <div
            className={`rec-provider ${selectedSection === 'provider' ? 'active' : ''}`}
            onClick={() => setSelectedSection('provider')}
        >
            Space Info
        </div>
    </div>

    {/* 가운데 영역 */}
    <div className="center-section">
        <div className="blank"></div>
        {selectedSection === 'chat' || selectedSection === '' ? (
            <div className="chat">
                <div className="chat-history">
                    {chatHistory.map((chat, index) => (
                        <div 
                            key={index} 
                            className={`chat-message ${chat.sender} slide-up`}
                        >
                            {chat.sender === 'bot' && (
                                <img
                                    src={require('../Image/logo2.png')}
                                    alt="chatbot logo"
                                    className="chatbot-logo"
                                />
                            )}
                             {chat.text ? chat.text : <div className="wave-text"><span> . </span><span> . </span><span> . </span></div>}
                        </div>
                    ))}
                </div>                    
                <div className="input-container">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="  send a message... "
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSendMessage(); 
                            }
                        }}
                    />
                    <button onClick={handleSendMessage} className="button">
                        <img src={require('../Image/send.png')} alt="send" />
                    </button>
                </div>
            </div> 
        ) : selectedSection === 'provider' ? (
            <ProviderInfo />
        ) : null}
    </div>

    {/* 오른쪽 영역 */}
    <div className="right-section">
        <div className="blank"></div>
        <div className="provider-dashboard">
            <h3>예약 내역</h3>
            <div className="place-item">
                {reservations.length > 0 ? (
                    <ul>
                        {reservations.map((reservation, index) => (
                            <li key={index} className="slide-up" style={{
                                animationDelay: `${index * 0.3}s`,
                            }}>
                                <p>{formatDate(reservation.start_time)} ~ {formatDate(reservation.end_time)}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>예약 기록이 없습니다.</p>
                )}
            </div>
            <h3>리뷰 목록</h3>
            <div className="place-item">
                {reviews.length > 0 ? (
                    <ul>
                        {reviews.map((review, index) => (
                            <li key={index} className="slide-up" style={{
                                animationDelay: `${index * 0.3}s`,
                            }}>
                                <p>{review.content}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>리뷰 정보가 없습니다.</p>
                )}
            </div>
        </div>
    </div>
</div>
    );
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')} ` +
           `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`;
  };

export default ProviderChat;