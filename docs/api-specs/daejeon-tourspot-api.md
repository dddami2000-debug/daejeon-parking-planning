# 대전광역시 문화관광(관광지) API 명세

## 목적

대전의 문화유산·자연명소·박물관·예술 공간 등 랜드마크를 수집해 서비스의 `places` 테이블에 랜드마크(`landmark`) 데이터로 저장한다.

## 출처

- 제공기관: 대전광역시 법무통계담당관
- OpenAPI 명: 대전광역시 문화관광(관광지)
- 형식: REST `GET`, JSON
- 이용 조건: 무료, 공공저작물 출처표시(공공누리 제1유형)
- 환경변수: `TOUR_API_KEY`

## 호출 정보

```text
Base URL: https://apis.data.go.kr/6300000/openapi2022/tourspot
Endpoint: GET /gettourspot
Full URL: https://apis.data.go.kr/6300000/openapi2022/tourspot/gettourspot
```

### 요청 파라미터

| 이름 | 필수 | 설명 |
| --- | --- | --- |
| `serviceKey` | 예 | 공공데이터포털 인증키. Vercel 환경변수 `TOUR_API_KEY`에서만 읽는다. |
| `pageNo` | 예 | 페이지 번호. 1부터 순차 호출한다. |
| `numOfRows` | 예 | 한 페이지 결과 수. 100으로 요청한다. |

### 예시

```text
GET /gettourspot?serviceKey=<server-only-key>&pageNo=1&numOfRows=100
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
        "tourspotNm": "엑스포과학공원",
        "tourspotZip": "우편번호",
        "tourspotAddr": "대전광역시 ...",
        "tourspotDtlAddr": "상세 주소",
        "refadNo": "식별값",
        "mngTime": "운영 시간",
        "tourUtlzAmt": "이용 요금",
        "pkgFclt": "주차 등 부대시설",
        "cnvenFcltGuid": "편의시설 안내",
        "urlAddr": "공식 URL",
        "tourspotSumm": "관광지 소개",
        "mapLat": "36.374...",
        "mapLot": "127.386..."
      }
    ],
    "totalCount": "..."
  }
}
```

`body.items`는 결과 수에 따라 객체 또는 배열로 내려올 수 있으므로, 수집 코드에서 항상 배열로 정규화한다.

## Supabase `places` 매핑

| API 필드 | DB 필드 | 처리 |
| --- | --- | --- |
| `refadNo` | `external_id` | 우선 사용. 빈 값이면 이름·주소 기반 안정적 해시를 생성한다. |
| 고정값 | `source` | `daejeon_tourspot` |
| 고정값 | `category` | `landmark` |
| `tourspotNm` | `name` | 랜드마크명 |
| `tourspotAddr` + `tourspotDtlAddr` | `address` | 빈 값을 제외하고 조합 |
| `mapLat` | `latitude` | 숫자 변환 후 한국 좌표 범위를 검증한다. |
| `mapLot` | `longitude` | 숫자 변환 후 한국 좌표 범위를 검증한다. |
| `mngTime` | `operating_hours.raw` | 자유 형식 운영 시간 원문 보존 |
| `tourspotSumm` | `description` | 소개문 |
| `urlAddr` | `homepage_url` | URL 형식 검증 후 저장 |
| `tourspotZip`, `tourUtlzAmt`, `pkgFclt`, `cnvenFcltGuid` | `metadata` | 원문 보존 |

## 활용 방식

- 지도 버블: `mapLat`, `mapLot`을 그대로 사용해 랜드마크 위치를 표시한다.
- 상세 패널: 소개, 운영 시간, 이용 요금, 편의·부대시설, 홈페이지를 제공한다.
- 주차 추천: 랜드마크 좌표를 기준으로 `parking_lots`의 거리·예상 요금·운영 여부를 계산한다.
- 추천: 심리 테스트 유형, 현재 위치와의 거리, 운영 여부를 점수에 반영한다.

## 오류 처리

| 코드 | 의미 | 처리 |
| --- | --- | --- |
| `C10` | 잘못된 요청 파라미터 | 파라미터 이름만 서버 로그에 남기고 동기화 실패 처리 |
| `C11` | 잘못된 접근 | 서비스키 승인 상태와 호출 경로를 확인 |
| HTTP 200 + 결과 오류 | API 내부 오류 | `data_sync_logs`에 실패 원인 기록 |

## 동기화 및 저작자 표시

- 기본 동기화 주기: 하루 1회
- upsert 기준: `(source, external_id)`
- API 키와 원본 응답 전체는 브라우저로 전달하지 않는다.
- 화면 하단 또는 데이터 출처 영역에 `출처: 대전광역시 문화관광(관광지)`를 표시한다.
- 수집 실행 결과는 `data_sync_logs`에 기록한다.
