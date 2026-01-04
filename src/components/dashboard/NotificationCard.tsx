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
}: {
  notification: MyNotification;
}) => {
  const iconClassName = getIcon(notification.type);
  return (
    <div className="flex items-start space-x-3">
      <div className="bg-success-100 rounded-lg p-2">
        <i className={iconClassName}></i>
      </div>
      <div className="flex-1">
        <p className="text-secondary-900 text-md font-medium">
          {notification.title}
        </p>
        <p className="text-secondary-600 text-sm">{notification.description}</p>
        <p className="text-secondary-500 mt-1 text-sm">
          {timeAgo(notification.createdAt)}
        </p>
      </div>
    </div>
  );
};
export default NotificationCard;
