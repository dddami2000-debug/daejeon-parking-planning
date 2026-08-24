# 대전 주차 추천 서비스

Manyfast의 **「자료보고 기획해줘」** 프로젝트를 팀 협업용 GitHub 저장소 형태로 정리한 문서입니다.

## 제품 한 줄 정의
대전의 축제·랜드마크 방문자가 취향과 현재 위치에 맞는 장소를 발견하고, 예상 주차비와 만차 대안까지 포함한 주차 계획을 세워 바로 출발하도록 돕는 모바일 웹 서비스입니다.

## 핵심 사용자 흐름
1. 심리테스트 또는 건너뛰기
2. 취향·거리·행사기간 기반 장소 탐색
3. 장소 상세 확인
4. 방문 날짜·시간 입력
5. 주차장 1·2·3순위 및 예상 요금 비교
6. 외부 내비게이션 길안내
7. 만차 시 다음 순위 주차장으로 전환

## 문서 구조

- [`docs/PRD.md`](docs/PRD.md) — 제품 목표, 사용자 문제, 해결책, KPI, 리스크
- [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md) — Requirement 5개
- [`docs/FEATURES.md`](docs/FEATURES.md) — Feature 7개
- [`docs/SPECS.md`](docs/SPECS.md) — 상세 Spec 7개
- [`docs/USER_FLOW.md`](docs/USER_FLOW.md) — 전체 사용자 흐름과 Mermaid 다이어그램
- [`data/project-summary.json`](data/project-summary.json) — 기획 구조 요약 JSON

## MVP 우선순위
해커톤 24시간 MVP 기준으로 핵심 P0 흐름을 먼저 완성합니다.

**온보딩 → 장소 추천 → 주차 플랜 → 길안내 → 만차 전환**

실시간 주차 잔여면은 데이터 제공이 가능한 경우의 보조 기능으로 취급합니다.

## 협업 권장 방식

- `main`: 합의된 기획 및 동작
- 기능별 브랜치: `feature/onboarding`, `feature/place-discovery`, `feature/parking-plan`, `feature/navigation`
- 기획 변경은 Pull Request에서 문서와 구현을 함께 리뷰
- API Key, OpenAI Key 등 비밀값은 Git에 커밋하지 않고 `.env`로 관리

## 현재 기획 상태
Manyfast 기준 Requirement / Feature / Spec은 모두 아직 `todo` 상태입니다.

## Prototype v1

첫 번째 실행형 프로토타입은 [`prototype/`](prototype/)에 있습니다.

```bash
python3 -m http.server 4174 --bind 127.0.0.1 --directory prototype
```

브라우저에서 `http://127.0.0.1:4174`를 열면 다음 흐름을 테스트할 수 있습니다.

- 꿈돌이 취향 테스트 또는 건너뛰기
- 추천 축제 가로 슬라이더
- 축제·랜드마크 버블 지도와 상세 바텀시트
- 방문 시간 기준 주차장 1·2·3순위와 예상 요금
- 기본 내비게이션 선택
- `만차예요` 클릭 후 다음 후보 자동 승격 및 안내

## 공공데이터 연동

`prototype/api/`의 Vercel Functions가 공공데이터를 서버에서 수집하고 Supabase에 저장합니다. 브라우저에는 공공데이터 키나 Supabase Secret Key를 전달하지 않습니다.

- `GET /api/places`: Supabase에 저장된 축제·랜드마크를 모바일 화면에 전달
- `GET /api/parking?lat=...&lng=...`: 목적지 근처 주차장과 선택한 시간대의 예상 요금을 전달
- `GET|POST /api/sync?dataset=festival|landmark|parking|sharenuri`: 인증된 수집 작업

필수 환경 변수 이름은 [`prototype/.env.example`](prototype/.env.example)에 정리했습니다. Vercel에서 Production과 Preview에 모두 등록하고, 동기화용 `CRON_SECRET`도 추가해야 합니다.

축제 API에는 좌표가 포함되지 않습니다. 따라서 축제는 상세 정보와 추천 카드에 우선 노출되며, 지도 버블과 주변 주차장 추천은 좌표가 있는 랜드마크부터 실제 데이터로 동작합니다. 축제 주소의 좌표화(Geocoding)는 다음 단계로 분리했습니다.
