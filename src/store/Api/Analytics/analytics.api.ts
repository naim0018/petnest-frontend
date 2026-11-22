import baseApi from "../BaseApi/BaseApi";
import type { VisitorAnalyticsData } from "./analytics.types";

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVisitorAnalytics: builder.query<{ success: boolean; statusCode: number; data: VisitorAnalyticsData } | VisitorAnalyticsData, void>({
      query: () => "/analytics/visitors",
      providesTags: ["Analytics" as any],
    }),
  }),
});

export const { useGetVisitorAnalyticsQuery } = analyticsApi;
