# 대전갈까? 개발 인수인계

> 다른 대화에서 작업을 이어갈 때 이 문서를 먼저 읽는다.
> 최종 갱신: 2026-08-25 (KST)

## 1. 서비스 요약

**대전갈까?**는 대전의 축제·랜드마크를 지도에서 발견하고, 방문 시간과 위치에 맞는 공영·노상 주차장을 추천하는 모바일 웹 서비스다.

핵심 흐름은 다음과 같다.

1. 꿈돌이 취향 테스트 또는 건너뛰기
2. 축제·랜드마크 탐색
3. 장소 상세 정보 확인
4. 주변 주차장 1·2·3순위와 예상 요금 확인
5. 외부 내비게이션으로 길안내
6. 1순위 만차 시 다음 후보로 전환

## 2. 저장소·배포

- 원본 저장소: <https://github.com/dddami2000-debug/daejeon-parking-planning>
- 배포용 포크: <https://github.com/sjndox/daejeon-parking-planning>
- Production 서비스: <https://daejeon-parking-planning.vercel.app>
- Vercel 프로젝트: `asdf-a266/daejeon-parking-planning`
- Supabase 프로젝트 ref: `mdzbcezzkvbaszzfsgjs`

Vercel은 현재 **포크 `sjndox/daejeon-parking-planning`** 에 연결되어 있다. 포크의 `main`에 푸시하면 Vercel Production 배포가 자동으로 생성되는 것을 확인했다.

### 2026-08-25 기준 Git 상태

