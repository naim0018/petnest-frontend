import { logOut } from "@/store/features/AuthSlice/authSlice";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = localStorage.getItem("petnest_visitor_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("petnest_visitor_id", id);
  }
  return id;
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000",
  credentials: "include", // REQUIRED so browser sends & stores httpOnly cookies
  prepareHeaders: (headers, { getState }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const token = (getState() as any)?.auth?.user?.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    headers.set("x-visitor-id", getOrCreateVisitorId());
    return headers;
  },
});

const AUTH_SKIP_REFRESH_URLS = new Set([
  "/auth/login",
  "/auth/register",
  "/auth/refresh-token",
  "/auth/logout",
]);

let refreshPromise: Promise<boolean> | null = null;

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);
  const reqUrl = typeof args === "string" ? args : args.url;

  if (
    result.error &&
    result.error.status === 401 &&
    !AUTH_SKIP_REFRESH_URLS.has(reqUrl)
  ) {
    // Deduplicate concurrent 401 refreshes
    if (!refreshPromise) {
      refreshPromise = (async () => {
        const refreshRes = await rawBaseQuery(
          { url: "/auth/refresh-token", method: "POST" },
          api,
          extraOptions
        );
        return !refreshRes.error;
      })().finally(() => {
        refreshPromise = null;
      });
    }

    const refreshed = await refreshPromise;
    if (refreshed) {
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Me",
    "Users",
    "Species",
    "Breeds",
    "GuideCategories",
    "Guides",
    "EditorialGuides",
    "EditorialStats",
    "GuideFaqs",
    "Bookmarks",
    "Media",
  ],
  endpoints: () => ({}),
});

export default baseApi;
