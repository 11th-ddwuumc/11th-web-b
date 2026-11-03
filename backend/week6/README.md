# Week 6 API

## 실행

```bash
./gradlew bootRun
```

H2 메모리 DB를 사용하므로 별도 MySQL 설정 없이 실행됩니다. H2 Console은 `http://localhost:8080/h2-console`에서 확인할 수 있습니다.

## API

| Method | Path | 설명 |
| --- | --- | --- |
| POST | `/members` | 회원가입 |
| GET | `/members/{memberId}/ratings` | 회원 평점 목록 조회 |
| POST | `/members/{memberId}/ratings` | 평점 등록 |
| PATCH | `/members/{memberId}/ratings/{ratingId}` | 평점 수정 |
| DELETE | `/members/{memberId}/ratings/{ratingId}` | 평점 삭제 (204) |
