import type { Notification } from "@/models/Notification";
import { timeAgo } from "@saintrelion/time-functions";

// ─── Helpers ────────────────────────────────────────────────────────────────

function getIcon(type: string) {
  if (type === "profileNew") return "fas fa-user-plus text-blue-600";
  if (type === "upload") return "fas fa-file-upload text-blue-600";
  if (type === "profileUpdate") return "fas fa-edit text-yellow-600";
  if (type === "expiring") return "fas fa-exclamation-triangle text-yellow-600";
  if (type === "expired") return "fas fa-radiation text-red-600";
  return "fas fa-bell text-gray-500";
}

// ─── NotificationCard ────────────────────────────────────────────────────────

const NotificationCard = ({
  notification,
  isRead = false,
}: {
  notification: Notification;
  isRead?: boolean;
}) => {
  const iconClassName = getIcon(notification.type);

  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
        isRead ? "opacity-70" : ""
      }`}
    >
      <div
        className={`h-8 w-8 shrink-0 rounded-lg ${
          isRead ? "bg-gray-100" : "bg-blue-50"
        } flex items-center justify-center`}
      >
        <i className={`${iconClassName} text-sm`} />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm font-medium ${
            isRead ? "text-gray-700" : "text-gray-900"
          }`}
        >
          {notification.title}
        </p>
        <p className="truncate text-xs text-gray-500">
          {notification.description}
        </p>
        <p className="text-xs text-gray-400">{timeAgo(notification.created_at)}</p>
      </div>
      {!isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-yellow-500" />}
    </div>
  );
};

// ─── NotificationPanel ───────────────────────────────────────────────────────

interface NotificationPanelProps {
  notifications?: Notification[];
  readIds?: Set<string>;
}

const NotificationPanel = ({
  notifications = [],
  readIds,
}: NotificationPanelProps) => {
  const unread = notifications.filter((n) => {
    if (readIds) return !readIds.has(n.id);
    return !(n as any).is_read;
  });

  return (
    // This wrapper enforces its own size — parent cannot stretch it
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "360px",      // fixed height — never grows
        minHeight: 0,
        overflow: "hidden",   // clips anything that tries to escape
      }}
    >
      {/* Header — pinned, never scrolls */}
      <div
        style={{ flexShrink: 0 }}
        className="flex items-center justify-between px-3 py-2 border-b border-gray-100"
      >
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Unread
        </span>
        {unread.length > 0 && (
          <span className="text-xs bg-yellow-100 text-yellow-700 font-medium px-1.5 py-0.5 rounded-full">
            {unread.length} new
          </span>
        )}
      </div>

      {/* Scrollable area — takes remaining height, scrolls within it */}
      <div
        style={{
          flex: 1,
          minHeight: 0,       // critical: lets flex child shrink below content size
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {unread.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">
            You're all caught up!
          </p>
        ) : (
          <div className="flex flex-col py-1">
            {unread.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export { NotificationPanel };
export default NotificationCard;
