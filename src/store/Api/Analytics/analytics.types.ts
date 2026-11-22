export interface VisitorRecord {
  id: string;
  ipAddress: string;
  maskedIp: string;
  country: string;
  city: string;
  timezone: string;
  browser: string;
  os: string;
  deviceType: string;
  totalVisits: number;
  firstSeenAt: string;
  lastSeenAt: string;
  recentPath?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

export interface GeoDistribution {
  country: string;
  city?: string;
  code: string;
  visitors: number;
  totalVisits: number;
  share: string;
  lat: number;
  lng: number;
}

export interface VisitorAnalyticsData {
  stats: {
    totalVisitors: number;
    activeVisitors24h: number;
    totalPageViews: number;
    avgVisitsPerUser: number;
    registeredLinkedCount: number;
  };
  geoDistribution: GeoDistribution[];
  recentVisitors: VisitorRecord[];
  topVisitedPaths: { path: string; count: number }[];
  visitorTrend: { label: string; visitors: number; pageViews: number }[];
}

export interface VisitorAnalyticsResponse {
  success?: boolean;
  statusCode?: number;
  data?: VisitorAnalyticsData;
}
