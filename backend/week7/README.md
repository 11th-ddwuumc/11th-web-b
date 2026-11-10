# 7주차 - JWT 인증/인가와 사용자 토큰 관리

6주차 Spring Boot API를 확장해 JWT 로그인, 인증 인터셉터, 내 정보 조회/수정과 토큰 기반 평점 CRUD를 구현했습니다.

## 실행

```bash
./gradlew bootRun
```

기본 개발 설정은 H2 인메모리 DB와 1시간 만료 JWT를 사용합니다. 배포 환경에서는 반드시 `JWT_SECRET`과 `JWT_ACCESS_EXPIRATION`을 환경변수로 주입하세요.

## 주요 API

- `POST /members`: 회원가입
- `GET /members/email/{email}`, `GET /members/nickname/{nickname}`: 중복 확인
- `POST /auth/login`: 로그인 및 access token 발급
- `GET /members/me`, `PATCH /members/me`: 로그인 회원 정보
- `POST /ratings`, `PATCH /ratings/{ratingId}`, `DELETE /ratings/{ratingId}`: 인증된 회원의 평점 변경
- `GET /members/{memberId}/ratings`: 공개 평점 목록

인증 API는 `Authorization: Bearer {accessToken}` 헤더가 필요합니다.
