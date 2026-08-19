# AOS 교환부품 조회 UI

React + Vite + CSS로 만든 실행 가능한 퍼블리싱 샘플입니다.

## 실행

```bash
npm install
npm run dev
```

브라우저에서 Vite가 표시하는 주소(기본 `http://localhost:5173`)로 접속합니다.

## 구성

- 대시보드형 통계 카드
- 교환부품 검색 조건
- 접수 목록 테이블
- 접수 상세 패널
- 전송 상태 Badge
- 재전송 버튼
- 반응형 레이아웃
- 실제 API 없이 샘플 데이터로 동작

## Spring Boot API 연결

현재 샘플 데이터는 `src/main.jsx`의 `initialRows`를 사용합니다.
추후 Axios/Fetch를 추가하여 다음 API와 연결할 수 있습니다.

- `GET /api/v1/events`
- `GET /api/v1/events/{receiptNo}`
- `POST /api/v1/provider/events`
- `GET /api/v1/provider/events/{receiptNo}`

API Base URL은 환경변수로 분리하는 것을 권장합니다.
</br>
http://localhost:5173/</br> 
http://192.168.0.5:5173/</br>
</br>
<img width="1893" height="1076" alt="image" src="https://github.com/user-attachments/assets/4478d240-6676-481c-a6ab-f880c7eef58f" />
