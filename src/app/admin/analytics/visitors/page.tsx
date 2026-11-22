"use client";

import React, { useMemo } from "react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import { StatsCard } from "@/components/common/StatsCard";
import DynamicTable, { Column } from "@/components/common/DynamicTable";
import {
  Users,
  Eye,
  Activity,
  Globe2,
  Laptop,
  Smartphone,
  ShieldCheck,
  Compass,
  Copy,
  Check,
} from "lucide-react";
import VisitorGoogleMap from "./_components/VisitorGoogleMap";
import { useGetVisitorAnalyticsQuery } from "@/store/Api/Analytics/analytics.api";
import type {
  VisitorRecord,
  VisitorAnalyticsData,
} from "@/store/Api/Analytics/analytics.types";

function formatTimeAgo(isoString: string): string {
  try {
    const diff = Date.now() - new Date(isoString).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  } catch {
    return "Recent";
  }
}

export default function VisitorAnalyticsPage() {
  const { data: apiResponse, isLoading, error } = useGetVisitorAnalyticsQuery();
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const payload: VisitorAnalyticsData | null = useMemo(() => {
    const resData = (apiResponse as any)?.data || apiResponse;
    if (resData && resData.stats) {
      return {
        stats: resData.stats,
        geoDistribution: resData.geoDistribution || [],
        recentVisitors: resData.recentVisitors || [],
        topVisitedPaths: resData.topVisitedPaths || [],
        visitorTrend: resData.visitorTrend || [],
      };
    }
    return null;
  }, [apiResponse]);

  const handleCopy = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const columns: Column<VisitorRecord>[] = [
    {
      key: "id",
      label: "Visitor Identifier",
      sortable: true,
      width: "230px",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="font-mono text-xs font-semibold text-ink">
            {row.id.slice(0, 8)}...{row.id.slice(-4)}
          </div>
          <button
            type="button"
            onClick={(e) => handleCopy(row.id, e)}
            className="p-1 rounded hover:bg-surface-muted text-ink-muted hover:text-ink transition-colors cursor-pointer"
            title="Copy Visitor UUID"
          >
            {copiedId === row.id ? (
              <Check className="size-3.5 text-emerald-600" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </button>
          {row.user && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-tint-mint text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
              <ShieldCheck className="size-3" />
              <span>{row.user.role || "User"}</span>
            </span>
          )}
        </div>
      ),
    },
    {
      key: "location",
      label: "Geographic Location",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2 text-xs">
          <Globe2 className="size-3.5 text-coral shrink-0" />
          <div className="flex flex-col">
            <span className="font-bold text-ink">
              {row.country || "Bangladesh"}
            </span>
            <span className="text-[11px] text-ink-muted">
              {row.city ? `${row.city} • ` : ""}
              {row.timezone || "Asia/Dhaka"}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "device",
      label: "Device & Browser",
      sortable: true,
      render: (row) => {
        const isMobile = row.deviceType?.toLowerCase().includes("mobile");
        const Icon = isMobile ? Smartphone : Laptop;
        return (
          <div className="flex items-center gap-2 text-xs">
            <Icon className="size-3.5 text-ink-muted shrink-0" />
            <div className="flex flex-col">
              <span className="font-semibold text-ink">{row.browser}</span>
              <span className="text-[11px] text-ink-muted">{row.os}</span>
            </div>
          </div>
        );
      },
    },
    {
      key: "totalVisits",
      label: "Visits",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-tint-rose text-coral border border-coral/20 font-mono">
          {row.totalVisits.toLocaleString()} {row.totalVisits === 1 ? "session" : "sessions"}
        </span>
      ),
    },
    {
      key: "recentPath",
      label: "Last Visited Page",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs">
          <Compass className="size-3.5 text-ink-muted shrink-0" />
          <span
            className="font-mono text-ink-muted hover:text-coral transition-colors truncate max-w-[200px]"
            title={row.recentPath}
          >
            {row.recentPath || "/"}
          </span>
        </div>
      ),
    },
    {
      key: "maskedIp",
      label: "IP Address",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="font-mono text-xs text-ink-muted">
          {row.maskedIp}
        </span>
      ),
    },
    {
      key: "lastSeenAt",
      label: "Last Active",
      sortable: true,
      align: "right",
      render: (row) => (
        <div className="flex flex-col text-right">
          <span className="text-xs font-semibold text-ink">
            {formatTimeAgo(row.lastSeenAt)}
          </span>
          <span className="text-[10px] text-ink-muted">
            {new Date(row.lastSeenAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full space-y-6">
      {isLoading && (
        <div className="w-full p-12 text-center text-ink-muted flex flex-col items-center justify-center gap-3 bg-card rounded-lg border border-border">
          <div className="size-8 border-2 border-coral border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold">Loading real-time visitor database telemetry...</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm font-semibold">
          Failed to load real-time visitor telemetry. Please ensure the backend is running.
        </div>
      )}

      {payload && (
        <>
          {/* Stats Cards Row */}
          <AnimatedContainer delay={0.1}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              <StatsCard
                title="Total Unique Visitors"
                value={payload.stats.totalVisitors.toLocaleString()}
                trendText="Logged in database"
                trendType="positive"
                icon={<Users className="size-5" />}
              />
              <StatsCard
                title="Active Visitors (24h)"
                value={payload.stats.activeVisitors24h.toLocaleString()}
                trendText="Active readers today"
                trendType="positive"
                icon={<Activity className="size-5" />}
              />
              <StatsCard
                title="Total Pageviews Logged"
                value={payload.stats.totalPageViews.toLocaleString()}
                trendText="Cumulative page hits"
                trendType="positive"
                icon={<Eye className="size-5" />}
              />
              <StatsCard
                title="Avg. Visits / Visitor"
                value={`${payload.stats.avgVisitsPerUser}x`}
                trendText="Average session depth"
                trendType="positive"
                icon={<Globe2 className="size-5" />}
              />
            </div>
          </AnimatedContainer>

          {/* Live Google Maps Geolocation Visual (Developer Version) */}
          <AnimatedContainer delay={0.2}>
            <VisitorGoogleMap
              distribution={payload.geoDistribution}
              totalVisitors={payload.stats.totalVisitors}
            />
          </AnimatedContainer>

          {/* Visitor Session Information Table */}
          <AnimatedContainer delay={0.3}>
            <div className="w-full">
              <DynamicTable
                data={payload.recentVisitors}
                columns={columns}
                searchable
                searchPlaceholder="Search by Visitor UUID, IP, Country, or Page Path..."
                title="Recent Visitor Sessions & Page Hits"
                hoverable
              />
            </div>
          </AnimatedContainer>
        </>
      )}
    </div>
  );
}
