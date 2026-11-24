import { Link } from "@tanstack/react-router";

import type { Movie } from "../../types/movie";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="w-full min-w-0">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[9px] bg-[#e8e9ec]">
        <Link
          className="block h-full w-full"
          to="/movies/$movieId"
          params={{
            movieId: String(movie.id),
          }}
        >
          <img
            className="h-full w-full object-cover"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />
        </Link>

        <BookmarkButton
          className="absolute top-[9px] right-[9px]"
          movieId={movie.id}
          movieTitle={movie.title}
        />
      </div>

      <h2 className="mt-[9px] mb-[3px] w-full overflow-hidden text-ellipsis whitespace-nowrap text-[13px] leading-[1.4] font-bold tracking-[-0.25px] text-[#292a2d]">
        <Link
          to="/movies/$movieId"
          params={{
            movieId: String(movie.id),
          }}
        >
          {movie.title}
        </Link>
      </h2>

      <p className="m-0 text-[11px] leading-[1.4] font-normal text-[#9a9da3]">
        {movie.releaseDate}
      </p>
    </article>
  );
}