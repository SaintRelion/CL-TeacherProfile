import type { MyNotification } from "@/models/MyNotification";
import { timeAgo } from "@saintrelion/time-functions";

function getIcon(type: string) {
  if (type == "profileNew") return "fas fa-user-plus text-success-600";
  else if (type == "upload") return "fas fa-file-upload text-primary-600";
  else if (type == "profileUpdate") return "fas fa-edit text-orange-500";
  else if (type == "expiring")
    return "fas fa-exclamation-triangle text-warning-600";
  else if (type == "expired") return "fas fa-radiation text-red-600";
  else return "";
}

const NotificationCard = ({
  notification,
  isRead = false,
}: {
  notification: MyNotification;
  isRead?: boolean;
}) => {
  const iconClassName = getIcon(notification.type);
  return (
    <div className={`flex items-start space-x-3 ${isRead ? "opacity-60" : ""}`}>
      <div className={`rounded-lg p-2 ${isRead ? "bg-slate-100" : "bg-success-100"}`}>
        <i className={iconClassName}></i>
      </div>
      <div className="flex-1">
        <p className={`text-md font-medium ${isRead ? "text-secondary-600" : "text-secondary-900"}`}>
          {notification.title}
        </p>
        <p className={`text-sm ${isRead ? "text-secondary-500" : "text-secondary-600"}`}>
          {notification.description}
        </p>
        <p className="text-secondary-500 mt-1 text-sm">
          {timeAgo(notification.createdAt)}
        </p>
      </div>
      {!isRead && (
        <div className="bg-accent-500 mt-1 h-2 w-2 rounded-full flex-shrink-0"></div>
      )}
    </div>
  );
};
export default NotificationCard;
