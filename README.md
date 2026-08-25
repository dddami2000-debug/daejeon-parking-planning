# 대전갈까? 🅿️

> 대전의 축제·랜드마크를 발견하고, 주변 공공 주차장까지 한 번에 계획하는 모바일 웹 서비스

[서비스 열기](https://daejeon-parking-planning.vercel.app)

## 문제

대전의 축제와 관광명소를 방문할 때 공영·노상·공공기관 주차장 정보가 여러 곳에 흩어져 있습니다. 방문자는 행사장까지의 거리, 운영시간, 예상 주차비를 직접 비교해야 하고, 현장에서 1순위 주차장이 만차이면 다시 검색해야 합니다.

## 해결

`대전갈까?`는 축제와 랜드마크를 지도에서 발견한 뒤, 방문 시간에 맞는 주차장 후보를 추천하고 바로 길안내로 연결합니다. 주차장이 만차라면 다음 순위 후보로 빠르게 전환할 수 있습니다.

## 핵심 기능

- 꿈돌이 취향 테스트 또는 건너뛰기를 통한 맞춤 장소 추천
- 대전 축제·랜드마크 버블을 표시하는 네이버 지도 기반 모바일 화면
- 축제·랜드마크 선택 시 운영 기간, 운영시간, 거리, 소개를 보여주는 상세 바텀시트
- 목적지 주변 공영·노상 주차장의 1·2·3순위 추천 및 예상 주차비 계산
- 지도 위 추천 주차장과 주변 주차장 표시, 개별 주차장 정보 확인
- 1순위 만차 시 다음 후보 주차장으로 전환하는 흐름
- 네이버지도·카카오맵·티맵 등 외부 내비게이션 길안내 연결

## 데이터와 기술

| 구분 | 사용 데이터·기술 | 용도 |
| --- | --- | --- |
| 축제 | 한국관광공사 TourAPI 지역축제 정보 | 진행 중·예정 축제의 일정과 장소 제공 |
| 랜드마크 | 대전광역시 문화관광(관광지) API | 대전 관광명소의 위치와 소개 제공 |
| 주차장 | 대전광역시 실시간 주차장 정보 API | 공영·노상 주차장 위치·요금·운영 정보 제공 |
| 지도 | Naver Maps JavaScript API | 지도, 장소·주차장 마커 표시 |
| 백엔드 | Vercel Serverless Functions | 공공데이터 수집 및 API 제공 |
| 데이터베이스 | Supabase | 축제·랜드마크·주차장 정제 데이터 저장 |

공유누리 공공기관 주차장은 API 승인·데이터 품질을 확인 중이며, 안정화 후 주차장 추천 데이터에 포함할 예정입니다.

## 데이터 처리 방식

공공데이터는 브라우저가 아니라 Vercel Functions에서 수집해 Supabase에 저장합니다. 따라서 공공데이터 인증키와 Supabase Secret Key가 클라이언트에 노출되지 않습니다.

- `GET /api/places` — 축제·랜드마크 조회
- `GET /api/parking?lat=...&lng=...` — 목적지 주변 주차장 및 예상 요금 조회
- `GET|POST /api/sync?dataset=festival|landmark|parking|sharenuri` — 데이터 수집·동기화
- `GET|POST /api/enrich-landmarks?limit=4` — OpenAI 웹 검색으로 공식 사진과 장소별 방문 안내를 보강
- `GET|POST /api/fill-landmark-images?limit=4` — 한국관광공사 TourAPI 대표 사진을 장소명 정확 일치 기준으로 보강

축제 데이터에 좌표가 없을 때는 주소를 좌표화해 지도 표시를 보완합니다. 데이터 수집 실패가 발생해도 다른 데이터셋 동기화는 계속 진행되도록 구성했습니다.

랜드마크 보강 작업은 `CRON_SECRET` 또는 수동 실행 전용 `ENRICH_ADMIN_TOKEN` 인증이 필요한 관리자용 작업입니다. 대전시·대전관광·한국관광공사 도메인과 각 장소의 공공데이터 공식 홈페이지 도메인만 검색 대상으로 제한하고, 대표 이미지 URL·출처 페이지·짧은 방문 안내를 `places.metadata.landmark_enrichment`에 저장합니다. 화면 요청마다 AI를 호출하지 않으므로 반복 비용이 발생하지 않습니다.

공식 웹 검색에서 사진을 찾지 못한 장소는 한국관광공사 TourAPI의 대전 관광지 목록과 이름을 정확히 대조해 대표 사진을 한 번 더 보강한다. 이름이 정확히 일치할 때만 저장해 다른 장소 사진이 섞이지 않도록 한다.

운영자가 최초 데이터를 채울 때는 `node prototype/scripts/enrich-landmarks-once.js .env.local 4`처럼 소량씩 실행할 수도 있습니다.

## 실행 방법

첫 실행 전 Vercel 프로젝트의 환경 변수를 로컬로 받아옵니다. 실제 키는 Git에 커밋하지 않습니다.

```bash
cd prototype
vercel env pull .env.local
vercel dev
```

브라우저에서 Vercel CLI가 안내하는 로컬 주소를 열면 서버리스 API까지 포함해 확인할 수 있습니다.

필수 환경 변수 이름은 [`prototype/.env.example`](prototype/.env.example)에 정리되어 있습니다. Production과 Preview 환경에 모두 등록하며, 수집 작업은 `CRON_SECRET`으로 보호합니다.

## UI

프로토타입은 `@seed-design/css` 2.4.0의 공식 토큰을 사용하며, 프로젝트별 화면 조정은 [`prototype/seed-theme.css`](prototype/seed-theme.css)에서 관리합니다.

## 문서

- [`docs/PRD.md`](docs/PRD.md) — 제품 목표, 사용자 문제, 해결책, KPI, 리스크
- [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md) — 요구사항
- [`docs/FEATURES.md`](docs/FEATURES.md) — 핵심 기능
- [`docs/SPECS.md`](docs/SPECS.md) — 상세 기능 명세
- [`docs/USER_FLOW.md`](docs/USER_FLOW.md) — 사용자 흐름
- [`docs/api-specs/`](docs/api-specs/) — 수집 API 명세

## 24시간 MVP 범위

**온보딩 → 장소 발견 → 상세 정보 → 주차 플랜 → 길안내 → 만차 전환**

실시간 잔여 주차면은 모든 공영·노상 주차장에서 제공되지 않으므로, MVP에서는 보조 정보로 취급합니다.
