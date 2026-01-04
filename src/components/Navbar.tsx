import { useAuth } from "@saintrelion/auth-lib";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { logout } from "@saintrelion/auth-lib/dist/FirebaseAuth";
import type { PersonalInformation } from "@/models/PersonalInformation";
import { useDBOperationsLocked } from "@saintrelion/data-access-layer";
import { getExpiryState, resolveImageSource } from "@/lib/utils";
import { NO_FACE_IMAGE } from "@/constants";
import NotificationCard from "./dashboard/NotificationCard";
import type { MyNotification } from "@/models/MyNotification";
import type { TeacherDocument } from "@/models/TeacherDocument";
import { useEffect, useMemo, useState } from "react";
import { toDate } from "@saintrelion/time-functions";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { useSelect: informationSelect } =
    useDBOperationsLocked<PersonalInformation>("PersonalInformation");

  const { data: informations } = informationSelect({
    firebaseOptions:
      user.role == "admin" ? {} : { filterField: "userId", value: user.id },
  });

  const myInformation = informations != null ? informations[0] : undefined;

  const {
    useSelect: notificationSelect,
    useInsert: notificationInsert,
    useUpdate: notificationUpdate,
  } = useDBOperationsLocked<MyNotification>("MyNotification");

  const { data: notifications } = notificationSelect({
    firebaseOptions:
      user.role == "admin"
        ? {}
        : {
            filterField: "userId",
            value: user.id,
          },
  });
  const sortedNotifications = useMemo(() => {
    if (!notifications) return [];

    return [...notifications].sort((a, b) => {
      const aDate = toDate(a.createdAt);
      const bDate = toDate(b.createdAt);

      if (aDate != null && bDate != null) {
        const aTime = aDate.getTime() ?? 0;
        const bTime = bDate.getTime() ?? 0;

        return bTime - aTime; // newest first
      }

      return -1;
    });
  }, [notifications]);

  const existingDescriptions = new Set(
    sortedNotifications?.map((n) => n.description) ?? [],
  );

  const { useSelect: documentSelect } =
    useDBOperationsLocked<TeacherDocument>("TeacherDocument");

  const { data: documents } = documentSelect({
    firebaseOptions: {
      filterField: "userId",
      value: user.id,
    },
  });

  // --- Placing Document Expiry Notifs here for now
  useEffect(() => {
    if (!myInformation || !documents || !notifications || user.role == "admin")
      return; // Don't run this for admin

    const run = async () => {
      for (const doc of documents) {
        const status = getExpiryState(doc.expiryDate);

        if (status !== "expiring" && status !== "expired") continue;

        const description = `${myInformation.firstName} ${myInformation.middleName} ${myInformation.lastName} - ${doc.documentTitle}`;

        // 🔒 DUPLICATE CHECK
        if (existingDescriptions.has(description)) continue;

        await notificationInsert.run({
          userId: user.id,
          type: status,
          title: `${doc.documentType} ${status}`,
          description,
        });
      }
    };

    run();
  }, [documents]);

  const profilePic =
    myInformation != undefined ? myInformation.photoBase64 : NO_FACE_IMAGE;

  // Count only unread notifications
  const unreadNotifications = useMemo(() => {
    if (!notifications) return [];
    return notifications.filter((n) => !n.isRead);
  }, [notifications]);

  // Mark all notifications as read when dropdown opens
  const handleNotificationOpen = async (isOpen: boolean) => {
    if (isOpen && unreadNotifications.length > 0) {
      for (const notification of unreadNotifications) {
        await notificationUpdate.run({ ...notification, isRead: true });
      }
    }
  };

  return (
    <header className="bg-primary-800 sticky top-0 z-50 text-white shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-accent-500 rounded-lg p-2">
              <i className="fas fa-graduation-cap text-xl text-white"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold">
                Katipunan Central School & SPED Center
              </h1>
              <p className="text-primary-200 text-xs">
                Educational Administration Platform
              </p>
            </div>
          </div>

          <div className="mx-8 hidden max-w-md flex-1 md:flex">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search teachers, documents, or records..."
                className="bg-primary-700 border-primary-600 placeholder-primary-300 focus:ring-accent-500 w-full rounded-lg border py-2 pr-4 pl-10 text-white focus:border-transparent focus:ring-2 focus:outline-none"
              />
              <i className="fas fa-search text-primary-300 absolute top-1/2 left-3 -translate-y-1/2 transform"></i>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <DropdownMenu onOpenChange={handleNotificationOpen}>
              <DropdownMenuTrigger asChild>
                <button className="text-primary-200 relative p-2 transition-colors hover:text-white">
                  <i className="fas fa-bell text-lg"></i>
                  {unreadNotifications.length > 0 && (
                    <span className="bg-accent-500 absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white">
                      {unreadNotifications.length > 9 ? "9+" : unreadNotifications.length}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="max-h-[450px] min-w-[350px] bg-white shadow-sm"
              >
                <div className="border-b border-slate-200 p-4">
                  <h3 className="text-secondary-900 text-lg font-semibold">
                    Notifications
                  </h3>
                </div>
                <div className="p-4">
                  {sortedNotifications == undefined ||
                  sortedNotifications.length == 0 ? (
                    <p className="text-sm text-gray-500"> No Notifications </p>
                  ) : (
                    <div className="space-y-4">
                      {sortedNotifications.map((value, index) => (
                        <NotificationCard key={index} notification={value} />
                      ))}
                    </div>
                  )}
                  {/* <button className="text-primary-600 hover:text-primary-700 mt-4 w-full text-sm font-medium">
                    View all activity
                  </button> */}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="group flex cursor-pointer items-center space-x-2">
                  <img
                    src={resolveImageSource(profilePic)}
                    alt="Admin Profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium transition-colors duration-150 group-hover:text-white/70">
                    {user.username}
                  </span>
                  <i className="fas fa-chevron-down text-primary-300 group-hover:text-primary-600 text-xs transition-colors duration-150"></i>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="mt-2 w-44 rounded-lg border border-gray-200 bg-white py-2 text-sm text-gray-700 shadow-lg"
              >
                <DropdownMenuItem
                  onClick={() => {
                    // Handle update photo
                  }}
                  className="flex items-center space-x-2 px-4 py-2 font-medium transition-colors duration-150 hover:bg-gray-100 hover:text-gray-900"
                >
                  <i className="fas fa-camera"></i>
                  <span>Update Photo</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    // Handle update password
                  }}
                  className="flex items-center space-x-2 px-4 py-2 font-medium transition-colors duration-150 hover:bg-gray-100 hover:text-gray-900"
                >
                  <i className="fas fa-key"></i>
                  <span>Update Password</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    logout(() => {
                      window.location.href = "/login";
                    })
                  }
                  className="flex items-center space-x-2 px-4 py-2 font-medium text-red-500 transition-colors duration-150 hover:bg-red-50 hover:text-red-600"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
