# tokens.md — tokens.json 한국어 설명

`docs/tokens.json`의 값을 그룹별로 풀어 쓴 설명 문서다. 원본 JSON은 바꾸지 않았다.
"쓰는 곳"은 `docs/Design.md`에서 확인된 범위만 적었다. 근거가 없거나 두 문서가 다르면 `⚠ 확인 필요`로 표시했다.

## 0. 파일 구조

| 그룹 | 내용 |
|---|---|
| `primitive` | 색 원재료. 이름과 HEX 값만 있다. 화면 코드에서 직접 쓰지 않고 semantic 토큰이 참조한다. |
| `semantic` | 역할별 색. `value`는 최종 색, `primitive`는 어떤 원재료를 가져왔는지 나타낸다. |
| `typography` | 글꼴 이름과 글자 크기(px). 줄높이·굵기는 이 파일에 없다(Design.md 2장의 텍스트 스타일 참고). |
| `spacing` | 여백·간격 값(px). |
| `radius` | 모서리 둥글기 값(px). |

- 이름의 `/` 앞은 분류, 뒤는 단계다. 예: `gray/900`은 회색 900단계(숫자가 클수록 진함).
- 같은 색이라도 역할이 다르면 다른 토큰이다. 값이 같다고 서로 바꿔 쓰지 않는다. (Design.md 1장 "적용 시 구분")

## 1. primitive — 색 원재료

| 토큰 | 값 | 설명 |
|---|---|---|
| gray/950 | #000000 | 순수 검정 |
| gray/900 | #181A1B | 가장 진한 글자색 계열 |
| gray/800 | #2D2D2D | 어두운 배경용 |
| gray/600 | #66707A | 보조 글자·아이콘용 중간 회색 |
| gray/500 | #878787 | 덜 중요한 글자용 회색 |
| gray/400 | #B7BDC4 | 입력칸 안내 글자(placeholder)용 연회색 |
| gray/300 | #D9DCDF | 기본 테두리·비활성 버튼용 |
| gray/200 | #EFF1F3 | 옅은 배경·구분선용 |
| gray/100 | #F7F7F7 | 아주 옅은 배경 |
| gray/0 | #FFFFFF | 흰색 |
| pink/500 | #FF2E98 | 브랜드 대표 분홍 |
| pink/600 | #E6007E | 더 진한 분홍. 버튼에 마우스를 올렸을 때(Hover) 쓴다 |
| pink/50 | #FFF5FA | 아주 옅은 분홍 배경 |
| pink/25 | #FFF8F5 | 가장 옅은 분홍. ⚠ 확인 필요: 이 값을 참조하는 semantic 토큰이 없고 Design.md에도 쓰는 곳이 없다 |
| red/500 | #E30036 | 오류 표시용 빨강 |
| red/50 | #FFF0F3 | 옅은 오류 배경 |
| black/10 | #0000001A | 검정 10% 투명. 구분선용 |

> ⚠ 확인 필요: `gray/300`이 tokens.json에서는 `#D9DCDF`, Design.md에서는 `#D9DCE0`이다. 둘 중 어느 값이 맞는지 정해야 한다.

## 2. semantic — 역할별 색

### 글자색 (text)

| 토큰 | 값 (참조) | 설명 |
|---|---|---|
| text/primary | #181A1B (gray/900) | 기본 글자색. 제목, 요금, 입력을 마친 값, 일반 본문 |
| text/secondary | #66707A (gray/600) | 보조 설명, 정보 행의 항목 이름, Tag 글자 |
| text/tertiary | #878787 (gray/500) | 가격 카드의 라벨, 정가, 부가 설명 |
| text/accent | #FF2E98 (pink/500) | 강조 글자. 할인율, 강조 값, 단계 표시 |
| text/on-dark | #FFFFFF (gray/0) | 진한 배경 위 글자. 주요 버튼, 선택된 필터 칩 |
| text/error | #E30036 (red/500) | 입력칸 오류 문구 |
| text/placeholder | #B7BDC4 (gray/400) | 입력칸이 비었을 때 보이는 안내 글자 |
| text/on-disabled | #66707A (gray/600) | 입력할 수 없는 입력칸(disabled)의 글자 |

### 배경 (bg · surface)

| 토큰 | 값 (참조) | 설명 |
|---|---|---|
| bg/surface | #FFFFFF (gray/0) | 화면 바탕, 상단 바(Header), 하단 버튼 영역, 요금제 카드 |
| surface/default | #FFFFFF (gray/0) | 보조 버튼(Secondary) 기본 배경. bg/surface와 값은 같지만 별도 토큰이다 |
| bg/default | #F7F7F7 (gray/100) | 가격 카드 배경, 선택된 선택지 배경 |
| bg/subtle | #EFF1F3 (gray/200) | 비활성 입력칸, 보조 버튼 Hover, 혜택 칩, 진행 막대 바탕 |
| bg/inverse | #2D2D2D (gray/800) | 어두운 배경. ⚠ 확인 필요: 실제로 쓰는 곳이 확인되지 않았다 |
| bg/accent-subtle | #FFF5FA (pink/50) | 할인·프로모션 칩 배경 |
| bg/error-subtle | #FFF0F3 (red/50) | 옅은 오류 배경. ⚠ 확인 필요: 실제로 쓰는 곳이 확인되지 않았다 |

