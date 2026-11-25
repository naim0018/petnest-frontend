"use client";

import React, { useEffect, useRef, useState } from "react";
import { Globe2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GeoDistribution } from "@/store/Api/Analytics/analytics.types";

interface VisitorGoogleMapProps {
  distribution: GeoDistribution[];
  totalVisitors: number;
}

export default function VisitorGoogleMap({
  distribution,
  totalVisitors,
}: VisitorGoogleMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ marker: any; halo: any; item: GeoDistribution }[]>([]);
  const infoWindowRef = useRef<any>(null);

  const [activeItem, setActiveItem] = useState<GeoDistribution | null>(
    distribution[0] || null
  );
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    function initMap() {
      if (!isMounted || !mapContainerRef.current || !(window as any).google?.maps) return;

      try {
        const defaultCenter =
          distribution.length > 0
            ? { lat: distribution[0].lat, lng: distribution[0].lng }
            : { lat: 23.8103, lng: 90.4125 };

        const map = new (window as any).google.maps.Map(mapContainerRef.current, {
          center: defaultCenter,
          zoom: distribution.length > 1 ? 4 : 7,
          mapTypeId: "roadmap",
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          gestureHandling: "cooperative",
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        });

        mapInstanceRef.current = map;
        infoWindowRef.current = new (window as any).google.maps.InfoWindow();

        // Clear previous markers & halos
        markersRef.current.forEach((m) => {
          m?.marker?.setMap(null);
          m?.halo?.setMap(null);
        });
        markersRef.current = [];

        const bounds = new (window as any).google.maps.LatLngBounds();

        distribution.forEach((item) => {
          const pos = { lat: item.lat, lng: item.lng };
          bounds.extend(pos);

          const locationLabel = item.city
            ? `${item.city}, ${item.country}`
            : item.country;

          // 1. Radar Halo (Pulsing glowing circle around visitor dot)
          const halo = new (window as any).google.maps.Circle({
            map,
            center: pos,
            radius: Math.min(50000, Math.max(18000, item.visitors * 2000)),
            strokeColor: "#FF5A5F",
            strokeOpacity: 0.45,
            strokeWeight: 1.5,
            fillColor: "#FF5A5F",
            fillOpacity: 0.15,
          });

          // 2. Modern SVG Visitor Dot (Replaces legacy drop pin)
          const marker = new (window as any).google.maps.Marker({
            position: pos,
            map,
            title: locationLabel,
            icon: {
              path: (window as any).google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#FF5A5F",
              fillOpacity: 1,
              strokeColor: "#FFFFFF",
              strokeWeight: 2.5,
            },
          });

          const openInfo = () => {
            setActiveItem(item);
            const contentString = `
              <div style="padding: 6px 10px; font-family: system-ui, -apple-system, sans-serif; color: #0f172a; min-width: 170px;">
                <div style="font-weight: 700; font-size: 13px; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
                  <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #FF5A5F;"></span>
                  <span>${locationLabel}</span>
                </div>
                <div style="font-size: 11px; color: #64748b; line-height: 1.5;">
                  <div><strong>${item.visitors.toLocaleString()}</strong> unique visitors</div>
                  <div><strong>${item.totalVisits.toLocaleString()}</strong> sessions (${item.share})</div>
                </div>
              </div>
            `;
            infoWindowRef.current.setContent(contentString);
            infoWindowRef.current.open(map, marker);
          };

          marker.addListener("click", openInfo);

          markersRef.current.push({ marker, halo, item });
        });

        if (distribution.length > 1) {
          map.fitBounds(bounds, { top: 40, bottom: 40, left: 40, right: 40 });
        } else if (distribution.length === 1) {
          map.setCenter(defaultCenter);
          map.setZoom(7);
        }

        setMapLoaded(true);
      } catch (err: any) {
        if (isMounted) {
          setMapError(err?.message || "Failed to initialize Google Maps");
        }
      }
    }

    if ((window as any).google?.maps) {
      initMap();
      return;
    }

    const scriptId = "google-maps-js-sdk";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (isMounted) initMap();
      };
      script.onerror = () => {
        if (isMounted) setMapError("Google Maps script failed to load");
      };
      document.head.appendChild(script);
    } else {
      script.addEventListener("load", initMap);
    }

    return () => {
      isMounted = false;
      markersRef.current.forEach((m) => {
        m?.marker?.setMap(null);
        m?.halo?.setMap(null);
      });
      markersRef.current = [];
    };
  }, [distribution]);

  const handleSelectLocation = (item: GeoDistribution) => {
    setActiveItem(item);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo({ lat: item.lat, lng: item.lng });
      mapInstanceRef.current.setZoom(8);

      const targetMarker = markersRef.current.find(
        (m) => m.item.country === item.country && m.item.city === item.city
      );
      if (targetMarker && infoWindowRef.current) {
        const locationLabel = item.city
          ? `${item.city}, ${item.country}`
          : item.country;
        const contentString = `
          <div style="padding: 6px 10px; font-family: system-ui, -apple-system, sans-serif; color: #0f172a; min-width: 170px;">
            <div style="font-weight: 700; font-size: 13px; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #FF5A5F;"></span>
              <span>${locationLabel}</span>
            </div>
            <div style="font-size: 11px; color: #64748b; line-height: 1.5;">
              <div><strong>${item.visitors.toLocaleString()}</strong> unique visitors</div>
              <div><strong>${item.totalVisits.toLocaleString()}</strong> sessions (${item.share})</div>
            </div>
          </div>
        `;
        infoWindowRef.current.setContent(contentString);
        infoWindowRef.current.open(mapInstanceRef.current, targetMarker.marker);
      }
    }
  };

  const handleResetView = () => {
    if (!mapInstanceRef.current || distribution.length === 0) return;
    if (distribution.length > 1) {
      const bounds = new (window as any).google.maps.LatLngBounds();
      distribution.forEach((item) =>
        bounds.extend({ lat: item.lat, lng: item.lng })
      );
      mapInstanceRef.current.fitBounds(bounds, {
        top: 40,
        bottom: 40,
        left: 40,
        right: 40,
      });
    } else {
      mapInstanceRef.current.setCenter({
        lat: distribution[0].lat,
        lng: distribution[0].lng,
      });
      mapInstanceRef.current.setZoom(7);
    }
  };

  return (
    <div className="bg-card text-card-foreground border border-border-peach rounded-lg p-5 sm:p-6 shadow-xs space-y-5 w-full">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <Globe2 className="size-5 text-coral" />
            <h3 className="text-base sm:text-lg font-bold font-quicksand text-ink">
              Live Google Maps Visitor Geolocation
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
            Geolocated visitor footprint rendered via Google Maps
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetView}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-surface-muted hover:bg-card border border-border text-ink-muted hover:text-ink transition-colors cursor-pointer"
            title="Reset Google Map View"
          >
            <RefreshCw className="size-3.5" />
            <span>Reset View</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-tint-mint text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 select-none">
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full size-2 bg-emerald-600" />
            </span>
            <span>Google Maps Developer Mode</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Google Maps + Location Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
        {/* Google Maps Canvas Container */}
        <div className="lg:col-span-8 relative w-full h-[380px] sm:h-[440px] rounded-lg border border-border overflow-hidden bg-surface-muted/40 shadow-inner">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Loading Overlay */}
          {!mapLoaded && !mapError && (
            <div className="absolute inset-0 bg-card/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2.5 z-10 text-xs font-semibold text-ink-muted">
              <div className="size-6 border-2 border-coral border-t-transparent rounded-full animate-spin" />
              <span>Loading Google Maps...</span>
            </div>
          )}

          {/* Error Message */}
          {mapError && (
            <div className="absolute inset-0 bg-card/90 flex flex-col items-center justify-center gap-2 p-4 text-center z-10">
              <p className="text-xs font-semibold text-destructive">{mapError}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="text-xs px-3 py-1 rounded bg-coral text-white font-bold"
              >
                Reload
              </button>
            </div>
          )}
        </div>

        {/* Real Location Ranking Panel */}
        <div className="lg:col-span-4 space-y-3 w-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink uppercase tracking-wider">
              Identified Geographic Origins
            </span>
            <span className="text-xs text-ink-muted font-mono">
              {totalVisitors.toLocaleString()} total
            </span>
          </div>

          <div className="space-y-2 max-h-[380px] sm:max-h-[440px] overflow-y-auto pr-1 w-full">
            {distribution.length === 0 ? (
              <div className="p-4 rounded-lg bg-surface-muted text-xs text-ink-muted text-center">
                No geographic origin data recorded yet.
              </div>
            ) : (
              distribution.map((item, idx) => {
                const isSelected =
                  activeItem?.country === item.country &&
                  activeItem?.city === item.city;
                const numericShare = parseInt(item.share) || 10;
                const displayLabel = item.city
                  ? `${item.city}, ${item.country}`
                  : item.country;

                return (
                  <div
                    key={`${item.country}-${item.city || idx}`}
                    onClick={() => handleSelectLocation(item)}
                    className={cn(
                      "p-3 rounded-lg border transition-all cursor-pointer flex flex-col gap-2 w-full",
                      isSelected
                        ? "bg-coral/10 border-coral text-ink shadow-xs"
                        : "bg-surface-muted/50 border-border hover:border-coral/40 text-ink-muted hover:text-ink"
                    )}
                  >
                    <div className="flex items-center justify-between text-xs w-full">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-[10px] size-5 rounded-full bg-card border border-border flex items-center justify-center font-bold text-ink shrink-0">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-ink truncate">
                          {displayLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[11px] shrink-0">
                        <span className="font-bold text-ink">
                          {item.visitors.toLocaleString()}
                        </span>
                        <span className="font-bold text-coral">{item.share}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          isSelected ? "bg-coral" : "bg-coral/70"
                        )}
                        style={{
                          width: `${Math.min(100, Math.max(8, numericShare))}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
