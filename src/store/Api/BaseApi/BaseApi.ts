import { logOut } from "@/store/features/AuthSlice/authSlice";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    return ("" + 1e7 + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        Number(c) ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))
      ).toString(16)
    );
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = localStorage.getItem("petnest_visitor_id");
  if (!id) {
    id = generateUUID();
    localStorage.setItem("petnest_visitor_id", id);
  }
  return id;
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  credentials: "include", // REQUIRED so browser sends & stores httpOnly cookies
  prepareHeaders: (headers) => {
    headers.set("x-visitor-id", getOrCreateVisitorId());
    if (typeof window !== "undefined") {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz) headers.set("x-timezone", tz);
      } catch {}

      const savedLang = localStorage.getItem("petnest_lang");
      if (savedLang) {
        headers.set("x-visitor-lang", savedLang);
      }
    }
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
    "Settings",
  ],
  endpoints: () => ({}),
});

export default baseApi;
