# UMCine 백엔드 · 9주차

`./gradlew bootRun`으로 로컬 서버를 실행합니다. Swagger UI는 `http://localhost:8080/swagger-ui/index.html`, OpenAPI JSON은 `http://localhost:8080/v3/api-docs`에서 확인합니다.

Swagger에서 회원가입 후 로그인하고 발급받은 JWT를 Authorize에 입력합니다. `POST /favorites`에 `{"movieId":550}`을 보내고 같은 요청을 다시 보내면 각각 `201 COMMON201`, `409 FAVORITE409_1`을 확인할 수 있습니다.

`./gradlew test`는 Mockito 서비스 단위 테스트와 테스트 전용 H2·MockMvc 통합 테스트를 실행합니다. 보고서는 `build/reports/tests/test/index.html`에 생성됩니다.
