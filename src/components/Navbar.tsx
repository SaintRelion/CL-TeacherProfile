import { useAuth, useCurrentUser } from "@saintrelion/auth-lib";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import {
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import type {
  CreatePersonalInformation,
  PersonalInformation,
} from "@/models/PersonalInformation";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import { getExpiryState, resolveImageSource } from "@/lib/utils";
import { NO_FACE_IMAGE } from "@/constants";
import NotificationCard from "./dashboard/NotificationCard";
import type {
  CreateMyNotification,
  MyNotification,
  UpdateMyNotification,
} from "@/models/MyNotification";
import type { TeacherDocument } from "@/models/TeacherDocument";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toDate } from "@saintrelion/time-functions";
import { toast } from "@saintrelion/notifications";
import type { User } from "@/models/User";

const Navbar = () => {
  const user = useCurrentUser<User>();
  const auth = useAuth();

  // State for dialogs
  const [showUpdatePhoto, setShowUpdatePhoto] = useState(false);
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const { useList: getInformation, useUpdate: updateInformation } =
    useResourceLocked<
      PersonalInformation,
      CreatePersonalInformation,
      CreatePersonalInformation
    >("personalinformation", { showToast: false });

  const role = user.roles ? user.roles[0] : "";
  const { data: informations } = getInformation({
    filters: role == "admin" ? {} : { userId: user.id },
  });

  const myInformation = informations != null ? informations[0] : undefined;

  const {
    useList: getNotifications,
    useInsert: insertNotifications,
    useUpdate: updateNotifications,
  } = useResourceLocked<
    MyNotification,
    CreateMyNotification,
    UpdateMyNotification
  >("mynotification", { showToast: false });

  const notifications = getNotifications({
    filters:
      role == "admin"
        ? {}
        : {
            userId: user.id,
          },
  }).data;
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

  const { useList: getDocuments } =
    useResourceLocked<TeacherDocument>("teacherdocument");

  const documents = getDocuments({
    filters: {
      userId: user.id,
    },
  }).data;

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

        await insertNotifications.run({
          userId: user.id,
          type: status,
          title: `${doc.documentType} ${status}`,
          description,
        });
      }
    };

    run();
  }, [
    documents,
    existingDescriptions,
    insertNotifications,
    myInformation,
    notifications,
    user.id,
    user.role,
  ]);

  const profilePic =
    myInformation != undefined ? myInformation.photoBase64 : NO_FACE_IMAGE;

  // Count only unread notifications

  const unreadNotifications = useMemo(() => {
    if (!notifications) return [];
    return notifications.filter((n) => !n.isRead);
  }, [notifications]);

  // Track if notification menu has been opened
  const [notifMenuOpened, setNotifMenuOpened] = useState(false);

  // Local unread count to allow optimistic UI updates when marking as read
  const [localUnreadCount, setLocalUnreadCount] = useState<number>(0);

  // Keep local unread count in sync with fetched notifications
  useEffect(() => {
    setLocalUnreadCount(unreadNotifications.length);
  }, [unreadNotifications]);

  const handleMarkAsRead = async (notification: MyNotification) => {
    if (!notification.isRead) {
      await updateNotifications.run({
        id: notification.id,
        payload: { isRead: true },
      });
      // Optimistically update local unread count
      setLocalUnreadCount((c) => Math.max(0, c - 1));
    }
  };

  // Open detailed compliance report dialog for a notification
  const [showComplianceDialog, setShowComplianceDialog] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<MyNotification | null>(null);
  const navigate = useNavigate();

  const handleNotificationClick = async (notification: MyNotification) => {
    // mark as read
    await handleMarkAsRead(notification);
    // open dialog
    setSelectedNotification(notification);
    setShowComplianceDialog(true);
  };

  // Handle photo file selection
  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle photo update
  const handleUpdatePhoto = async () => {
    if (!photoPreview || !myInformation) {
      toast.error("Please select a photo");
      return;
    }

    setIsUpdatingPhoto(true);
    try {
      await updateInformation.run({
        id: myInformation.id,
        payload: {
          photoBase64: photoPreview,
        } as Partial<PersonalInformation>,
      });
      toast.success("Profile photo updated successfully");
      setShowUpdatePhoto(false);
      setPhotoPreview("");
    } catch (error) {
      console.error("Failed to update photo:", error);
      toast.error("Failed to update photo");
    } finally {
      setIsUpdatingPhoto(false);
    }
  };

  // Handle password update
  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser || !currentUser.email) {
        toast.error("User not authenticated");
        return;
      }

      // Reauthenticate user with current password
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword,
      );
      await reauthenticateWithCredential(currentUser, credential);

      // Update password
      await updatePassword(currentUser, newPassword);

      toast.success("Password updated successfully");
      setShowUpdatePassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const error = err as Record<string, string>;

      console.error("Failed to update password:", error);
      if (error.code === "auth/wrong-password") {
        toast.error("Current password is incorrect");
      } else if (error.code === "auth/weak-password") {
        toast.error("New password is too weak");
      } else {
        toast.error(error.message || "Failed to update password");
      }
    } finally {
      setIsUpdatingPassword(false);
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

          {/* <div className="mx-8 hidden max-w-md flex-1 md:flex">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search teachers, documents, or records..."
                className="bg-primary-700 border-primary-600 placeholder-primary-300 focus:ring-accent-500 w-full rounded-lg border py-2 pr-4 pl-10 text-white focus:border-transparent focus:ring-2 focus:outline-none"
              />
              <i className="fas fa-search text-primary-300 absolute top-1/2 left-3 -translate-y-1/2 transform"></i>
            </div>
          </div> */}

          <div className="flex items-center space-x-4">
            <DropdownMenu
              onOpenChange={(open) => {
                setNotifMenuOpened(open);
                if (open) setLocalUnreadCount(0);
              }}
            >
              <DropdownMenuTrigger asChild>
                <button className="text-primary-200 relative p-2 transition-colors hover:text-white">
                  <i className="fas fa-bell text-lg"></i>
                  {localUnreadCount > 0 && !notifMenuOpened && (
                    <span className="bg-accent-500 absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white">
                      {localUnreadCount > 9 ? "9+" : localUnreadCount}
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
                        <div
                          key={index}
                          onClick={() => handleNotificationClick(value)}
                          className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-slate-50"
                        >
                          <NotificationCard
                            notification={value}
                            isRead={value.isRead}
                          />
                        </div>
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
                  onClick={() => setShowUpdatePhoto(true)}
                  className="flex items-center space-x-2 px-4 py-2 font-medium transition-colors duration-150 hover:bg-gray-100 hover:text-gray-900"
                >
                  <i className="fas fa-camera"></i>
                  <span>Update Photo</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setShowUpdatePassword(true)}
                  className="flex items-center space-x-2 px-4 py-2 font-medium transition-colors duration-150 hover:bg-gray-100 hover:text-gray-900"
                >
                  <i className="fas fa-key"></i>
                  <span>Update Password</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={async () => await auth.logout()}
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

      {/* Update Photo Dialog */}
      <Dialog open={showUpdatePhoto} onOpenChange={setShowUpdatePhoto}>
        <DialogContent className="bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <i className="fas fa-camera text-primary-600"></i>
              Update Profile Photo
            </DialogTitle>
            <DialogDescription>
              Upload a new profile photo. Supported formats: JPG, PNG, GIF
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Photo Preview */}
            <div className="flex justify-center">
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <i className="fas fa-user text-4xl text-slate-400"></i>
                )}
              </div>
            </div>

            {/* File Input */}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="file:bg-primary-500 hover:file:bg-primary-600 block w-full text-sm text-slate-500 file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={() => {
                setShowUpdatePhoto(false);
                setPhotoPreview("");
              }}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdatePhoto}
              disabled={!photoPreview || isUpdatingPhoto}
              className="bg-primary-600 hover:bg-primary-700 rounded-md px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUpdatingPhoto ? "Updating..." : "Update Photo"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detailed Compliance Report Dialog */}
      <Dialog
        open={showComplianceDialog}
        onOpenChange={setShowComplianceDialog}
      >
        <DialogContent className="bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <i className="fas fa-file-alt text-primary-600"></i>
              View Expirey Documents
            </DialogTitle>
            <DialogDescription>{selectedNotification?.title}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              {selectedNotification?.description}
            </p>
          </div>

          <DialogFooter>
            <button
              onClick={() => setShowComplianceDialog(false)}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={() => {
                setShowComplianceDialog(false);
                let searchValue = selectedNotification?.description ?? "";
                const lastIdx = searchValue.lastIndexOf(" - ");
                if (lastIdx !== -1)
                  searchValue = searchValue.substring(lastIdx + 3);
                navigate(
                  "/admin/documentrepository?q=" +
                    encodeURIComponent(searchValue),
                );
              }}
              className="bg-primary-600 hover:bg-primary-700 rounded-md px-4 py-2 text-sm font-medium text-white"
            >
              View Detailed Compliance Report
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Password Dialog */}
      <Dialog open={showUpdatePassword} onOpenChange={setShowUpdatePassword}>
        <DialogContent className="bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <i className="fas fa-key text-primary-600"></i>
              Update Password
            </DialogTitle>
            <DialogDescription>
              Change your account password. Must be at least 6 characters.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="focus:ring-primary-500 mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="focus:ring-primary-500 mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="focus:ring-primary-500 mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2"
              />
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={() => {
                setShowUpdatePassword(false);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
              }}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdatePassword}
              disabled={isUpdatingPassword}
              className="bg-primary-600 hover:bg-primary-700 rounded-md px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};
export default Navbar;
