# Ennoia Preset Chat Completion API

`test_neo` 페이지에서 사용하는 Ennoia preset chat completion API 사용 메모입니다.

## Endpoint

```txt
POST https://api.ennoia.so/api/preset/v2/chat/completions
```

## Headers

```json
{
  "project": "KNTO-PROMPTON-2026-215",
  "apiKey": "${ENNOIA_API_KEY}",
  "Content-Type": "application/json; charset=utf-8"
}
```

API 키는 코드나 문서에 직접 저장하지 말고 환경변수로 관리합니다.

## Request Body

```json
{
  "hash": "698313ebecbe2f3f772af3050a4a52dccff5a59e46f3c90d6237a20fe3e2b86b",
  "params": {},
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "요청 프롬프트를 입력해주세요"
        }
      ]
    }
  ]
}
```

`messages[0].content[0].text`에 사용자 요청문을 넣습니다. 예를 들어 법정동 코드 기준으로 지역 관광 정보를 묻는 경우 아래처럼 보낼 수 있습니다.

```txt
lDongRegnCd 26(부산) 관광지 10곳 알려줘
```

## Response Shape

성공 시 HTTP 200과 함께 아래 형태의 응답이 옵니다.

```json
{
  "id": "chatcmpl-...",
  "object": "chat.completion.chunk",
  "created": 1779982078086,
  "model": "openai/gpt-5",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": [
          {
            "type": "text",
            "text": "응답 텍스트"
          }
        ],
        "tool_calls": []
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 1594,
    "completion_tokens": 972,
    "total_tokens": 2566
  },
  "connector_results": [],
  "connector_result_yn": "N",
  "session_id": "..."
}
```

화면에 표시할 답변은 보통 `choices[0].message.content[0].text`에서 읽습니다.

## Axios Example

```js
const axios = require("axios");

async function requestChatCompletion(promptText) {
  const headers = {
    project: "KNTO-PROMPTON-2026-215",
    apiKey: process.env.ENNOIA_API_KEY,
    "Content-Type": "application/json; charset=utf-8",
  };

  const body = {
    hash: "698313ebecbe2f3f772af3050a4a52dccff5a59e46f3c90d6237a20fe3e2b86b",
    params: {},
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: promptText,
          },
        ],
      },
    ],
  };

  const response = await axios.post(
    "https://api.ennoia.so/api/preset/v2/chat/completions",
    body,
    { headers },
  );

  return response.data;
}
```

## 법정동 코드

현재 확보된 지역 코드 목록입니다. 원본 응답 기준 `totalCount`는 17이고, 아래 표는 전달받은 첫 10개 항목입니다.

| code | name |
| --- | --- |
| 11 | 서울특별시 |
| 26 | 부산광역시 |
| 27 | 대구광역시 |
| 28 | 인천광역시 |
| 29 | 광주광역시 |
| 30 | 대전광역시 |
| 31 | 울산광역시 |
| 41 | 경기도 |
| 43 | 충청북도 |
| 44 | 충청남도 |

## 관광지 분류코드

상위 분류코드 객체의 `value`에 하위 분류코드를 배열로 포함합니다.

