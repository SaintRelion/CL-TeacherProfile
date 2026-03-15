import { useState } from "react";
import { useCurrentUser } from "@saintrelion/auth-lib";
import type { User } from "@/models/user";
import { useDocumentNotifications, type UseDocumentNotificationsOptions } from "@/hooks/useDocumentNotifications";

interface DocumentNotificationsPageProps {
  options?: UseDocumentNotificationsOptions;
}

const DocumentNotificationsPage = ({
  options,
}: DocumentNotificationsPageProps) => {
  const user = useCurrentUser<User>();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Determine if user is admin
  const isAdmin = user?.roles?.includes("admin") ?? false;

  const {
    notifications,
    stats,
    isLoading,
    error,
    activeFilter,
    setActiveFilter,
    markAsRead,
    markAllAsRead,
    refetch,
    lastRefresh,
  } = useDocumentNotifications(user?.id ?? "", {
    ...options,
    isAdmin, // Pass admin flag to show all teachers' documents
  });

  if (!user?.id) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <p className="text-sm text-red-700">Unable to load notifications</p>
      </div>
    );
  }

  // Get urgency colors
  const getUrgencyColors = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "ring-red-200 bg-red-50";
      case "high":
        return "ring-orange-200 bg-orange-50";
      case "medium":
        return "ring-yellow-200 bg-yellow-50";
      default:
        return "ring-blue-200 bg-blue-50";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "expired":
        return "Expired";
      case "expiring_today":
        return "Due Today";
      case "expiring_soon":
        return "Expiring Soon";
      default:
        return "Upcoming";
    }
  };

  // Get status colors
  const getStatusColors = (status: string) => {
    switch (status) {
      case "expired":
        return "bg-red-100 text-red-800";
      case "expiring_today":
        return "bg-orange-100 text-orange-800";
      case "expiring_soon":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Document Notifications
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your upcoming and expired document renewals
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refetch}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            title={`Last refreshed: ${lastRefresh.toLocaleTimeString()}`}
          >
            <i className="fas fa-sync-alt mr-2"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-600">Total Notifications</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {stats.total}
          </p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 shadow-sm">
          <p className="text-xs text-red-700">Expired</p>
          <p className="mt-2 text-2xl font-bold text-red-600">
            {stats.expired}
          </p>
        </div>
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 shadow-sm">
          <p className="text-xs text-orange-700">Due Today</p>
          <p className="mt-2 text-2xl font-bold text-orange-600">
            {stats.expiring_today}
          </p>
        </div>
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 shadow-sm">
          <p className="text-xs text-yellow-700">Expiring Soon</p>
          <p className="mt-2 text-2xl font-bold text-yellow-600">
            {stats.expiring_soon}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2 overflow-x-auto">
            {[
              { value: "all" as const, label: "All", count: stats.total },
              {
                value: "expired" as const,
                label: "Expired",
                count: stats.expired,
              },
              {
                value: "expiring_today" as const,
                label: "Due Today",
                count: stats.expiring_today,
              },
              {
                value: "expiring_soon" as const,
                label: "Expiring Soon",
                count: stats.expiring_soon,
              },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  activeFilter === filter.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter.label}
                <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/30 text-xs">
                  {filter.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
              className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <i
                className={`fas fa-${viewMode === "list" ? "grip" : "list"}`}
              ></i>
            </button>
            {stats.unread > 0 && (
              <button
                onClick={markAllAsRead}
                className="rounded-lg bg-green-100 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-200 transition-colors"
              >
                <i className="fas fa-check mr-1"></i>
                Mark all read
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="rounded-lg border border-gray-200 bg-white p-12">
          <div className="flex flex-col items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
            <p className="mt-4 text-sm text-gray-600">
              Loading notifications...
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100">
              <i className="fas fa-exclamation-circle text-red-600"></i>
            </div>
            <div>
              <h3 className="font-medium text-red-900">
                Error Loading Notifications
              </h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && notifications.length === 0 && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <i className="fas fa-check-circle text-2xl text-green-600"></i>
            </div>
            <h3 className="mt-4 font-medium text-green-900">
              All Caught Up!
            </h3>
            <p className="mt-1 text-sm text-green-700">
              No upcoming document expirations. All your documents are current.
            </p>
          </div>
        </div>
      )}

      {/* Notifications List View */}
      {!isLoading && !error && viewMode === "list" && notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.documentId}
              className={`rounded-lg border-l-4 border-gray-200 p-4 shadow-sm transition-all hover:shadow-md ${getUrgencyColors(notification.urgency)}`}
              onClick={() =>
                notification.notificationId &&
                markAsRead(notification.notificationId)
              }
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-medium text-gray-900">
                    {notification.documentTitle}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {notification.requiredAction}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    Expires: {formatDate(notification.expiryDate)}
                  </p>
                </div>

                <div className="shrink-0 space-y-2 text-right">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusColors(notification.status)}`}
                  >
                    {getStatusLabel(notification.status)}
                  </span>
                  <p className="text-sm font-semibold text-gray-900">
                    {notification.daysRemaining < 0
                      ? `${Math.abs(notification.daysRemaining)}d overdue`
                      : notification.daysRemaining === 0
                        ? "Today"
                        : `${notification.daysRemaining}d left`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notifications Grid View */}
      {!isLoading && !error && viewMode === "grid" && notifications.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notifications.map((notification) => (
            <div
              key={notification.documentId}
              className={`rounded-lg border-l-4 border-gray-200 p-4 shadow-sm transition-all hover:shadow-md ${getUrgencyColors(notification.urgency)}`}
              onClick={() =>
                notification.notificationId &&
                markAsRead(notification.notificationId)
              }
            >
              <div className="space-y-3">
                <div>
                  <h3 className="line-clamp-2 font-medium text-gray-900">
                    {notification.documentTitle}
                  </h3>
                  <span
                    className={`mt-2 inline-block rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColors(notification.status)}`}
                  >
                    {getStatusLabel(notification.status)}
                  </span>
                </div>

                <div className="border-t border-gray-200/50 pt-3">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-gray-600">Expires</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(notification.expiryDate)}
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {notification.daysRemaining < 0
                        ? `${Math.abs(notification.daysRemaining)}d`
                        : `${notification.daysRemaining}d`}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-gray-600">
                  {notification.requiredAction}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentNotificationsPage;
