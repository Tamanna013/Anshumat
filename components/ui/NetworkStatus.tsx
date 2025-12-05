"use client";

import { useEffect, useState } from "react";
import { Wifi, WifiOff, Cloud, CloudOff, Save } from "lucide-react";
import { useBudgetStore } from "@/lib/store/budgetStoreSimple";

export function NetworkStatus() {
  // ALWAYS call hooks unconditionally at the top
  const syncStatus = useBudgetStore((state) => state.syncStatus);
  const lastSaved = useBudgetStore((state) => state.lastSaved);
  const isOnline = useBudgetStore((state) => state.isOnline);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render on server, but hooks are still called
  if (!isMounted) {
    return null;
  }

  const syncStatusConfig = {
    local: {
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
      icon: CloudOff,
      text: "Local Only",
    },
    pending: {
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      icon: Cloud,
      text: "Sync Pending",
    },
    synced: {
      color: "text-green-500",
      bg: "bg-green-500/10",
      icon: Cloud,
      text: "Synced",
    },
  };

  const status = syncStatusConfig[syncStatus];

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
      {/* Network Status */}
      <div
        className={`glass-card flex items-center gap-2 px-3 py-2 ${
          isOnline ? "bg-green-500/10" : "bg-red-500/10"
        }`}
      >
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-400">Online</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-400">Offline</span>
          </>
        )}
      </div>

      {/* Sync Status */}
      <div
        className={`glass-card flex items-center gap-2 px-3 py-2 ${status.bg}`}
      >
        <status.icon className={`w-4 h-4 ${status.color}`} />
        <span className={`text-sm ${status.color}`}>{status.text}</span>
      </div>

      {/* Last Saved */}
      {lastSaved && (
        <div className="glass-card flex items-center gap-2 px-3 py-2 bg-blue-500/10">
          <Save className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-blue-400">
            {new Date(lastSaved).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      )}
    </div>
  );
}