### 채움 (fill · brand)

| 토큰 | 값 (참조) | 설명 |
|---|---|---|
| fill/primary | #FF2E98 (pink/500) | 주요 버튼(Primary), 선택 표시, 완료 마크 |
| fill/primary-hover | #E6007E (pink/600) | 주요 버튼에 마우스를 올렸을 때 |
| fill/accent | #E6007E (pink/600) | 강조 채움. ⚠ 확인 필요: 실제로 쓰는 곳이 확인되지 않았다. fill/primary-hover와 값만 같다 |
| fill/secondary | #181A1B (gray/900) | 선택된 필터 칩, 패키지 칩의 진한 배경 |
| fill/tertiary | #EFF1F3 (gray/200) | 옅은 채움. ⚠ 확인 필요: 실제로 쓰는 곳이 확인되지 않았다 |
| fill/disabled | #D9DCDF (gray/300) | 눌리지 않는 버튼(disabled) 배경 |
| fill/disabled-strong | #B7BDC4 (gray/400) | 더 진한 비활성 채움. ⚠ 확인 필요: 실제로 쓰는 곳이 확인되지 않았다 |
| brand/primary | #FF2E98 (pink/500) | 로고 색 |

### 테두리·구분선 (border)

| 토큰 | 값 (참조) | 설명 |
|---|---|---|
| border/default | #D9DCDF (gray/300) | 입력칸 기본 선, 보조 버튼, 기본 카드·선택지 테두리 |
| border/subtle | #EFF1F3 (gray/200) | 정보 행 사이 구분선, 하단 버튼 영역 윗선. Tag 배경에도 쓰인다 |
| border/medium | #66707A (gray/600) | 선택된 요금제 카드·선택지의 테두리 |
| border/strong | #181A1B (gray/900) | 진한 테두리. ⚠ 확인 필요: 실제로 쓰는 곳이 확인되지 않았다 |
| border/divider | #0000001A (black/10) | 디자인 정리용 구역 경계선. 제품 화면 구분선과는 다르다 |
| border/focus | #FF2E98 (pink/500) | 입력 중인 입력칸의 선 |
| border/error | #E30036 (red/500) | 오류가 난 입력칸의 선 |

### 아이콘·효과 (icon · effect)

| 토큰 | 값 (참조) | 설명 |
|---|---|---|
| icon/default | #66707A (gray/600) | 뒤로가기·체크 아이콘 |
| icon/strong | #181A1B (gray/900) | 진한 아이콘. ⚠ 확인 필요: 실제로 쓰는 곳이 확인되지 않았다 |
| icon/primary | #000000 (gray/950) | 검정 아이콘. ⚠ 확인 필요: 실제로 쓰는 곳이 확인되지 않았다 |
| icon/accent | #FF2E98 (pink/500) | 정보 행의 강조 점. 할인·프로모션 칩 글자에도 쓰인다 |
| icon/on-dark | #FFFFFF (gray/0) | 진한 배경 위 아이콘. 완료 마크 안쪽 모양 |
| icon/disabled | #D9DCDF (gray/300) | 비활성 아이콘. ⚠ 확인 필요: 실제로 쓰는 곳이 확인되지 않았다 |
| icon/error | #E30036 (red/500) | 입력칸 오류 아이콘 |
| effect/shadow-subtle | #0000000D (참조 없음) | 검정 5% 투명 그림자 색. 그림자 위치·번짐 정도는 이 토큰에 없다 |

## 3. typography — 글꼴·글자 크기

글꼴은 `Noto Sans KR` 하나다(`font-family/family-font`). 아래 크기는 px이며, 줄높이·굵기는 Design.md 2장의 텍스트 스타일과 묶어서 쓴다.

