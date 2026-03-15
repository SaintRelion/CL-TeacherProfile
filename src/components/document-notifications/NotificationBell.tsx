interface NotificationBellProps {
  unreadCount: number;
  isLoading?: boolean;
  hasError?: boolean;
  onClick?: () => void;
  className?: string;
}

const NotificationBell = ({
  unreadCount,
  isLoading,
  hasError,
  onClick,
  className = "",
}: NotificationBellProps) => {
  // Determine icon color based on state
  const getIconColor = () => {
    if (hasError) return "text-red-600";
    if (isLoading) return "text-gray-400";
    if (unreadCount > 0) return "text-yellow-600";
    return "text-gray-500";
  };

  // Determine badge color based on urgency
  const getBadgeColor = () => {
    if (unreadCount > 5) return "bg-red-600";
    if (unreadCount > 2) return "bg-orange-600";
    return "bg-yellow-600";
  };

  return (
    <button
      onClick={onClick}
      className={`relative inline-flex items-center justify-center h-10 w-10 rounded-lg hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
      title={
        unreadCount > 0
          ? `${unreadCount} notification${unreadCount !== 1 ? "s" : ""}`
          : "No new notifications"
      }
      aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
    >
      {/* Bell Icon */}
      <svg
        className={`h-6 w-6 transition-all ${getIconColor()} ${isLoading ? "animate-pulse" : ""}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>

      {/* Badge */}
      {unreadCount > 0 && (
        <span
          className={`absolute top-1 right-1 inline-flex items-center justify-center h-5 w-5 px-1.5 py-0.5 text-xs font-bold text-white rounded-full ${getBadgeColor()} animate-pulse`}
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}

      {/* Error indicator */}
      {hasError && (
        <span
          className="absolute top-0 right-0 h-2 w-2 bg-red-600 rounded-full animate-pulse"
          title="Error loading notifications"
        />
      )}
    </button>
  );
};

export default NotificationBell;
