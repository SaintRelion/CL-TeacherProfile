import type { Notification } from "@/models/Notification";
import { timeAgo } from "@saintrelion/time-functions";

function getIcon(type: string) {
  if (type == "profileNew") return "fas fa-user-plus text-blue-600";
  else if (type == "upload") return "fas fa-file-upload text-blue-600";
  else if (type == "profileUpdate") return "fas fa-edit text-yellow-600";
  else if (type == "expiring")
    return "fas fa-exclamation-triangle text-yellow-600";
  else if (type == "expired") return "fas fa-radiation text-red-600";
  else return "";
}

const NotificationCard = ({
  notification,
  isRead = false,
}: {
  notification: Notification;
  isRead?: boolean;
}) => {
  const iconClassName = getIcon(notification.type);
  return (
    <div className={`flex items-start space-x-3 ${isRead ? "opacity-60" : ""}`}>
      <div className={`rounded-lg p-2 ${isRead ? "bg-gray-100" : "bg-blue-100"}`}>
        <i className={iconClassName}></i>
      </div>
      <div className="flex-1">
        <p className={`text-md font-medium ${isRead ? "text-gray-600" : "text-gray-900"}`}>
          {notification.title}
        </p>
        <p className={`text-sm ${isRead ? "text-gray-500" : "text-gray-600"}`}>
          {notification.description}
        </p>
        <p className="text-gray-500 mt-1 text-sm">
          {timeAgo(notification.created_at)}
        </p>
      </div>
      {!isRead && (
        <div className="bg-yellow-500 mt-1 h-2 w-2 rounded-full shrink-0"></div>
      )}
    </div>
  );
};
export default NotificationCard;
