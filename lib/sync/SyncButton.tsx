"use client";

import { useState, useEffect } from "react";
import {
  RefreshCw,
  Cloud,
  CloudOff,
  Check,
  AlertCircle,
  Server,
  WifiOff,
} from "lucide-react";
import { useBudgetStore } from "@/lib/store/budgetStoreSimple";
import {
  syncBudgetToServer,
  getLatestBudgetFromServer,
  checkServerStatus,
  checkApiEndpoints,
} from "@/lib/sync/api";

export function SyncButton() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<
    "checking" | "online" | "offline"
  >("checking");
  const [endpointsStatus, setEndpointsStatus] = useState<{
    health: boolean;
    auth: boolean;
    sync: boolean;
    latest: boolean;
  } | null>(null);

  const { budget, isOnline, setSyncStatus } = useBudgetStore();

  // Check server status on mount
  useEffect(() => {
    const checkStatus = async () => {
      setServerStatus("checking");
      const isAvailable = await checkServerStatus();
      setServerStatus(isAvailable ? "online" : "offline");

      // If server is online, check individual endpoints
      if (isAvailable) {
        const endpoints = await checkApiEndpoints();
        setEndpointsStatus(endpoints);
      }
    };

    checkStatus();

    // Check every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSync = async () => {
    if (!budget || !isOnline) return;

    setIsSyncing(true);
    setSyncError(null);

    try {
      // Push local data to server
      const response = await syncBudgetToServer(budget);

      if (response.success) {
        setSyncStatus("synced");
        setLastSyncTime(new Date());
        setServerStatus("online");

        // Update local store with server timestamp
        useBudgetStore.getState().setBudget({
          ...budget,
          syncedAt: response.timestamp
            ? new Date(response.timestamp)
            : new Date(),
          syncStatus: "synced",
        });

        // Re-check endpoints
        const endpoints = await checkApiEndpoints();
        setEndpointsStatus(endpoints);
      } else {
        throw new Error(response.error || "Sync failed");
      }
    } catch (error) {
      console.error("Sync error:", error);
      setSyncError(error instanceof Error ? error.message : "Sync failed");
      setSyncStatus("pending");
      setServerStatus("offline");
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePullLatest = async () => {
    if (!isOnline) return;

    setIsSyncing(true);
    try {
      const latest = await getLatestBudgetFromServer(budget?.userId);
      if (latest) {
        useBudgetStore.getState().setBudget(latest);
        setLastSyncTime(new Date());
        setSyncStatus("synced");
        setServerStatus("online");
      } else {
        setSyncError("No data received from server");
      }
    } catch (error) {
      console.error("Pull error:", error);
      setSyncError("Failed to fetch from server");
      setServerStatus("offline");
    } finally {
      setIsSyncing(false);
    }
  };

  const syncStatus = budget?.syncStatus || "local";

  const getStatusConfig = () => {
    switch (syncStatus) {
      case "local":
        return { color: "text-yellow-500", icon: CloudOff, text: "Local Only" };
      case "pending":
        return { color: "text-orange-500", icon: Cloud, text: "Sync Pending" };
      case "synced":
        return { color: "text-green-500", icon: Check, text: "Synced" };
      default:
        return { color: "text-gray-500", icon: Cloud, text: "Unknown" };
    }
  };

  const status = getStatusConfig();
  const Icon = status.icon;

  // Determine if sync is possible
  const canSync =
    isOnline &&
    budget &&
    serverStatus === "online" &&
    endpointsStatus?.sync !== false;

  return (
    <div className="flex flex-col gap-3">
      {/* Server Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`p-2 rounded-lg ${
              serverStatus === "online"
                ? "bg-green-500/10"
                : serverStatus === "offline"
                ? "bg-red-500/10"
                : "bg-gray-500/10"
            }`}
          >
            {serverStatus === "checking" ? (
              <RefreshCw className="w-4 h-4 text-gray-500 animate-spin" />
            ) : serverStatus === "online" ? (
              <Server className="w-4 h-4 text-green-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-500" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-white">Server Status</p>
            <p
              className={`text-xs ${
                serverStatus === "online"
                  ? "text-green-400"
                  : serverStatus === "offline"
                  ? "text-red-400"
                  : "text-gray-400"
              }`}
            >
              {serverStatus === "online"
                ? "Online"
                : serverStatus === "offline"
                ? "Offline"
                : "Checking..."}
            </p>
          </div>
        </div>

        {/* Endpoint Status Indicator */}
        {endpointsStatus && serverStatus === "online" && (
          <div className="flex gap-1">
            {Object.entries(endpointsStatus).map(([key, value]) => (
              <div
                key={key}
                title={`${key}: ${value ? "OK" : "Missing"}`}
                className={`w-2 h-2 rounded-full ${
                  value ? "bg-green-500" : "bg-red-500"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sync Status Display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`p-2 rounded-lg ${status.color.replace(
              "text-",
              "bg-"
            )}/10`}
          >
            <Icon className={`w-4 h-4 ${status.color}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Sync Status</p>
            <p className={`text-xs ${status.color}`}>{status.text}</p>
          </div>
        </div>

        {lastSyncTime && (
          <div className="text-right">
            <p className="text-xs text-gray-400">Last Sync</p>
            <p className="text-xs text-gray-300">
              {lastSyncTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        )}
      </div>

      {/* Error Display */}
      {syncError && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <p className="text-sm text-red-400">{syncError}</p>
        </div>
      )}

      {/* Sync Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleSync}
          disabled={isSyncing || !canSync}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          {isSyncing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <Cloud className="w-4 h-4" />
              Sync to Cloud
            </>
          )}
        </button>

        <button
          onClick={handlePullLatest}
          disabled={isSyncing || !isOnline || serverStatus !== "online"}
          className="px-4 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          title="Fetch latest from server"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Status Help Text */}
      <div className="text-xs text-gray-400 space-y-1">
        {!isOnline ? (
          <div className="flex items-center gap-1 text-yellow-500">
            <WifiOff className="w-3 h-3" />
            Offline - changes saved locally
          </div>
        ) : serverStatus === "offline" ? (
          <div className="flex items-center gap-1 text-red-400">
            <Server className="w-3 h-3" />
            Server unavailable - working offline
          </div>
        ) : endpointsStatus?.sync === false ? (
          <div className="flex items-center gap-1 text-orange-400">
            <AlertCircle className="w-3 h-3" />
            Sync endpoint missing - API incomplete
          </div>
        ) : syncStatus === "pending" ? (
          'You have unsynced changes. Click "Sync to Cloud" to save to server.'
        ) : syncStatus === "synced" ? (
          "All changes are synced with the cloud server."
        ) : (
          "This budget exists only on this device. Sync to access from other devices."
        )}

        {/* Debug info for developers */}
        {process.env.NODE_ENV === "development" && endpointsStatus && (
          <div className="mt-2 pt-2 border-t border-white/10 text-xs">
            <p className="text-gray-500 mb-1">API Endpoints:</p>
            <div className="grid grid-cols-2 gap-1">
              {Object.entries(endpointsStatus).map(([key, value]) => (
                <div key={key} className="flex items-center gap-1">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      value ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <span className="text-gray-400">{key}:</span>
                  <span className={value ? "text-green-400" : "text-red-400"}>
                    {value ? "✓" : "✗"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
