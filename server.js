const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;

// JSON 형태로 데이터를 받기 위한 설정
app.use(bodyParser.json());

// POST 요청 처리
app.post('/userAgent', (req, res) => {
    console.log(req.body); // 요청 본문을 콘솔에 출력 (디버깅용)

    // 서버 응답
    res.json({
        type: "spaceList",
        agentResponse: "에이전트의 응답입니다. \n 개행 문자 \n 다음은 공간 목록입니다.",
        spaces: [
            {
                id: 1,
                name: "공간 A",
                description: "공간 A에 대한 설명입니다.",
                location: "서울",
                reviews: ["리뷰 1", "리뷰 2", "리뷰 3"],
            },
            {
                id: 2,
                name: "공간 B",
                description: "공간 B에 대한 설명입니다.",
                location: "부산",
                reviews: ["리뷰 3", "리뷰 4", "리뷰 1"],
            },
        ],
    });
});

// 서버 시작
app.listen(port, () => {
    console.log(`Mock server is running on http://localhost:${port}`);
});