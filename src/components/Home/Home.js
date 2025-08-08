import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import '../LoadingModal/LoadingModal'
import LoadingModal from '../LoadingModal/LoadingModal';

const Home = () => {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();     

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("handleSubmit 호출됨");
        setIsLoading(true)
        if (input.trim()) {
            try {
                const response = await fetch(`http://${process.env.REACT_APP_API_URL}:8080/userAgent`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ "content": input })
                });

                if (response.ok) {
                    console.log("서버 응답 성공");
                    const data = await response.json();
                    setIsLoading(false)
                    
                    if (data.type == 'text')
                        navigate('/Chat', { state: { userMessage: input, botResponse: data.content } });
                    else
                        navigate('/Chat', { state: { userMessage: input, botResponse: data.content, spaceList: data.list } });

                } else {
                    console.error('서버 응답 오류:', response.status);
                    const errorData = await response.json(); 
                    console.error('서버 오류 메시지:', errorData);
                }
            } catch (error) {
                console.error('요청 실패:', error);
            }
        }    
    };

    const handleSendMessage = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    return (
        <>
            <div className="rectangle">
                <div className="logo box">
                <Link to="/" className="logoImage" />
                </div>
                <div className="prompt-bar1">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="we'll find the perfect place for you!"
                        onKeyDown={handleSendMessage}
                    />
                </div>
            </div>
            <LoadingModal isLoading={isLoading}/>
            </>
    );
    
};

export default Home;