- 원본 `main` 최신 커밋: `4c92fa9 feat: 대전콕 지도와 상세 UI 개선`
- 포크 `main`도 위 커밋으로 수동 동기화 완료
- 현재 로컬 작업 브랜치: `feat/weather-aware-parking`
- 이 브랜치에는 주차면수 기반 점수를 제거하고 체감온도에 따라 도보 거리 가중치를 조절하는 추천 로직이 구현돼 있다.
- 열린 PR
  - [#3 원본 main을 배포용 포크로 자동 동기화](https://github.com/dddami2000-debug/daejeon-parking-planning/pull/3)
  - [#4 README를 현재 서비스 구현에 맞게 갱신](https://github.com/dddami2000-debug/daejeon-parking-planning/pull/4)

## 3. 현재 구현된 화면·동작

- 모바일 우선 레이아웃: 화면 전체를 네이버 지도로 채우고 인터페이스를 지도 위에 오버레이한다.
- 상단: 서비스 로고, 현재 지역, 검색·현재 위치·필터 UI.
- 지도: 축제·랜드마크 버블과 주차장 마커 표시.
- 추천 영역: 상단 가로 슬라이더로 추천 장소 노출.
- 축제·랜드마크 선택:
  - 선택 장소 좌표를 중심으로 부드럽게 확대한다.
  - 주변 다른 장소 버블은 줄이고, 추천 주차장 1·2·3위와 일반 주변 주차장을 표시한다.
  - 아래 바텀시트에서 장소의 기간·운영시간·거리·소개·추천 이유를 확인한다.
  - `Esc` 또는 닫기로 이전 지도 중심·확대 배율로 부드럽게 복귀한다.
- 주차장 마커 또는 1·2·3위 선택 시 해당 주차장 정보가 표시된다.
- 주차 플랜은 서로 다른 기준의 `1안·2안·3안` 대신 종합 추천 점수 순서대로 `추천 1위·2위·3위`와 각 선정 이유를 표시한다.
- 세 후보가 공유하는 체감온도는 주차 플랜 상단에 한 번만 표시하고, 각 후보 카드는 도보 거리와 예상 요금만 비교한다.
- 주차 플랜 화면에서 예상 주차비, 후보 비교, 만차 시 다음 후보 전환, 내비게이션 연결을 제공한다.

주요 프런트 파일:

- `prototype/index.html`
- `prototype/app.js`
- `prototype/mobile.css`
- `prototype/styles.css`

## 4. 데이터·서버 구조

브라우저는 Vercel Functions를 호출하고, Functions가 공공데이터를 받아 Supabase에 정제·저장한다. 공공데이터 키와 Supabase Secret Key는 클라이언트로 보내지 않는다.

| 데이터셋 | 현재 소스 | 상태 |
| --- | --- | --- |
| 축제 | 한국관광공사 TourAPI 지역축제 정보 | 사용 중. 진행 중·예정 축제만 우선 노출 |
| 랜드마크 | 대전광역시 문화관광(관광지) API | 사용 중 |
| 주차장 | 대전광역시 실시간 주차장 정보 API | 사용 중. 공영·노상 데이터 포함 |
| 공공기관 주차장 | 공유누리 API | 보류. 승인·응답 데이터 품질 확인 필요 |
| 날씨 | 기상청 단기예보 → Open-Meteo fallback | Production 배포·기상청 실응답 검증 완료. Preview에는 기상청 키 미등록 |

### API 엔드포인트

- `GET /api/places` — 축제·랜드마크 목록
- `GET /api/parking?lat=...&lng=...` — 목적지 주변 주차장, 예상 요금, 체감온도 기반 추천
- `GET|POST /api/sync?dataset=festival|landmark|parking|sharenuri` — 데이터 수집 작업

서버 코드:

- `prototype/api/sync.js` — 수집·좌표화·Supabase upsert
- `prototype/api/places.js` — 축제·랜드마크 응답
- `prototype/api/parking.js` — 주변 주차장·요금 응답
- `prototype/api/_weather.js` — 기상청 우선·Open-Meteo fallback 날씨 조회
- `prototype/api/_parking-ranking.js` — 체감온도 기반 주차장 추천 점수
- `prototype/api/_lib.js` — Supabase 요청, 인증, 공통 함수
- `prototype/vercel.json` — 서울 리전과 일일 수집 Cron 설정

### 축제 처리 주의사항

- 현재 `FESTIVAL_API_KEY`는 **한국관광공사 TourAPI 지역축제** 키다.
- `sync.js`는 `searchFestival2`로 대전 지역(`lDongRegnCd=30`)의 올해·다음 해 축제를 수집한다.
- 종료일 기준으로 이미 끝난 축제를 제외한다.
- 축제 데이터에 좌표가 없을 수 있어 네이버 Geocoding API로 주소를 좌표화한다.
- `places.js`는 한국관광공사 축제 데이터가 있을 때 이전 대전 축제 소스보다 이를 우선 노출한다.

## 5. 환경 변수와 보안

실제 값은 이 문서·Git·채팅에 기록하지 않는다. 다음은 서비스에서 사용하는 환경 변수 이름이다.

```text
SUPABASE_URL
SUPABASE_SECRET_KEY
FESTIVAL_API_KEY
TOUR_API_KEY
DAEJEON_PARK_API_KEY
KMA_WEATHER_API_KEY
SHARENURI_API_KEY
NAVER_MAPS_CLIENT_ID
NAVER_MAPS_CLIENT_SECRET
CRON_SECRET
OPENAI_API_KEY
```

`KMA_WEATHER_API_KEY`는 Vercel Production에만 등록했다. Preview는 키가 없어 Open-Meteo를 사용하며, Production에서는 기상청 요청이 실패할 때만 Open-Meteo로 전환된다. 2026-08-25 Production 실응답에서 `weather.source: "kma"`, `fallbackUsed: false`를 확인했다.

`prototype/.env.example`에는 현재 네이버 Geocoding 환경 변수 두 개가 빠져 있다. 다음 환경 변수 정리 작업 때 함께 추가하면 된다.

네이버 지도 JavaScript API의 공개 Client ID는 `prototype/index.html`에 포함되어 있다. 배포 도메인과 개발용 주소를 네이버 클라우드 플랫폼의 Web 서비스 URL 허용 목록에 등록해야 지도 인증 오류가 나지 않는다.

특히 `file://`로 열거나 같은 와이파이의 휴대폰 IP 주소로 접속하면 네이버 지도 인증 오류가 날 수 있다. 휴대폰 테스트는 Production Vercel URL을 우선 사용한다.

## 6. 자동 배포 현황과 남은 작업

현재 확인된 동작:

```text
포크 main 푸시 → Vercel Production 자동 배포
```

원하는 최종 흐름은 아래다.

```text
원본 main 병합 → GitHub Actions가 포크 main 동기화 → Vercel Production 배포
```

이를 위한 GitHub Actions 파일은 PR #3에 있다: `.github/workflows/sync-deployment-fork.yml`.

다만 **아직 자동 동기화는 완성되지 않았다.** 원본 저장소가 개인 소유 저장소라 `sjndox` 협업자 계정으로는 Actions Secret을 등록할 수 없었다. 원본 소유자 계정으로 로그인한 뒤 아래 작업이 필요하다.

1. 포크에 쓰기 권한만 가진 SSH deploy key를 새로 생성한다.
2. 그 공개 키를 포크 `sjndox/daejeon-parking-planning`의 write-enabled deploy key로 등록한다.
3. 개인 키를 원본 저장소 Actions Secret `FORK_DEPLOY_KEY`에 등록한다.
4. PR #3을 병합하고, 원본 main에 작은 변경을 병합해 workflow 실행을 확인한다.

이전 시도에서 만든 키는 Secret 등록이 403으로 실패한 뒤 즉시 삭제했다. 현재 유효한 배포 키나 개인 키는 남아 있지 않다.

자동화가 완료되기 전에는 아래 명령으로 안전하게 수동 동기화한다. 강제 푸시는 사용하지 않는다.

```bash
git fetch origin main
git fetch fork main
git merge-base --is-ancestor fork/main origin/main
git push fork origin/main:main
```

## 7. 실행·검증 방법

### 로컬 실행

정적 파일 서버만 사용하면 Vercel Functions가 실행되지 않는다. API까지 보려면 다음처럼 실행한다.

```bash
cd prototype
vercel env pull .env.local
vercel dev
```

### 배포 확인

```bash
npx --yes vercel@latest ls daejeon-parking-planning --scope asdf-a266
```

가장 최근 항목이 `Production` 및 `Ready`인지 확인한다.

## 8. 다음 우선순위 제안

1. 원본→포크 GitHub Actions 자동 동기화 완성(PR #3 + 원본 소유자 Secret 등록).
2. README PR #4 검토·병합.
3. 공유누리 API 응답을 다시 검증하고, 유효한 공공기관 주차장만 병합.
4. 체감온도 기반 추천은 포크 `main`과 Vercel Production 반영 및 기상청 실응답 검증 완료. 원본 저장소 반영을 위한 PR 생성·검토가 남아 있음.
5. OpenAI API를 이용한 취향 테스트 결과 설명·추천 문구를 서버에서 생성하도록 고도화.
6. 휴대폰 Production URL로 지도, 바텀시트, 주차장 전환, 외부 길안내를 최종 점검.
