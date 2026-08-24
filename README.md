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
- 공공데이터 API Key, OpenAI Key, Supabase `service_role`처럼 권한이 큰 비밀값은 Git에 커밋하지 않고 `.env`로 관리
- 브라우저 공개용 Supabase publishable key는 RLS와 최소 권한이 적용된 경우에만 프런트엔드에서 사용

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
- 네이버 실제 지도 위 축제·랜드마크 마커와 상세 바텀시트
- Supabase에 적재된 주차장 좌표 기반 지도 마커
- 방문 시간 기준 주차장 1·2·3순위와 예상 요금
- 기본 내비게이션 선택
- `만차예요` 클릭 후 다음 후보 자동 승격 및 안내

## Supabase 주차장 데이터

프로토타입은 Supabase의 `public.parking_lots` 테이블에서 대전 실시간 주차장 데이터를 읽습니다.

- 현재 적재 건수: 756곳
- 브라우저 권한: `anon`, `authenticated` 모두 조회(`SELECT`)만 허용
- 데이터 보호: RLS 정책으로 공개 조회만 허용
- 연결 설정: [`prototype/supabase-config.js`](prototype/supabase-config.js)
- 재현 가능한 스키마: [`supabase/schema.sql`](supabase/schema.sql)

대전 공공데이터 API를 다시 확인하려면 원본 키가 든 `.env` 경로를 지정해 아래처럼 실행합니다. 키 값은 결과나 Git에 저장되지 않습니다.

```bash
python3 scripts/fetch_daejeon_parking.py \
  --env-file "/Users/choijihun/Downloads/아카이브/.env" \
  --page 1 \
  --rows 50
```

Supabase 연결에 실패할 때만 화면의 예시 주차장 데이터가 대체 표시됩니다.
