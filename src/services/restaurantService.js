import { request } from "./api.js";
const CITY_ID = import.meta.env.VITE_CITY_ID || 118;
export async function fetchRestaurants(token, page = 1) {
  const res = await request(
    `/v1/m/restaurant?city_id=${CITY_ID}&page=${page}`,
    { token },
  );
  const d = res.data || {};
  return {
    results: d.results || [],
    totalPages: (d.meta && d.meta.total_pages) || 1,
    totalCount: (d.meta && d.meta.total_count) || 0,
  };
}
