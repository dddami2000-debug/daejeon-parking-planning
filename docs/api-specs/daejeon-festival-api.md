# 대전광역시 문화축제 정보 API 명세

## 목적

대전시 문화축제·행사 목록을 수집해 서비스의 `places` 테이블에 축제(`festival`) 데이터로 저장한다.

## 출처

- 제공기관: 대전광역시 법무통계담당관
- OpenAPI 명: 대전광역시 문화축제 정보
- 형식: REST `GET`, JSON
- 이용 조건: 무료, 개발·운영계정 자동 승인
- 환경변수: `FESTIVAL_API_KEY`

## 호출 정보

```text
Base URL: https://apis.data.go.kr/6300000/openapi2022/festv
Endpoint: GET /getfestv
Full URL: https://apis.data.go.kr/6300000/openapi2022/festv/getfestv
```

### 요청 파라미터

| 이름 | 필수 | 설명 |
| --- | --- | --- |
| `serviceKey` | 예 | 공공데이터포털 인증키. Vercel 환경변수 `FESTIVAL_API_KEY`에서만 읽는다. |
| `pageNo` | 예 | 페이지 번호. 1부터 순차 호출한다. |
| `numOfRows` | 예 | 페이지당 결과 수. 100으로 요청한다. |

### 예시

```text
GET /getfestv?serviceKey=<server-only-key>&pageNo=1&numOfRows=100
```

## 응답 구조

```json
{
  "header": {
    "resultCode": "00",
    "resultMsg": "NORMAL SERVICE."
  },
  "body": {
    "items": [
      {
        "festvNm": "대전 0시 축제",
        "festvSumm": "축제 소개",
        "festvTpic": "축제 주제",
        "festvPrid": "2026.08.12. ~ 2026.08.16.",
        "festvPlcNm": "행사장",
        "festvHostNm": "주관기관",
        "svorgnNm": "주최기관",
        "festvZip": "우편번호",
        "festvAddr": "대전광역시 ...",
        "festvDtlAddr": "상세 주소",
        "refadNo": "식별값",
        "hmpgAddr": "홈페이지 URL"
      }
    ],
    "totalCount": "9"
  }
}
```

`body.items`가 결과 1건일 때 객체로 내려오는 경우를 고려해, 수집 코드에서 항상 배열로 정규화한다.

## Supabase `places` 매핑

| API 필드 | DB 필드 | 처리 |
| --- | --- | --- |
| `refadNo` | `external_id` | 우선 사용. 빈 값이면 이름·주소 기반의 안정적 해시를 생성한다. |
| 고정값 | `source` | `daejeon_festival` |
| 고정값 | `category` | `festival` |
| `festvNm` | `name` | 축제명 |
| `festvAddr` + `festvDtlAddr` | `address` | 빈 값은 제외하고 조합 |
| `festvSumm` | `description` | 축제 소개 |
| `hmpgAddr` | `homepage_url` | URL 형식만 저장 |
| `festvPrid` | `metadata.period_raw` | 원문을 보존하고 날짜 파서는 별도 적용 |
| `festvTpic`, `festvPlcNm`, `festvHostNm`, `svorgnNm`, `festvZip` | `metadata` | 원문 보존 |

## 보강이 필요한 정보

이 API 명세에는 지도 좌표와 세부 운영 시간이 없다.

- `latitude`, `longitude`: 주소를 네이버 Geocoding으로 변환하거나, 한국관광공사 TourAPI의 축제·관광지 상세 정보와 매칭해 보강한다.
- `start_date`, `end_date`: `festvPrid`의 표기 형식이 일정하지 않을 수 있으므로 파싱 실패 시 원문만 보존한다.
- 행사 운영 시간·이미지·상세 소개: 한국관광공사 TourAPI 상세 정보 또는 공식 홈페이지에서 보강한다.

따라서 지도 버블과 D-day 계산은 TourAPI 명세를 받은 뒤 좌표·날짜 보강 규칙까지 구현한다.

## 오류 처리

| 코드 | 의미 | 처리 |
| --- | --- | --- |
| `C10` | 잘못된 요청 파라미터 | 서버 로그에 파라미터 이름만 남기고 동기화 실패 처리 |
| `C11` | 잘못된 접근 | 서비스키 승인 상태와 호출 경로를 확인 |
| HTTP 200 + 결과 오류 | API 내부 오류 | `data_sync_logs`에 실패 원인 기록 |

## 동기화 정책

- 기본 주기: 하루 1회
- upsert 기준: `(source, external_id)`
- API 키와 원본 응답 전체는 브라우저로 전달하지 않는다.
- 수집 실행 결과는 `data_sync_logs`에 기록한다.