```json
[
  {
    "code": "AC",
    "name": "숙박",
    "rnum": 1,
    "value": [
      { "code": "AC01", "name": "호텔", "rnum": 1 },
      { "code": "AC02", "name": "콘도미니엄", "rnum": 2 },
      { "code": "AC03", "name": "펜션/민박", "rnum": 3 },
      { "code": "AC04", "name": "모텔", "rnum": 4 },
      { "code": "AC05", "name": "캠핑", "rnum": 5 },
      { "code": "AC06", "name": "호스텔", "rnum": 6 }
    ]
  },
  {
    "code": "C01",
    "name": "추천코스",
    "rnum": 2,
    "value": [
      { "code": "C0112", "name": "가족코스", "rnum": 1 },
      { "code": "C0113", "name": "나홀로코스", "rnum": 2 },
      { "code": "C0114", "name": "힐링코스", "rnum": 3 },
      { "code": "C0115", "name": "도보코스", "rnum": 4 },
      { "code": "C0116", "name": "캠핑코스", "rnum": 5 },
      { "code": "C0117", "name": "맛코스", "rnum": 6 }
    ]
  },
  {
    "code": "EV",
    "name": "축제/공연/행사",
    "rnum": 3,
    "value": [
      { "code": "EV01", "name": "축제", "rnum": 1 },
      { "code": "EV02", "name": "공연", "rnum": 2 },
      { "code": "EV03", "name": "행사", "rnum": 3 }
    ]
  },
  {
    "code": "EX",
    "name": "체험관광",
    "rnum": 4,
    "value": [
      { "code": "EX01", "name": "전통체험", "rnum": 1 },
      { "code": "EX02", "name": "공예체험", "rnum": 2 },
      { "code": "EX03", "name": "농.산.어촌 체험", "rnum": 3 },
      { "code": "EX04", "name": "산사체험", "rnum": 4 },
      { "code": "EX05", "name": "웰니스관광", "rnum": 5 },
      { "code": "EX06", "name": "산업관광", "rnum": 6 },
      { "code": "EX07", "name": "기타체험", "rnum": 7 }
    ]
  },
  {
    "code": "FD",
    "name": "음식",
    "rnum": 5,
    "value": [
      { "code": "FD01", "name": "한식", "rnum": 1 },
      { "code": "FD02", "name": "외국식", "rnum": 2 },
      { "code": "FD03", "name": "간이음식", "rnum": 3 },
      { "code": "FD04", "name": "주점", "rnum": 4 },
      { "code": "FD05", "name": "카페/ 찻집", "rnum": 5 }
    ]
  },
  {
    "code": "HS",
    "name": "역사관광",
    "rnum": 6,
    "value": [
      { "code": "HS01", "name": "역사유적지", "rnum": 1 },
      { "code": "HS02", "name": "역사유물", "rnum": 2 },
      { "code": "HS03", "name": "종교성지", "rnum": 3 },
      { "code": "HS04", "name": "안보관광지", "rnum": 4 }
    ]
  },
  {
    "code": "LS",
    "name": "레저스포츠",
    "rnum": 7,
    "value": [
      { "code": "LS01", "name": "육상레저스포츠", "rnum": 1 },
      { "code": "LS02", "name": "수상레저스포츠", "rnum": 2 },
      { "code": "LS03", "name": "항공레저스포츠", "rnum": 3 },
      { "code": "LS04", "name": "복합레저스포츠", "rnum": 4 }
    ]
  },
  {
    "code": "NA",
    "name": "자연관광",
    "rnum": 8,
    "value": [
      { "code": "NA01", "name": "자연경관(산)", "rnum": 1 },
      { "code": "NA02", "name": "자연경관(하천‧해양)", "rnum": 2 },
      { "code": "NA03", "name": "자연생태", "rnum": 3 },
      { "code": "NA04", "name": "자연공원", "rnum": 4 },
      { "code": "NA05", "name": "기타자연관광", "rnum": 5 }
    ]
  },
  {
    "code": "SH",
    "name": "쇼핑",
    "rnum": 9,
    "value": [
      { "code": "SH01", "name": "백화점", "rnum": 1 },
      { "code": "SH02", "name": "쇼핑몰", "rnum": 2 },
      { "code": "SH03", "name": "대형마트", "rnum": 3 },
      { "code": "SH04", "name": "면세점", "rnum": 4 },
      { "code": "SH05", "name": "전문매장/상가", "rnum": 5 },
      { "code": "SH06", "name": "시장", "rnum": 6 },
      { "code": "SH07", "name": "기타쇼핑시설", "rnum": 7 }
    ]
  },
  {
    "code": "VE",
    "name": "문화관광",
    "rnum": 10,
    "value": [
      { "code": "VE01", "name": "랜드마크관광", "rnum": 1 },
      { "code": "VE02", "name": "테마공원", "rnum": 2 },
      { "code": "VE03", "name": "도시공원", "rnum": 3 },
      { "code": "VE04", "name": "도시.지역문화관광", "rnum": 4 },
      { "code": "VE05", "name": "복합관광시설", "rnum": 5 },
      { "code": "VE06", "name": "공연시설", "rnum": 6 },
      { "code": "VE07", "name": "전시시설", "rnum": 7 },
      { "code": "VE08", "name": "행사시설", "rnum": 8 },
      { "code": "VE09", "name": "교육시설", "rnum": 9 },
      { "code": "VE10", "name": "레저스포츠시설", "rnum": 10 }
    ]
  }
]
```

| 상위 code | 상위 name | 하위 code |
| --- | --- | --- |
| AC | 숙박 | AC01 호텔, AC02 콘도미니엄, AC03 펜션/민박, AC04 모텔, AC05 캠핑, AC06 호스텔 |
| C01 | 추천코스 | C0112 가족코스, C0113 나홀로코스, C0114 힐링코스, C0115 도보코스, C0116 캠핑코스, C0117 맛코스 |
| EV | 축제/공연/행사 | EV01 축제, EV02 공연, EV03 행사 |
| EX | 체험관광 | EX01 전통체험, EX02 공예체험, EX03 농.산.어촌 체험, EX04 산사체험, EX05 웰니스관광, EX06 산업관광, EX07 기타체험 |
| FD | 음식 | FD01 한식, FD02 외국식, FD03 간이음식, FD04 주점, FD05 카페/ 찻집 |
| HS | 역사관광 | HS01 역사유적지, HS02 역사유물, HS03 종교성지, HS04 안보관광지 |
| LS | 레저스포츠 | LS01 육상레저스포츠, LS02 수상레저스포츠, LS03 항공레저스포츠, LS04 복합레저스포츠 |
| NA | 자연관광 | NA01 자연경관(산), NA02 자연경관(하천‧해양), NA03 자연생태, NA04 자연공원, NA05 기타자연관광 |
| SH | 쇼핑 | SH01 백화점, SH02 쇼핑몰, SH03 대형마트, SH04 면세점, SH05 전문매장/상가, SH06 시장, SH07 기타쇼핑시설 |
| VE | 문화관광 | VE01 랜드마크관광, VE02 테마공원, VE03 도시공원, VE04 도시.지역문화관광, VE05 복합관광시설, VE06 공연시설, VE07 전시시설, VE08 행사시설, VE09 교육시설, VE10 레저스포츠시설 |
