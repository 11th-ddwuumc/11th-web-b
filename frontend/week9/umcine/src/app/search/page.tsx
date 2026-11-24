import { Suspense } from "react";
import { SearchPage } from "../../views/movies/search-page";

export const metadata = { title: "영화 검색" };

async function SearchScreen({ searchParams }: {
  searchParams: Promise<{ query?: string | string[] }>;
}) {
  const { query } = await searchParams;
  const searchTerm = typeof query === "string" ? query : undefined;
  return <SearchPage key={searchTerm ?? ""} query={searchTerm} />;
}

export default function Page(props: { searchParams: Promise<{ query?: string | string[] }> }) {
  return (
    <Suspense fallback={<main className="p-10">검색을 준비하고 있어요.</main>}>
      <SearchScreen {...props} />
    </Suspense>
  );
}
