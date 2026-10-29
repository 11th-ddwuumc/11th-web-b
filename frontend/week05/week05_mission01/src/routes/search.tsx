import { createFileRoute } from "@tanstack/react-router";
import SearchPage from "../pages/movies/search-page";

type SearchPageParams = {
  query?: string;
};

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): SearchPageParams => ({
    query: typeof search.query === "string" ? search.query : undefined,
  }),
  component: SearchPage,
});
