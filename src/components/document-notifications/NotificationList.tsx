import type { DocumentNotification } from "@/hooks/useDocumentNotifications";

interface NotificationListProps {
  notifications: DocumentNotification[];
  isLoading?: boolean;
  error?: string | null;
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
  stats?: {
    total: number;
    expired: number;
    expiring_today: number;
    expiring_soon: number;
    unread: number;
  };
  activeFilter?: "all" | "expired" | "expiring_today" | "expiring_soon" | "upcoming";
  onFilterChange?: (filter: "all" | "expired" | "expiring_today" | "expiring_soon" | "upcoming") => void;
}

const NotificationList = ({
  notifications,
  isLoading,
  error,
  onMarkAsRead,
  onMarkAllAsRead,
  stats,
  activeFilter = "all",
  onFilterChange,
}: NotificationListProps) => {
  // Get urgency color
  const getUrgencyColors = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          icon: "text-red-600",
          badge: "bg-red-100 text-red-800",
          dot: "bg-red-600",
        };
      case "high":
        return {
          bg: "bg-orange-50",
          border: "border-orange-200",
          icon: "text-orange-600",
          badge: "bg-orange-100 text-orange-800",
          dot: "bg-orange-600",
        };
      case "medium":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          icon: "text-yellow-600",
          badge: "bg-yellow-100 text-yellow-800",
          dot: "bg-yellow-600",
        };
      default:
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          icon: "text-blue-600",
          badge: "bg-blue-100 text-blue-800",
          dot: "bg-blue-600",
        };
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "expired":
        return "fas fa-exclamation-triangle";
      case "expiring_today":
        return "fas fa-clock";
      case "expiring_soon":
        return "fas fa-hourglass-half";
      default:
        return "fas fa-calendar";
    }
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

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-md rounded-lg border border-gray-200 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex flex-col items-center justify-center space-y-3 py-8">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
            <p className="text-sm text-gray-600">Loading notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-md rounded-lg border border-red-200 bg-red-50 shadow-lg">
        <div className="p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100">
              <i className="fas fa-exclamation-circle text-red-600"></i>
            </div>
            <div>
              <h3 className="font-medium text-red-900">Error Loading Notifications</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (notifications.length === 0) {
    return (
      <div className="max-w-md rounded-lg border border-gray-200 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex flex-col items-center justify-center space-y-3 py-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <i className="fas fa-check-circle text-2xl text-green-600"></i>
            </div>
            <h3 className="font-medium text-gray-900">All Caught Up!</h3>
            <p className="text-center text-sm text-gray-600">
              No upcoming document expirations. All your documents are current.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md rounded-lg border border-gray-200 bg-white shadow-lg">
      {/* Header */}
      <div className="border-b border-gray-100 px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">
            Document Notifications
          </h2>
          {stats && stats.unread > 0 && (
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-600 text-xs font-bold text-white">
              {stats.unread}
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="border-b border-gray-100 px-4 py-3 sm:px-6">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div
              className="cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => onFilterChange?.("all")}
            >
              <p className="text-lg font-semibold text-gray-900">
                {stats.total}
              </p>
              <p className="text-xs text-gray-600">Total</p>
            </div>
            <div
              className="cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => onFilterChange?.("expired")}
            >
              <p className="text-lg font-semibold text-red-600">
                {stats.expired}
              </p>
              <p className="text-xs text-gray-600">Expired</p>
            </div>
            <div
              className="cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => onFilterChange?.("expiring_today")}
            >
              <p className="text-lg font-semibold text-orange-600">
                {stats.expiring_today}
              </p>
              <p className="text-xs text-gray-600">Today</p>
            </div>
            <div
              className="cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => onFilterChange?.("expiring_soon")}
            >
              <p className="text-lg font-semibold text-yellow-600">
                {stats.expiring_soon}
              </p>
              <p className="text-xs text-gray-600">Soon</p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      {onFilterChange && (
        <div className="border-b border-gray-100 px-4 py-2 sm:px-6">
          <div className="flex gap-2 overflow-x-auto">
            {[
              { value: "all" as const, label: "All" },
              { value: "expired" as const, label: "Expired" },
              { value: "expiring_today" as const, label: "Today" },
              { value: "expiring_soon" as const, label: "Soon" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => onFilterChange(filter.value)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  activeFilter === filter.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.map((notification) => {
          const colors = getUrgencyColors(notification.urgency);
          return (
            <div
              key={notification.documentId}
              className={`border-b border-gray-100 p-4 sm:p-6 transition-all hover:bg-gray-50 cursor-pointer ${colors.bg} ${colors.border} border-l-4`}
              onClick={() =>
                notification.notificationId &&
                onMarkAsRead?.(notification.notificationId)
              }
            >
              <div className="flex items-start gap-3">
                {/* Status Icon */}
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white ${colors.icon}`}>
                  <i
                    className={`${getStatusIcon(notification.status)} text-lg`}
                  ></i>
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-gray-900">
                        {notification.documentTitle}
                      </p>
                      {notification.teacherName && (
                        <p className="text-xs text-gray-600">
                          Teacher:{" "}
                          <span className="font-medium">
                            {notification.teacherName}
                          </span>
                          {notification.teacherDepartment && (
                            <span> • {notification.teacherDepartment}</span>
                          )}
                        </p>
                      )}
                      <p className="text-xs text-gray-600">
                        Expires:{" "}
                        <span className="font-medium">
                          {formatDate(notification.expiryDate)}
                        </span>
                      </p>
                    </div>
                    <span
                      className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${colors.badge}`}
                    >
                      <span
                        className={`inline-block h-1.5 w-1.5 rounded-full ${colors.dot}`}
                      />
                      {getStatusLabel(notification.status)}
                    </span>
                  </div>

                  {/* Days and Action */}
                  <div className="mt-2 space-y-1">
                    <p className="text-sm font-medium text-gray-700">
                      {notification.daysRemaining < 0
                        ? `Overdue by ${Math.abs(notification.daysRemaining)} day(s)`
                        : notification.daysRemaining === 0
                          ? "Expires today"
                          : `${notification.daysRemaining} day(s) remaining`}
                    </p>
                    <p className="text-xs text-gray-600">
                      {notification.requiredAction}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {notifications.length > 0 && onMarkAllAsRead && (
        <div className="border-t border-gray-100 px-4 py-3 sm:px-6">
          <button
            onClick={onMarkAllAsRead}
            className="w-full rounded-lg bg-blue-50 px-4 py-2 text-center text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
          >
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
