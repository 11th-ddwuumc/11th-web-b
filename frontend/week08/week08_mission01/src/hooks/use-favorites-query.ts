
import { useQuery } from "@tanstack/react-query";
import { getFavorites } from "../api/favorites/get-favorites";

export function useFavoritesQuery() {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    staleTime: 5 * 60 * 1000,
  });
}
