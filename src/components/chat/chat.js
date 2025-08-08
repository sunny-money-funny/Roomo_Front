import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Chat.css';
import InfoModal from './InfoModal';
import ReservationHistory from './ReservationHistory';
import '../LoadingModal/LoadingModal.css'
import { useNavigate } from 'react-router-dom';

const Chat = () => {
    const { state } = useLocation(); 
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [places, setPlaces] = useState([]);
    const [placeIndex, setPlaceIndex] = useState(null);
    const [selectedSection, setSelectedSection] = useState('chat');
    const navigate = useNavigate();

    // Home에서 Chat 화면에 들어오면 전달된 메시지를 chatHistory에 추가
    useEffect(() => {
        if (state && state.userMessage && state.botResponse) {
            console.log('Received state:', state); 
            if (state.spaceList) setPlaces(typeof state.spaceList === 'string' ? JSON.parse(state.spaceList) : state.spaceList)
            setChatHistory([
                { sender: 'user', text: state.userMessage },
                { sender: 'bot', text: state.botResponse }
            ]);
        } else {
            console.log('Updated places:', places);
        }
    }, [state]);

    useEffect(() => {
        console.log('Updated places:', places);
    }, [places]);
    

    // 채팅 기록 초기화 기능 (+New Chat)
    const handleNewChat = async () => {
            try {
                const response = await fetch(`http://${process.env.REACT_APP_API_URL}:8080/clsUser`, {
                    method: 'GET',
                });
                if (response.ok) {
                    console.log('채팅 기록 초기화 성공');
                    setChatHistory([]); // 채팅 기록 초기화
                    setPlaces([]); // 공간 목록 초기화
                } else {
                    console.error('기록 초기화 실패:', response.status);
                }
            } catch (error) {
                console.error('기록 초기화 요청 실패:', error);
            }
        };

    // Bot 대화
    const handleSendMessage = async () => {
        if (message.trim()) {
            setChatHistory([...chatHistory, { sender: 'user', text: message }, { sender: 'bot' }]);
            setMessage('');
    
            try {
                const response = await fetch(`http://${process.env.REACT_APP_API_URL}:8080/userAgent`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ "content": message }),
                });

                if (response.ok) {  
                    const data = await response.json();
                    console.log('서버 응답 데이터:', data);

                    if (data.type === 'text') {
                        setChatHistory((prevChatHistory) => [
                            ...prevChatHistory.slice(0, prevChatHistory.length - 1),
                            { sender: 'bot', text: data.content }, 
                        ]);
                    } 
                    else if (data.type === 'spaceList') {
                            setChatHistory((prevChatHistory) => [
                                ...prevChatHistory.slice(0, prevChatHistory.length - 1),
                                { sender: 'bot', text: data.content }, 
                            ]);

                        try {
                            const spaces = typeof data.list === 'string' ? JSON.parse(data.list) : data.list;
                            console.log('Parsed spaces:', spaces);

                            if (Array.isArray(spaces)) {
                                setPlaces(spaces); 
                            } 
                            else {
                                console.error('list가 배열이 아닙니다:', spaces);
                                setPlaces([]); 
                            }
                        } 
                        catch (error) {
                                console.error('list 파싱 오류:', error);
                                setPlaces([]);
                        }
                    } 
                    else {
                            console.error('알 수 없는 데이터 유형:', data.type);
                    }
                } 
                else if (response.status === 429) { 
                    console.warn('API 사용량 초과, 채팅 기록 초기화 필요!');
                    await handleNewChat();
                }
                else {
                    console.error('서버 응답 실패:', response.status);
                }
                
            }             
            catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    // 오른쪽 공간 정보 제공 모달
    const openModal = (index) => {
        setPlaceIndex(index); 
    };
    const closeModal = () => {
        setPlaceIndex(null); 
    };
    const handlePrevPlace = () => {
        setPlaceIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };
    const handleNextPlace = () => {
        setPlaceIndex((prevIndex) => Math.min(prevIndex + 1, places.length - 1));
    };
    
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
                    className={`rec-history ${selectedSection === 'reservation' ? 'active' : ''}`}
                    onClick={() => setSelectedSection('reservation')}
                >
                    Reservation History
                </div>
                <div
                    className={`rec-provider ${selectedSection === 'provider' ? 'active' : ''}`}
                    onClick={() => navigate('/provider')}
                >
                    Provider Dashboard
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
    ) : selectedSection === 'reservation' ? ( 
        <ReservationHistory places={places} />
    ) : null }
</div>

{/* 오른쪽 영역 */}
<div className="right-section">
    <div className="blank"></div>
    {selectedSection === 'chat' || selectedSection === 'reservation' ? (
        <div className="places-list-container">
            {places && Array.isArray(places) && places.length > 0 ? (
                <ul className="places-list">
                    {places.map((place, index) => (
                        <li key={place.space_id} className="place-item appear"
                        style={{
                            animationDelay: `${index * 0.3}s`,
                        }}
                        onClick={() => openModal(index)}>
                            {   
                                place.space_id >= 1 && place.space_id <= 8 ? (
                                <img src={require(`../Image/${place.space_id}.png`)} style={{
                                    width: '200px',
                                    height: '150px',
                                    objectFit: 'cover',
                                  }} alt="send" />
                                ) : (<div />)
                            }
                            <h3>{place.name}</h3>
                            <p>📍 {place.address}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>공간 목록이 없습니다.</p>
            )}
        </div>
    ) : (
        <p>선택된 섹션이 없습니다.</p>
    )}
</div>


            {/* 모달 컴포넌트 */}
            {placeIndex !== null && (
                <InfoModal
                    place={places[placeIndex]}
                    onClose={closeModal}
                    onPrev={handlePrevPlace}
                    onNext={handleNextPlace}
                    isFirst={placeIndex === 0}
                    isLast={placeIndex === places.length - 1}
                />
            )}
        </div>
    );
};

export default Chat;