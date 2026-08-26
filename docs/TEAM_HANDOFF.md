# 축제콕 팀 인수인계

최종 업데이트: 2026-08-26

## 서비스 주소와 배포

- 운영 URL: <https://festival-kkok.vercel.app>
- Vercel 프로젝트: `festival-kkok`
- 프런트엔드와 API는 `prototype/` 디렉터리를 Vercel 프로젝트 루트로 배포한다.
- 작업 변경은 로컬 테스트 후 `npx --yes vercel@latest deploy --prod --yes`로 운영 배포한다.
- 실제 API 키·Supabase 키는 Git에 넣지 않는다. 로컬 파일은 `prototype/.env.local`, 변수 목록은 `prototype/.env.example`를 참고한다.

## 현재 사용자 흐름

1. 지도에서 축제 핀을 누르거나 검색으로 축제를 찾는다.
2. 하단 시트에서 이미지, 소개, 추천 태그, 방문 조건, 공식 핵심 프로그램을 확인한다.
3. 대중교통 또는 자동차 길찾기를 선택한다.
4. 자동차 길찾기는 축제장 또는 추천 1순위 공영주차장을 목적지로 고를 수 있다.

## 최근 반영 UI

### 추천과 일정

- 가로 추천 카드: 시작 전은 초록 `시작까지 D-n`, 진행 중은 주황 `진행 중 · 종료까지 D-n`, 종료 축제는 회색으로 표시한다.
- `마감순위`는 종료일이 가까운 순으로 정렬한다.
  - 시작 전: `시작까지 D-n · 종료까지 D-m`
  - 진행 중: `진행 중 · 종료까지 D-n`
  - D-day 오른쪽: `| 8.28 ~ 8.30` 일정 범위를 작게 표시한다.
- 추천 카드의 태그는 공식 소개와 추천 알고리즘의 주제 태그를 이용한다.
- 추천 순위는 취향 60% / 거리 25% / 일정 15%로 계산한다. 이 값은 초기 가설이며 상세 조회율·즐겨찾기율로 검증해 조정한다.
- 여행 날짜를 고르면 일정 점수는 '오늘'이 아니라 선택한 기간을 기준으로 계산한다.
- 거리 점수는 전국 기준 구간형 곡선이라 20km 밖도 0점이 되지 않는다. 상세 기준은 README `추천 기준`에 있다.
- 화면에는 숫자 점수를 노출하지 않고 `취향에 잘 맞아요` 같은 근거 문구만 표시한다. 숫자 점수는 내부 정렬용이다.
- 맞춤 추천 순위와 기본 추천 카드에만 다양성 보정을 적용한다. 즐겨찾기 목록과 마감순위에는 적용하지 않는다.

### 지도와 상세 시트

- 지도 축제 핀은 실제 위치가 충분히 가까울 때만 묶는다. 축제 핀은 이미지가 식별되도록 크게 표시한다.
- 축제 상세 시트는 홈 추천 시트처럼 스크롤에 맞춰 자연스럽게 확장·축소된다.
- 추천 시트의 `추천순위 / 마감순위 / 즐겨찾기` 탭은 드래그 제스처와 충돌하지 않도록 처리했다.
- 상세 화면에는 `방문 조건에 맞아요`를 방문 정보 위에 표시하며, 우천·취소 정보 카드는 제거했다.

### 검색

- 검색 결과는 장식 이모지와 화살표 없이 텍스트로만 표시한다.
- 검색 메타 정보 색상:
  - 진행 중: 주황
  - 시작 전: 초록
  - D-day: 진한 기본색
  - 위치: 회색
- 모바일 검색 입력창은 16px을 유지해 iPhone Safari의 자동 확대를 막는다.

### 이동 안내

- 대중교통: 네이버지도, 카카오맵
- 자동차 길찾기: 티맵, 네이버지도, 카카오내비
- 현재 위치에서 행사장까지의 차로 거리·예상 시간은 `/api/tmap-route`로 조회한다. 실패할 때는 직선거리만 표시한다.

## 데이터와 자동화

- 축제·주차장 데이터는 Supabase에 저장한다.
- 축제 공식 소개는 한국관광공사 `detailCommon2`의 `overview`를 `metadata.festival_content.official_overview`에 저장한다.
- 축제 소개와 핵심 프로그램이 공공 API에 부족한 경우 `/api/enrich-festivals`가 OpenAI로 보완한다. 기본 모델 값은 `gpt-5.6-luna`다.
- Vercel Cron (KST 기준 다음 날 06시대):
  - `21:00 UTC` — `/api/sync`
  - `21:10 UTC` — `/api/enrich-festivals?limit=4`
  - `21:20 UTC` — `/api/backfill-festival-overviews?limit=100`

## 중요 환경변수

실제 값은 Vercel Production과 Preview 환경에 모두 등록한다.

| 용도 | 변수 |
| --- | --- |
| Supabase | `SUPABASE_URL`, `SUPABASE_SECRET_KEY` |
| 축제·관광 API | `FESTIVAL_API_KEY`, `TOUR_API_KEY` |
| 주차·날씨 API | `DAEJEON_PARK_API_KEY`, `KMA_WEATHER_API_KEY`, `SHARENURI_API_KEY` |
| 지도·경로 | `NAVER_MAPS_CLIENT_ID`, `NAVER_MAPS_CLIENT_SECRET`, `KAKAO_JAVASCRIPT_KEY`, `TMAP_APP_KEY` |
| AI 보강 | `OPENAI_API_KEY`, `OPENAI_SEARCH_MODEL` |
| 관리자·Cron 보호 | `CRON_SECRET`, `ENRICH_ADMIN_TOKEN`, `FESTIVAL_OVERVIEW_BACKFILL_TOKEN` |

도메인을 바꾸면 카카오 Developers 및 네이버 지도 콘솔의 허용 도메인에 새 운영 주소를 추가해야 한다.

## 검증 방법

```bash
cd prototype
node --test --test-reporter=dot tests/*.test.js
```

운영 배포 뒤에는 브라우저에서 다음을 확인한다.

1. 검색 탭 전환과 검색 입력창 포커스
2. 추천/마감/즐겨찾기 탭 전환
3. 축제 상세 시트 스크롤과 이동 안내 앱 링크
4. `/api/places`, `/api/parking`, `/api/tmap-route` 응답

## 관련 파일

- 화면과 상호작용: `prototype/app.js`, `prototype/seed-theme.css`, `prototype/index.html`
- 축제 시간 계산: `prototype/festival-timing.js`
- 추천 알고리즘: `prototype/festival-recommender.js`
- 지도 클러스터링: `prototype/map-clustering.js`
- API: `prototype/api/`
- 자동화 설정: `prototype/vercel.json`
- 테스트: `prototype/tests/`
