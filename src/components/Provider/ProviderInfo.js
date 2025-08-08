import React, { useState, useEffect } from 'react';
import './ProviderInfo.css';
import LoadingModal from '../LoadingModal/LoadingModal';

const ProviderInfo = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    type: '',
    price: '',
    capacity: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  // 서버에서 데이터 받아오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://${process.env.REACT_APP_API_URL}:8080/providerSpace`);
        if (response.ok) {
          const data = await response.json();          
          setFormData(data.space);
        } else {
          throw new Error('공간 정보 로드 실패');
        }
      } catch (error) {
        console.error('Error fetching space information:', error);
      }
    };

    fetchData(); 
  }, []); 

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 폼 제출 핸들러 (async로 변경)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      // PUT 요청을 통해 공간 정보 수정
      const response = await fetch(`http://${process.env.REACT_APP_API_URL}:8080/providerSpace`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          space: formData, 
        }),
      });

      if (response.ok) {
        // 응답을 JSON으로 파싱하여 처리
        const responseData = await response.json();
        console.log("서버에서 받은 응답:", responseData); 
        console.log("API URL:", process.env.REACT_APP_API_URL);


        // 수정이 성공적으로 완료되면 부모 컴포넌트에 데이터 전달
        // onSubmit(formData);
        alert('공간 정보가 수정되었습니다!');
      } else {
        throw new Error('공간 정보 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error updating space information:', error);
      alert('공간 정보 수정에 실패했습니다.');
    }
    setIsLoading(false);
  };

  return (
    <div className="space-container">
      <LoadingModal isLoading={isLoading} />
      <form onSubmit={handleSubmit} className="space-form">
        <h2>My Space Information</h2>
        <label>
          공간 이름:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={formData.name || "공간 이름을 입력하세요"}
          />
        </label>

        <label>
          주소:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder={formData.address || "주소를 입력하세요"}
          />
        </label>

        <label>
          공간 설명:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder={formData.description || "공간에 대한 설명을 입력하세요"}
          />
        </label>

        <label>
          공간 유형:
          <input
            type="text"
            name="type"  
            value={formData.space_type}
            onChange={handleChange}
            placeholder={formData.space_type || "공간유형을 입력하세요"}
          />
        </label>

        <label>
          가격:
          <input
          type="text" // 숫자가 아닌 일반 텍스트 입력 필드로 변경
          name="price"
          value={formData.price || ''}
          onChange={(e) => {
          // 쉼표를 제거한 숫자만 처리
           const value = e.target.value.replace(/,/g, '');
          if (!isNaN(value) || value === '') { // 숫자만 허용, 비어있을 경우도 허용
          handleChange({
          target: {
            name: 'price',
            value: value,
          },
        });
       }
       }}
        placeholder={formData.price ? formData.price.toLocaleString() : "가격을 입력하세요"}
  />
</label>

        <label>
          수용 인원:
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            placeholder={formData.capacity || "수용 인원을 입력하세요"}
          />
        </label>

        {/* 정보 제출 버튼 추가 */}
        <button type="submit">
          submit
        </button>

      </form>
    </div>
  );
};

export default ProviderInfo;