
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />

      <footer className="border-t border-gray-200 bg-white px-5 py-6 text-center text-xs text-gray-500">
        <p>
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </p>
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block underline"
        >
          TMDB
        </a>
      </footer>
    </>
  ),
  notFoundComponent: () => (
    <main className="mx-auto min-h-[calc(100vh-65px)] max-w-[1126px] px-5 py-20 text-center">
      페이지를 찾을 수 없어요.
    </main>
  ),
});
