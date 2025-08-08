# Roomo - AI 기반 공간 추천 및 예약 플랫폼

Roomo는 사용자의 요구에 맞춰 최적의 공간을 추천하고 예약할 수 있도록 돕는 AI 기반 웹 애플리케이션입니다. 자연어 입력을 통해 원하는 공간을 찾고, 예약 및 리뷰를 관리할 수 있습니다. 또한, 공간 제공자를 위한 대시보드를 통해 예약 및 리뷰 현황을 손쉽게 파악할 수 있습니다.

## ✨ 주요 기능

### 🙋 사용자 (User)

- **AI 챗봇을 통한 공간 검색**: "강남역 근처에 회의할 만한 조용한 공간 찾아줘"와 같이 자연어로 원하는 공간을 검색할 수 있습니다.
- **공간 정보 확인**: 추천된 공간의 이미지, 주소, 상세 설명을 모달을 통해 확인할 수 있습니다.
- **예약 관리**: 예약 내역을 조회하고, 필요시 예약을 취소할 수 있습니다.
- **리뷰 작성 및 관리**: 이용 완료한 공간에 대해 리뷰를 작성하거나 기존에 작성한 리뷰를 확인할 수 있습니다.

### 🧑‍💼 공간 제공자 (Provider)

- **대시보드**: 등록한 공간의 전체 예약 현황과 사용자 리뷰를 한눈에 파악할 수 있습니다.
- **AI 챗봇**: 공간 관리, 수익 분석 등 제공자에게 필요한 정보를 AI 챗봇을 통해 얻을 수 있습니다.

## 🖼️ UI 미리보기

| 홈 | 챗봇 (공간 추천) |
| :---: | :---: |
| <img src="https://user-images.githubusercontent.com/your-username/your-repo/assets/home.png" width="400"> | <img src="https://user-images.githubusercontent.com/your-username/your-repo/assets/chat.png" width="400"> |
| **예약 내역** | **공간 제공자 대시보드** |
| <img src="https://user-images.githubusercontent.com/your-username/your-repo/assets/reservation.png" width="400"> | <img src="https://user-images.githubusercontent.com/your-username/your-repo/assets/provider.png" width="400"> |

*UI 미리보기 이미지는 실제 화면과 다를 수 있습니다.*

## ⚙️ 기술 스택

- **Frontend**: React (Create React App)
- **Routing**: React Router
- **API Communication**: Axios, Fetch
- **Styling**: CSS
- **Backend (Mock)**: Express.js

## 🚀 시작하기

### 1. 프로젝트 클론

```bash
git clone https://github.com/your-username/Roomo_Front.git
cd Roomo_Front
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

프로젝트 루트 디렉토리에 `.env` 파일을 생성하고, 다음과 같이 API 서버 주소를 설정합니다.

```
REACT_APP_API_URL=localhost
```

### 4. 개발 서버 실행

```bash
npm start
```

애플리케이션은 `http://localhost:3000` 에서 실행됩니다.

### 5. 목 서버 실행

별도의 터미널에서 목업 서버를 실행합니다.

```bash
node server.js
```

목 서버는 `http://localhost:8080` 에서 실행됩니다.

## 📁 프로젝트 구조

```
src/
├── components/         # UI 컴포넌트
│   ├── Home/           # 메인 페이지
│   ├── Chat/           # 사용자 채팅 및 공간 추천
│   ├── Provider/       # 공간 제공자 대시보드
│   ├── LoadingModal/   # 로딩 모달
│   └── Image/          # 공용 이미지
├── App.js              # 메인 애플리케이션 및 라우터
├── index.js            # 애플리케이션 진입점
└── ...
```