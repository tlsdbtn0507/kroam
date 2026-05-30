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

상위 분류코드 객체의 `value`에 2단계 분류코드를 포함하고, 각 2단계 분류코드의 `value`에 3단계 하위 분류코드를 포함합니다.

```json
[
  {
    "code": "AC",
    "name": "숙박",
    "rnum": 1,
    "value": [
      {
        "code": "AC01",
        "name": "호텔",
        "rnum": 1,
        "value": [
          {
            "code": "AC010100",
            "name": "호텔",
            "rnum": 1
          }
        ]
      },
      {
        "code": "AC02",
        "name": "콘도미니엄",
        "rnum": 2,
        "value": [
          {
            "code": "AC020100",
            "name": "콘도",
            "rnum": 1
          },
          {
            "code": "AC020200",
            "name": "레지던스",
            "rnum": 2
          }
        ]
      },
      {
        "code": "AC03",
        "name": "펜션/민박",
        "rnum": 3,
        "value": [
          {
            "code": "AC030100",
            "name": "펜션",
            "rnum": 1
          },
          {
            "code": "AC030200",
            "name": "한옥스테이",
            "rnum": 2
          },
          {
            "code": "AC030300",
            "name": "농어촌민박",
            "rnum": 3
          },
          {
            "code": "AC030400",
            "name": "홈스테이",
            "rnum": 4
          }
        ]
      },
      {
        "code": "AC04",
        "name": "모텔",
        "rnum": 4,
        "value": [
          {
            "code": "AC040100",
            "name": "모텔",
            "rnum": 1
          }
        ]
      },
      {
        "code": "AC05",
        "name": "캠핑",
        "rnum": 5,
        "value": [
          {
            "code": "AC050100",
            "name": "일반야영장",
            "rnum": 1
          },
          {
            "code": "AC050200",
            "name": "오토캠핑장",
            "rnum": 2
          },
          {
            "code": "AC050300",
            "name": "카라반",
            "rnum": 3
          },
          {
            "code": "AC050400",
            "name": "글램핑장",
            "rnum": 4
          }
        ]
      },
      {
        "code": "AC06",
        "name": "호스텔",
        "rnum": 6,
        "value": [
          {
            "code": "AC060100",
            "name": "유스호스텔",
            "rnum": 1
          },
          {
            "code": "AC060200",
            "name": "게스트하우스",
            "rnum": 2
          }
        ]
      }
    ]
  },
  {
    "code": "C01",
    "name": "추천코스",
    "rnum": 2,
    "value": [
      {
        "code": "C0112",
        "name": "가족코스",
        "rnum": 1,
        "value": [
          {
            "code": "C01120001",
            "name": "가족코스",
            "rnum": 1
          }
        ]
      },
      {
        "code": "C0113",
        "name": "나홀로코스",
        "rnum": 2,
        "value": [
          {
            "code": "C01130001",
            "name": "나홀로코스",
            "rnum": 1
          }
        ]
      },
      {
        "code": "C0114",
        "name": "힐링코스",
        "rnum": 3,
        "value": [
          {
            "code": "C01140001",
            "name": "힐링코스",
            "rnum": 1
          }
        ]
      },
      {
        "code": "C0115",
        "name": "도보코스",
        "rnum": 4,
        "value": [
          {
            "code": "C01150001",
            "name": "도보코스",
            "rnum": 1
          }
        ]
      },
      {
        "code": "C0116",
        "name": "캠핑코스",
        "rnum": 5,
        "value": [
          {
            "code": "C01160001",
            "name": "캠핑코스",
            "rnum": 1
          }
        ]
      },
      {
        "code": "C0117",
        "name": "맛코스",
        "rnum": 6,
        "value": [
          {
            "code": "C01170001",
            "name": "맛코스",
            "rnum": 1
          }
        ]
      }
    ]
  },
  {
    "code": "EV",
    "name": "축제/공연/행사",
    "rnum": 3,
    "value": [
      {
        "code": "EV01",
        "name": "축제",
        "rnum": 1,
        "value": [
          {
            "code": "EV010100",
            "name": "문화관광축제",
            "rnum": 1
          },
          {
            "code": "EV010200",
            "name": "문화예술축제",
            "rnum": 2
          },
          {
            "code": "EV010300",
            "name": "지역특산물축제",
            "rnum": 3
          },
          {
            "code": "EV010400",
            "name": "전통역사축제",
            "rnum": 4
          },
          {
            "code": "EV010500",
            "name": "생태자연축제",
            "rnum": 5
          },
          {
            "code": "EV010600",
            "name": "기타축제",
            "rnum": 6
          }
        ]
      },
      {
        "code": "EV02",
        "name": "공연",
        "rnum": 2,
        "value": [
          {
            "code": "EV020100",
            "name": "전통공연",
            "rnum": 1
          },
          {
            "code": "EV020200",
            "name": "연극",
            "rnum": 2
          },
          {
            "code": "EV020300",
            "name": "뮤지컬",
            "rnum": 3
          },
          {
            "code": "EV020400",
            "name": "오페라",
            "rnum": 4
          },
          {
            "code": "EV020500",
            "name": "무용",
            "rnum": 5
          },
          {
            "code": "EV020600",
            "name": "클래식음악회",
            "rnum": 6
          },
          {
            "code": "EV020700",
            "name": "대중콘서트",
            "rnum": 7
          },
          {
            "code": "EV020800",
            "name": "영화",
            "rnum": 8
          },
          {
            "code": "EV020900",
            "name": "기타공연",
            "rnum": 9
          },
          {
            "code": "EV021000",
            "name": "넌버벌",
            "rnum": 10
          }
        ]
      },
      {
        "code": "EV03",
        "name": "행사",
        "rnum": 3,
        "value": [
          {
            "code": "EV030100",
            "name": "전시회",
            "rnum": 1
          },
          {
            "code": "EV030200",
            "name": "박람회",
            "rnum": 2
          },
          {
            "code": "EV030300",
            "name": "스포츠경기",
            "rnum": 3
          },
          {
            "code": "EV030400",
            "name": "기타행사",
            "rnum": 4
          }
        ]
      }
    ]
  },
  {
    "code": "EX",
    "name": "체험관광",
    "rnum": 4,
    "value": [
      {
        "code": "EX01",
        "name": "전통체험",
        "rnum": 1,
        "value": [
          {
            "code": "EX010100",
            "name": "전통문화체험",
            "rnum": 1
          }
        ]
      },
      {
        "code": "EX02",
        "name": "공예체험",
        "rnum": 2,
        "value": [
          {
            "code": "EX020100",
            "name": "금속공예체험",
            "rnum": 1
          },
          {
            "code": "EX020200",
            "name": "유리공예체험",
            "rnum": 2
          },
          {
            "code": "EX020300",
            "name": "가죽공예체험",
            "rnum": 3
          },
          {
            "code": "EX020400",
            "name": "기타공예체험",
            "rnum": 4
          }
        ]
      },
      {
        "code": "EX03",
        "name": "농.산.어촌 체험",
        "rnum": 3,
        "value": [
          {
            "code": "EX030100",
            "name": "체험마을",
            "rnum": 1
          },
          {
            "code": "EX030200",
            "name": "체험목장",
            "rnum": 2
          },
          {
            "code": "EX030300",
            "name": "체험농장",
            "rnum": 3
          },
          {
            "code": "EX030400",
            "name": "체험어장",
            "rnum": 4
          }
        ]
      },
      {
        "code": "EX04",
        "name": "산사체험",
        "rnum": 4,
        "value": [
          {
            "code": "EX040100",
            "name": "템플스테이",
            "rnum": 1
          },
          {
            "code": "EX040200",
            "name": "사찰문화체험",
            "rnum": 2
          }
        ]
      },
      {
        "code": "EX05",
        "name": "웰니스관광",
        "rnum": 5,
        "value": [
          {
            "code": "EX050100",
            "name": "온천 / 사우나 / 스파",
            "rnum": 1
          },
          {
            "code": "EX050200",
            "name": "찜질방",
            "rnum": 2
          },
          {
            "code": "EX050300",
            "name": "한방체험",
            "rnum": 3
          },
          {
            "code": "EX050400",
            "name": "힐링명상",
            "rnum": 4
          },
          {
            "code": "EX050500",
            "name": "뷰티스파",
            "rnum": 5
          },
          {
            "code": "EX050600",
            "name": "기타웰니스",
            "rnum": 6
          },
          {
            "code": "EX050700",
            "name": "자연치유",
            "rnum": 7
          }
        ]
      },
      {
        "code": "EX06",
        "name": "산업관광",
        "rnum": 6,
        "value": [
          {
            "code": "EX060100",
            "name": "근대산업유산",
            "rnum": 1
          },
          {
            "code": "EX060200",
            "name": "게임 등 첨단IT산업",
            "rnum": 2
          },
          {
            "code": "EX060300",
            "name": "전통/향토산업",
            "rnum": 3
          },
          {
            "code": "EX060400",
            "name": "문화콘텐츠산업",
            "rnum": 4
          },
          {
            "code": "EX060500",
            "name": "장수기업/산업테마거리",
            "rnum": 5
          },
          {
            "code": "EX060600",
            "name": "자동차/조선/철강 등",
            "rnum": 6
          },
          {
            "code": "EX060700",
            "name": "로봇/항공우주산업",
            "rnum": 7
          },
          {
            "code": "EX060800",
            "name": "화장품/주류/먹거리",
            "rnum": 8
          },
          {
            "code": "EX060900",
            "name": "친환경/신재생에너지",
            "rnum": 9
          },
          {
            "code": "EX061000",
            "name": "기타산업관광지",
            "rnum": 10
          }
        ]
      },
      {
        "code": "EX07",
        "name": "기타체험",
        "rnum": 7,
        "value": [
          {
            "code": "EX070100",
            "name": "유람선/잠수함관광",
            "rnum": 1
          },
          {
            "code": "EX070200",
            "name": "기타체험관광",
            "rnum": 2
          }
        ]
      }
    ]
  },
  {
    "code": "FD",
    "name": "음식",
    "rnum": 5,
    "value": [
      {
        "code": "FD01",
        "name": "한식",
        "rnum": 1,
        "value": [
          {
            "code": "FD010100",
            "name": "관광식당",
            "rnum": 1
          },
          {
            "code": "FD010200",
            "name": "모범음식점",
            "rnum": 2
          }
        ]
      },
      {
        "code": "FD02",
        "name": "외국식",
        "rnum": 2,
        "value": [
          {
            "code": "FD020100",
            "name": "중식",
            "rnum": 1
          },
          {
            "code": "FD020200",
            "name": "일식",
            "rnum": 2
          },
          {
            "code": "FD020300",
            "name": "서양식",
            "rnum": 3
          },
          {
            "code": "FD020400",
            "name": "기타외국식",
            "rnum": 4
          },
          {
            "code": "FD020500",
            "name": "퓨전음식",
            "rnum": 5
          }
        ]
      },
      {
        "code": "FD03",
        "name": "간이음식",
        "rnum": 3,
        "value": [
          {
            "code": "FD030100",
            "name": "제과",
            "rnum": 1
          },
          {
            "code": "FD030200",
            "name": "피자, 햄버거, 샌드위치 및 유사음식",
            "rnum": 2
          },
          {
            "code": "FD030300",
            "name": "치킨",
            "rnum": 3
          },
          {
            "code": "FD030400",
            "name": "김밥 분식",
            "rnum": 4
          },
          {
            "code": "FD030500",
            "name": "이동음식",
            "rnum": 5
          },
          {
            "code": "FD030600",
            "name": "기타간이음식",
            "rnum": 6
          }
        ]
      },
      {
        "code": "FD04",
        "name": "주점",
        "rnum": 4,
        "value": [
          {
            "code": "FD040100",
            "name": "바/펍",
            "rnum": 1
          },
          {
            "code": "FD040200",
            "name": "생맥주전문점",
            "rnum": 2
          },
          {
            "code": "FD040300",
            "name": "클럽",
            "rnum": 3
          },
          {
            "code": "FD040400",
            "name": "전통주/민속주점",
            "rnum": 4
          },
          {
            "code": "FD040500",
            "name": "기타주점",
            "rnum": 5
          }
        ]
      },
      {
        "code": "FD05",
        "name": "카페/ 찻집",
        "rnum": 5,
        "value": [
          {
            "code": "FD050100",
            "name": "카페",
            "rnum": 1
          },
          {
            "code": "FD050200",
            "name": "찻집",
            "rnum": 2
          },
          {
            "code": "FD050300",
            "name": "기타음료점",
            "rnum": 3
          }
        ]
      }
    ]
  },
  {
    "code": "HS",
    "name": "역사관광",
    "rnum": 6,
    "value": [
      {
        "code": "HS01",
        "name": "역사유적지",
        "rnum": 1,
        "value": [
          {
            "code": "HS010100",
            "name": "고궁",
            "rnum": 1
          },
          {
            "code": "HS010200",
            "name": "성ㆍ산성ㆍ성곽",
            "rnum": 2
          },
          {
            "code": "HS010300",
            "name": "문",
            "rnum": 3
          },
          {
            "code": "HS010400",
            "name": "고택",
            "rnum": 4
          },
          {
            "code": "HS010500",
            "name": "생가",
            "rnum": 5
          },
          {
            "code": "HS010600",
            "name": "민속마을",
            "rnum": 6
          },
          {
            "code": "HS010700",
            "name": "사적지",
            "rnum": 7
          },
          {
            "code": "HS010800",
            "name": "고분, 능",
            "rnum": 8
          },
          {
            "code": "HS010900",
            "name": "사당",
            "rnum": 9
          },
          {
            "code": "HS011000",
            "name": "선사유적지",
            "rnum": 10
          }
        ]
      },
      {
        "code": "HS02",
        "name": "역사유물",
        "rnum": 2,
        "value": [
          {
            "code": "HS020100",
            "name": "탑ㆍ비석ㆍ기념탑",
            "rnum": 1
          },
          {
            "code": "HS020200",
            "name": "선사유물",
            "rnum": 2
          },
          {
            "code": "HS020300",
            "name": "불상",
            "rnum": 3
          },
          {
            "code": "HS020400",
            "name": "기타역사유물",
            "rnum": 4
          }
        ]
      },
      {
        "code": "HS03",
        "name": "종교성지",
        "rnum": 3,
        "value": [
          {
            "code": "HS030100",
            "name": "불교",
            "rnum": 1
          },
          {
            "code": "HS030200",
            "name": "기독교",
            "rnum": 2
          },
          {
            "code": "HS030300",
            "name": "이슬람",
            "rnum": 3
          },
          {
            "code": "HS030400",
            "name": "기타 종교성지",
            "rnum": 4
          }
        ]
      },
      {
        "code": "HS04",
        "name": "안보관광지",
        "rnum": 4,
        "value": [
          {
            "code": "HS040100",
            "name": "안보유적지",
            "rnum": 1
          },
          {
            "code": "HS040200",
            "name": "안보관광시설",
            "rnum": 2
          },
          {
            "code": "HS040300",
            "name": "북한관광지",
            "rnum": 3
          },
          {
            "code": "HS040400",
            "name": "기타안보관광지",
            "rnum": 4
          }
        ]
      }
    ]
  },
  {
    "code": "LS",
    "name": "레저스포츠",
    "rnum": 7,
    "value": [
      {
        "code": "LS01",
        "name": "육상레저스포츠",
        "rnum": 1,
        "value": [
          {
            "code": "LS010100",
            "name": "인라인(실내 인라인 포함)",
            "rnum": 1
          },
          {
            "code": "LS010200",
            "name": "자전거하이킹",
            "rnum": 2
          },
          {
            "code": "LS010300",
            "name": "카트",
            "rnum": 3
          },
          {
            "code": "LS010400",
            "name": "골프",
            "rnum": 4
          },
          {
            "code": "LS010500",
            "name": "경마",
            "rnum": 5
          },
          {
            "code": "LS010600",
            "name": "경륜",
            "rnum": 6
          },
          {
            "code": "LS010700",
            "name": "승마",
            "rnum": 7
          },
          {
            "code": "LS010800",
            "name": "스키/스노보드",
            "rnum": 8
          },
          {
            "code": "LS010900",
            "name": "스케이트",
            "rnum": 9
          },
          {
            "code": "LS011000",
            "name": "썰매장",
            "rnum": 10
          }
        ]
      },
      {
        "code": "LS02",
        "name": "수상레저스포츠",
        "rnum": 2,
        "value": [
          {
            "code": "LS020100",
            "name": "윈드서핑/제트스키",
            "rnum": 1
          },
          {
            "code": "LS020200",
            "name": "카약/카누",
            "rnum": 2
          },
          {
            "code": "LS020300",
            "name": "요트",
            "rnum": 3
          },
          {
            "code": "LS020400",
            "name": "스노쿨링/스킨스쿠버다이빙",
            "rnum": 4
          },
          {
            "code": "LS020500",
            "name": "민물낚시",
            "rnum": 5
          },
          {
            "code": "LS020600",
            "name": "바다낚시",
            "rnum": 6
          },
          {
            "code": "LS020700",
            "name": "수영",
            "rnum": 7
          },
          {
            "code": "LS020800",
            "name": "래프팅",
            "rnum": 8
          },
          {
            "code": "LS020900",
            "name": "수상오토바이",
            "rnum": 9
          },
          {
            "code": "LS021000",
            "name": "수상자전거",
            "rnum": 10
          }
        ]
      },
      {
        "code": "LS03",
        "name": "항공레저스포츠",
        "rnum": 3,
        "value": [
          {
            "code": "LS030100",
            "name": "스카이다이빙",
            "rnum": 1
          },
          {
            "code": "LS030200",
            "name": "초경량비행",
            "rnum": 2
          },
          {
            "code": "LS030300",
            "name": "헹글라이딩/패러글라이딩",
            "rnum": 3
          },
          {
            "code": "LS030400",
            "name": "열기구",
            "rnum": 4
          },
          {
            "code": "LS030500",
            "name": "무인비행장치(드론)",
            "rnum": 5
          },
          {
            "code": "LS030600",
            "name": "기타항공레저스포츠",
            "rnum": 6
          }
        ]
      },
      {
        "code": "LS04",
        "name": "복합레저스포츠",
        "rnum": 4,
        "value": [
          {
            "code": "LS040100",
            "name": "복합레저스포츠",
            "rnum": 1
          }
        ]
      }
    ]
  },
  {
    "code": "NA",
    "name": "자연관광",
    "rnum": 8,
    "value": [
      {
        "code": "NA01",
        "name": "자연경관(산)",
        "rnum": 1,
        "value": [
          {
            "code": "NA010100",
            "name": "산, 고개, 오름, 봉우리",
            "rnum": 1
          },
          {
            "code": "NA010200",
            "name": "숲",
            "rnum": 2
          },
          {
            "code": "NA010300",
            "name": "폭포",
            "rnum": 3
          },
          {
            "code": "NA010400",
            "name": "계곡",
            "rnum": 4
          },
          {
            "code": "NA010500",
            "name": "약수터",
            "rnum": 5
          }
        ]
      },
      {
        "code": "NA02",
        "name": "자연경관(하천‧해양)",
        "rnum": 2,
        "value": [
          {
            "code": "NA020100",
            "name": "강",
            "rnum": 1
          },
          {
            "code": "NA020200",
            "name": "호수",
            "rnum": 2
          },
          {
            "code": "NA020300",
            "name": "저수지",
            "rnum": 3
          },
          {
            "code": "NA020400",
            "name": "연못·늪",
            "rnum": 4
          },
          {
            "code": "NA020500",
            "name": "섬",
            "rnum": 5
          },
          {
            "code": "NA020600",
            "name": "염전",
            "rnum": 6
          },
          {
            "code": "NA020700",
            "name": "항구/포구",
            "rnum": 7
          },
          {
            "code": "NA020800",
            "name": "해안절경",
            "rnum": 8
          },
          {
            "code": "NA020900",
            "name": "해변. 해수욕장",
            "rnum": 9
          }
        ]
      },
      {
        "code": "NA03",
        "name": "자연생태",
        "rnum": 3,
        "value": [
          {
            "code": "NA030100",
            "name": "동굴",
            "rnum": 1
          },
          {
            "code": "NA030200",
            "name": "희귀동.식물",
            "rnum": 2
          },
          {
            "code": "NA030300",
            "name": "기암괴석",
            "rnum": 3
          },
          {
            "code": "NA030400",
            "name": "생태습지",
            "rnum": 4
          },
          {
            "code": "NA030500",
            "name": "기타자연생태",
            "rnum": 5
          }
        ]
      },
      {
        "code": "NA04",
        "name": "자연공원",
        "rnum": 4,
        "value": [
          {
            "code": "NA040100",
            "name": "국립공원",
            "rnum": 1
          },
          {
            "code": "NA040200",
            "name": "도립공원",
            "rnum": 2
          },
          {
            "code": "NA040300",
            "name": "군립공원",
            "rnum": 3
          },
          {
            "code": "NA040400",
            "name": "지질공원",
            "rnum": 4
          },
          {
            "code": "NA040500",
            "name": "생태관광지",
            "rnum": 5
          },
          {
            "code": "NA040600",
            "name": "자연휴양림",
            "rnum": 6
          },
          {
            "code": "NA040700",
            "name": "수목원ㆍ정원",
            "rnum": 7
          }
        ]
      },
      {
        "code": "NA05",
        "name": "기타자연관광",
        "rnum": 5,
        "value": [
          {
            "code": "NA050100",
            "name": "기타자연관광",
            "rnum": 1
          }
        ]
      }
    ]
  },
  {
    "code": "SH",
    "name": "쇼핑",
    "rnum": 9,
    "value": [
      {
        "code": "SH01",
        "name": "백화점",
        "rnum": 1,
        "value": [
          {
            "code": "SH010100",
            "name": "백화점",
            "rnum": 1
          }
        ]
      },
      {
        "code": "SH02",
        "name": "쇼핑몰",
        "rnum": 2,
        "value": [
          {
            "code": "SH020100",
            "name": "복합쇼핑몰",
            "rnum": 1
          },
          {
            "code": "SH020200",
            "name": "아웃렛",
            "rnum": 2
          }
        ]
      },
      {
        "code": "SH03",
        "name": "대형마트",
        "rnum": 3,
        "value": [
          {
            "code": "SH030100",
            "name": "대형마트",
            "rnum": 1
          }
        ]
      },
      {
        "code": "SH04",
        "name": "면세점",
        "rnum": 4,
        "value": [
          {
            "code": "SH040100",
            "name": "공항면세점",
            "rnum": 1
          },
          {
            "code": "SH040200",
            "name": "시내면세점",
            "rnum": 2
          },
          {
            "code": "SH040300",
            "name": "사후면세점",
            "rnum": 3
          }
        ]
      },
      {
        "code": "SH05",
        "name": "전문매장/상가",
        "rnum": 5,
        "value": [
          {
            "code": "SH050100",
            "name": "공방/공예품점",
            "rnum": 1
          },
          {
            "code": "SH050200",
            "name": "전문상가",
            "rnum": 2
          },
          {
            "code": "SH050300",
            "name": "관광기념품/특산물판매점",
            "rnum": 3
          }
        ]
      },
      {
        "code": "SH06",
        "name": "시장",
        "rnum": 6,
        "value": [
          {
            "code": "SH060100",
            "name": "비상설시장",
            "rnum": 1
          },
          {
            "code": "SH060200",
            "name": "상설시장",
            "rnum": 2
          }
        ]
      },
      {
        "code": "SH07",
        "name": "기타쇼핑시설",
        "rnum": 7,
        "value": [
          {
            "code": "SH070100",
            "name": "기타쇼핑시설",
            "rnum": 1
          }
        ]
      }
    ]
  },
  {
    "code": "VE",
    "name": "문화관광",
    "rnum": 10,
    "value": [
      {
        "code": "VE01",
        "name": "랜드마크관광",
        "rnum": 1,
        "value": [
          {
            "code": "VE010100",
            "name": "건물",
            "rnum": 1
          },
          {
            "code": "VE010200",
            "name": "타워 / 전망대",
            "rnum": 2
          },
          {
            "code": "VE010300",
            "name": "다리 / 대교",
            "rnum": 3
          },
          {
            "code": "VE010400",
            "name": "분수",
            "rnum": 4
          },
          {
            "code": "VE010500",
            "name": "동상",
            "rnum": 5
          },
          {
            "code": "VE010600",
            "name": "터널",
            "rnum": 6
          },
          {
            "code": "VE010700",
            "name": "댐",
            "rnum": 7
          },
          {
            "code": "VE010800",
            "name": "등대",
            "rnum": 8
          },
          {
            "code": "VE010900",
            "name": "기타 건축/조형물",
            "rnum": 9
          }
        ]
      },
      {
        "code": "VE02",
        "name": "테마공원",
        "rnum": 2,
        "value": [
          {
            "code": "VE020100",
            "name": "테마파크",
            "rnum": 1
          },
          {
            "code": "VE020200",
            "name": "워터파크",
            "rnum": 2
          },
          {
            "code": "VE020300",
            "name": "동물원",
            "rnum": 3
          },
          {
            "code": "VE020400",
            "name": "수족관 / 아쿠라리움",
            "rnum": 4
          },
          {
            "code": "VE020500",
            "name": "천문대",
            "rnum": 5
          }
        ]
      },
      {
        "code": "VE03",
        "name": "도시공원",
        "rnum": 3,
        "value": [
          {
            "code": "VE030100",
            "name": "시민공원",
            "rnum": 1
          },
          {
            "code": "VE030200",
            "name": "소공원",
            "rnum": 2
          },
          {
            "code": "VE030300",
            "name": "어린이공원",
            "rnum": 3
          },
          {
            "code": "VE030400",
            "name": "근린공원",
            "rnum": 4
          },
          {
            "code": "VE030500",
            "name": "주제공원",
            "rnum": 5
          }
        ]
      },
      {
        "code": "VE04",
        "name": "도시.지역문화관광",
        "rnum": 4,
        "value": [
          {
            "code": "VE040100",
            "name": "골목길, 문화거리",
            "rnum": 1
          },
          {
            "code": "VE040200",
            "name": "마을관광지",
            "rnum": 2
          },
          {
            "code": "VE040300",
            "name": "둘레길",
            "rnum": 3
          }
        ]
      },
      {
        "code": "VE05",
        "name": "복합관광시설",
        "rnum": 5,
        "value": [
          {
            "code": "VE050100",
            "name": "관광단지",
            "rnum": 1
          },
          {
            "code": "VE050200",
            "name": "리조트",
            "rnum": 2
          }
        ]
      },
      {
        "code": "VE06",
        "name": "공연시설",
        "rnum": 6,
        "value": [
          {
            "code": "VE060100",
            "name": "공연장",
            "rnum": 1
          },
          {
            "code": "VE060200",
            "name": "영화관",
            "rnum": 2
          }
        ]
      },
      {
        "code": "VE07",
        "name": "전시시설",
        "rnum": 7,
        "value": [
          {
            "code": "VE070100",
            "name": "박물관",
            "rnum": 1
          },
          {
            "code": "VE070200",
            "name": "기념관",
            "rnum": 2
          },
          {
            "code": "VE070300",
            "name": "전시관",
            "rnum": 3
          },
          {
            "code": "VE070400",
            "name": "컨벤션센터",
            "rnum": 4
          },
          {
            "code": "VE070500",
            "name": "과학관",
            "rnum": 5
          },
          {
            "code": "VE070600",
            "name": "미술관/화랑",
            "rnum": 6
          }
        ]
      },
      {
        "code": "VE08",
        "name": "행사시설",
        "rnum": 8,
        "value": [
          {
            "code": "VE080600",
            "name": "연회장",
            "rnum": 1
          }
        ]
      },
      {
        "code": "VE09",
        "name": "교육시설",
        "rnum": 9,
        "value": [
          {
            "code": "VE090100",
            "name": "한국문화원",
            "rnum": 1
          },
          {
            "code": "VE090200",
            "name": "외국문화원",
            "rnum": 2
          },
          {
            "code": "VE090300",
            "name": "도서관",
            "rnum": 3
          },
          {
            "code": "VE090400",
            "name": "문화전수시설",
            "rnum": 4
          },
          {
            "code": "VE090500",
            "name": "어학당",
            "rnum": 5
          },
          {
            "code": "VE090600",
            "name": "학교",
            "rnum": 6
          }
        ]
      },
      {
        "code": "VE10",
        "name": "레저스포츠시설",
        "rnum": 10,
        "value": [
          {
            "code": "VE100100",
            "name": "스포츠경기장",
            "rnum": 1
          },
          {
            "code": "VE100200",
            "name": "스포츠센터, 수련시설",
            "rnum": 2
          }
        ]
      }
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
