<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Team AI Working Guidelines

이 저장소는 기획, 디자인, 개발 팀원이 함께 브레인스토밍하고 구현 계획을 구체화하는 여행 앱 프로젝트입니다. 어느 PC에서든 저장소를 pull 받은 뒤 AI를 실행하면, 아래 가이드를 먼저 읽고 범위를 벗어나지 않게 작업합니다.

## Product Direction

- 사용자는 여행 객체를 만들고 관리합니다.
- 여행 객체는 최소한 일정, 코스, 여행 인원 정보를 포함합니다.
- 여행 객체에 대한 CRUD를 구현합니다.
- 여행 인원 추가 기능을 구현합니다.
- 여행 초대코드 생성과 초대코드 기반 참여 흐름을 구현합니다.
- 여행 중 올린 영상은 기존 `CameraApp` 흐름을 기반으로 기록하고 공유합니다.
- API 사용법과 지역/관광 분류코드는 `docs/ennoia-api.md`를 기준으로 확인합니다.

## Data And Backend Rules

- DB 설계는 이 프로젝트의 핵심입니다. 여행, 일정, 코스, 멤버, 초대코드, 영상 기록/공유 권한의 관계를 먼저 정리한 뒤 구현합니다.
- 스키마 변경, 마이그레이션, 인증/권한 정책 변경은 작은 단위로 나누고 문서 또는 PR 설명에 의도를 남깁니다.
- 초대코드, 영상 공유 URL, 사용자 식별자처럼 권한과 연결되는 값은 추측 구현하지 않습니다. 생성, 만료, 재발급, 접근 범위를 명확히 정합니다.
- API 키, 서비스 키, 토큰, DB 접속 정보는 코드나 문서에 직접 커밋하지 않습니다. 환경변수 예시는 placeholder로만 작성합니다.

## Frontend Rules

- `CameraApp`은 여행 중 영상 기록과 공유 흐름의 기반입니다. 기존 UX와 카메라/녹화 동작을 깨지 않도록 변경 범위를 작게 유지합니다.
- 기획/디자인 논의 중인 화면은 구현 전에 필요한 상태, 입력값, 빈 상태, 에러 상태, 권한 상태를 먼저 정리합니다.
- 여행 일정, 코스, 인원 관리는 반복 사용되는 운영성 UI입니다. 과한 장식보다 명확한 정보 구조와 수정 흐름을 우선합니다.

## Git Collision Rules

- 작업 전 항상 최신 `main`을 pull 받습니다.
- 기능 단위로 브랜치를 나눕니다. 브랜치 이름은 기본적으로 `codex/기능명` 형식을 사용합니다.
- 같은 파일을 여러 사람이 동시에 크게 수정하지 않습니다. 특히 `src/app/page.tsx`, DB schema, 공용 타입, 전역 CSS, 설정 파일은 작업 전 담당 범위를 맞춥니다.
- AI가 만든 변경도 사람이 만든 변경과 동일하게 리뷰합니다. 불필요한 포맷팅, 대량 리네임, 관계없는 리팩터링은 피합니다.
- 충돌이 나면 임의로 상대 변경을 삭제하지 않습니다. 변경 의도를 확인하고 가장 작은 수정으로 해결합니다.
- 문서 변경, API 메모, 기획 결정은 `docs/` 아래에 남겨 팀원이 같은 기준으로 작업하게 합니다.

## AI Execution Rules

- 코드 작성 전 현재 파일 구조와 관련 문서를 먼저 확인합니다.
- Next.js 관련 코드는 반드시 `node_modules/next/dist/docs/`의 관련 문서를 확인한 뒤 작성합니다.
- 여행 도메인 모델, DB schema, 초대코드, 영상 공유 권한처럼 되돌리기 어려운 결정은 바로 구현하지 말고 계획을 먼저 제안합니다.
- 구현 요청이 명확하면 작은 단위로 구현하고, 실행 가능한 검증 명령을 함께 수행합니다.
- 기획/디자인 브레인스토밍 요청에서는 코드 변경보다 요구사항, 데이터 구조, 화면 흐름, 권한 흐름, 단계별 구현 계획을 우선합니다.
