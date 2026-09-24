import { useState, type FormEvent } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { movies } from "../../data/movies";
import type { Movie } from "../../types/movie";
import SearchResultCard from "../../components/movies/search-result-card";

function chunkPairs(items: Movie[]): Movie[][] {
  const rows: Movie[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2));
  }
  return rows;
}

function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [keyword, setKeyword] = useState(query ?? "");

  const trimmedQuery = query?.trim() ?? "";
  const results = trimmedQuery
    ? movies.filter(
        (movie) =>
          movie.title.includes(trimmedQuery) ||
          movie.originalTitle.toLowerCase().includes(trimmedQuery.toLowerCase()),
      )
    : [];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextQuery = keyword.trim();
    navigate({ to: "/search", search: nextQuery ? { query: nextQuery } : {} });
  };

  const handleReset = () => {
    setKeyword("");
    navigate({ to: "/search", search: {} });
  };

  if (!trimmedQuery) {
    return (
      <main className="flex h-[582px] items-center justify-center px-20">
        <div className="w-[790px] text-center">
          <h1 className="text-[40px] leading-[53px] font-bold text-ink">
            어떤 영화를 찾고 있나요?
          </h1>
          <form
            onSubmit={handleSubmit}
            className="mt-[22px] flex h-[74px] items-center gap-3 rounded-lg border border-ink bg-surface px-6"
          >
            <img src="/icons/search.svg" alt="" width={24} height={24} />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="예: 스파이더맨"
              className="h-full flex-1 text-[15px] text-ink placeholder:text-faint focus:outline-none"
            />
            <button
              type="submit"
              className="flex h-[42px] w-[59px] items-center justify-center rounded-md bg-ink text-sm font-semibold text-surface"
            >
              검색
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="px-20 pt-6 pb-15">
      <h1 className="text-[32px] leading-[44px] font-bold text-ink">영화 검색</h1>
      <form
        onSubmit={handleSubmit}
        className="mt-[17px] flex h-[54px] items-center gap-3 rounded-lg border border-ink bg-surface px-4"
      >
        <img src="/icons/search.svg" alt="" width={24} height={24} />
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          className="h-full flex-1 text-[15px] text-ink focus:outline-none"
        />
        <button type="button" onClick={handleReset} aria-label="검색어 지우기">
          <img src="/icons/close.svg" alt="" width={24} height={24} />
        </button>
        <button
          type="submit"
          className="flex h-[42px] w-[86px] items-center justify-center rounded-md bg-ink text-sm font-semibold text-surface"
        >
          다시 검색
        </button>
      </form>

      <div className="flex h-[54px] items-center justify-between">
        <h2 className="text-[18px] leading-[21px] font-bold text-ink">
          '{trimmedQuery}' 검색 결과
        </h2>
        <span className="text-[13px] leading-[14px] text-faint">영화 {results.length}편</span>
      </div>

      {results.length === 0 ? (
        <p className="py-16 text-center text-[15px] font-medium text-muted">
          '{trimmedQuery}'와 일치하는 영화를 찾을 수 없어요.
        </p>
      ) : (
        <div className="divide-y divide-line">
          {chunkPairs(results).map((row, index) => (
            <div key={index} className="grid grid-cols-2 gap-x-10 py-6">
              {row.map((movie) => (
                <SearchResultCard key={movie.id} movie={movie} />
              ))}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default SearchPage;
