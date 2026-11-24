import { Suspense } from "react";
import { MovieDetailPage } from "../../../views/movies/movie-detail-page";

export const metadata = { title: "영화 상세" };

async function MovieScreen({ params }: { params: Promise<{ movieId: string }> }) {
  const { movieId } = await params;
  return <MovieDetailPage movieId={Number(movieId)} />;
}

export default function Page(props: { params: Promise<{ movieId: string }> }) {
  return (
    <Suspense fallback={<main className="p-10">영화 상세를 준비하고 있어요.</main>}>
      <MovieScreen {...props} />
    </Suspense>
  );
}