| 토큰 | 크기 | 설명 |
|---|---:|---|
| font-size/heading-h1 | 32 | 가장 큰 대표 제목. ⚠ 확인 필요: 4개 화면에서 실제로 쓰인 곳이 확인되지 않았다 |
| font-size/heading-h2 | 28 | 가격 카드의 주요 금액 |
| font-size/heading-h3 | 24 | 화면 본문 제목, 섹션 제목, 신청 완료 제목 |
| font-size/heading-h4 | 20 | 첫 화면 상단 바(Header root) 제목 |
| font-size/subtitle | 18 | 요금제 이름·가격·할인율, 하단 금액, 하위 화면 상단 바 제목 |
| font-size/body | 16 | 버튼 글자, 입력값, 선택지 제목 |
| font-size/body-small | 14 | 카드 설명, 정보 행, 입력 오류 문구, 안내 문구, 필터 칩 |
| font-size/caption | 13 | 가격 카드 라벨·정가, Tag, 할인 칩, 단계 문구 |
| font-size/12 | 12 | 작은 보조 정보. ⚠ 확인 필요: 실제로 쓰인 곳이 확인되지 않았다 |
| font-size/caption-mini | 10 | 혜택·패키지 칩 |

## 4. spacing — 여백·간격

값은 px이다. JSON 안의 순서는 크기순이 아니지만 아래 표는 크기순으로 정리했다.

| 토큰 | 값 | 설명 |
|---|---:|---|
| spacing/0 | 0 | 간격 없음 |
| spacing/2 | 2 | ⚠ 확인 필요: 주요 쓰는 곳이 정리되어 있지 않다 |
| spacing/4 | 4 | 작은 내부 간격, 상단 바 위아래 여백 |
| spacing/6 | 6 | ⚠ 확인 필요: 주요 쓰는 곳이 정리되어 있지 않다 |
| spacing/8 | 8 | 카드 내부 간격, 버튼 사이 간격, 단계 문구와 진행 막대 사이 |
| spacing/10 | 10 | ⚠ 확인 필요: 주요 쓰는 곳이 정리되어 있지 않다 |
| spacing/12 | 12 | 섹션 내부 간격, 정보 행 위아래 여백, 입력칸과 문구 사이 |
| spacing/16 | 16 | 신청·완료 화면 본문 여백, 상단 바 좌우 여백 |
| spacing/20 | 20 | 요금제 카드·가격 카드 안쪽 여백 |
| spacing/24 | 24 | 목록·상세 화면 본문 여백, 버튼 좌우 여백 |
| spacing/28 | 28 | ⚠ 확인 필요: 주요 쓰는 곳이 정리되어 있지 않다 |
| spacing/32 | 32 | 하단 버튼 영역 아래 여백(홈 인디케이터 공간) |
| spacing/40 | 40 | ⚠ 확인 필요: 주요 쓰는 곳이 정리되어 있지 않다 |
| spacing/48 | 48 | ⚠ 확인 필요: 주요 쓰는 곳이 정리되어 있지 않다 |
| spacing/56 | 56 | ⚠ 확인 필요: 주요 쓰는 곳이 정리되어 있지 않다 |
| spacing/60 | 60 | ⚠ 확인 필요: 주요 쓰는 곳이 정리되어 있지 않다 |
| spacing/64 | 64 | ⚠ 확인 필요: 주요 쓰는 곳이 정리되어 있지 않다 |
| spacing/80 | 80 | ⚠ 확인 필요: 주요 쓰는 곳이 정리되어 있지 않다 |

## 5. radius — 모서리 둥글기

값은 px이다. 숫자가 클수록 둥글다.

| 토큰 | 값 | 설명 |
|---|---:|---|
| radius/0 | 0 | 각진 모서리. 상단 바, 입력칸 |
| radius/2 | 2 | ⚠ 확인 필요: 주요 쓰는 곳이 정리되어 있지 않다 |
| radius/4 | 4 | 혜택·패키지 칩 |
| radius/5 | 5 | ⚠ 확인 필요: 주요 쓰는 곳이 정리되어 있지 않다 |
| radius/6 | 6 | 할인 칩 |
| radius/8 | 8 | 버튼 |
| radius/10 | 10 | ⚠ 확인 필요: 주요 쓰는 곳이 정리되어 있지 않다 |
| radius/12 | 12 | 가격 카드, 선택지 |
| radius/16 | 16 | 요금제 카드 |
| radius/20 | 20 | ⚠ 확인 필요: 주요 쓰는 곳이 정리되어 있지 않다 |
| radius/24 | 24 | ⚠ 확인 필요: 주요 쓰는 곳이 정리되어 있지 않다 |
| radius/32 | 32 | ⚠ 확인 필요: 주요 쓰는 곳이 정리되어 있지 않다 |
| radius/40 | 40 | ⚠ 확인 필요: 주요 쓰는 곳이 정리되어 있지 않다 |
| radius/999 | 999 | 알약 모양. Tag |
| radius/full | 9999 | 완전한 원·알약 모양. 필터 칩, 선택 표시, 진행 막대, 완료 마크 |

> ⚠ 확인 필요: `radius/999`와 `radius/full`은 둘 다 알약 모양을 만든다. Tag만 999를 쓰고 나머지는 full을 쓴다. 하나로 합칠지 정해야 한다.
