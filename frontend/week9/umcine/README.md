# UMCine · 9주차

기존 UMCine을 Next.js App Router로 옮긴 프로젝트입니다.

## 실행

1. `pnpm install`을 실행합니다.
2. `.env.example`을 `.env.local`로 복사합니다. 실제 영화 데이터를 조회하려면 `TMDB_ACCESS_TOKEN`에 본인의 TMDB API Read Access Token을 입력합니다.
3. 회원가입, 로그인, 내 정보 조회·수정을 사용하려면 `backend/week9`에서 `./gradlew bootRun`을 실행합니다.
4. `pnpm dev`로 앱을 시작합니다. 프로덕션 모드는 `pnpm build` 후 `pnpm start`로 확인합니다.

영화 목록은 `/`, 검색은 `/search`, 상세는 `/movies/[movieId]`에서 확인할 수 있습니다. 브라우저는 같은 출처의 영화 Route Handler에 요청하며, TMDB 토큰은 그 서버 코드에서 읽습니다.

`/practice`에서 클라이언트 버튼, 공통 레이아웃, 정적 페이지, 서버 데이터 조회, 이미지·폰트 최적화와 메타데이터 실습을 확인할 수 있습니다.
