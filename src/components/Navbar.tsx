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
  CreateNotification,
  Notification,
  UpdateNotification,
} from "@/models/Notification";
import type { TeacherDocument } from "@/models/TeacherDocument";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sortByTime } from "@saintrelion/time-functions";
import { toast } from "@saintrelion/notifications";
import type { User } from "@/models/user";

const Navbar = ({ toggleSidebar }: { toggleSidebar?: () => void }) => {
  const user = useCurrentUser<User>();
  const auth = useAuth();

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

  const role = user.roles?.[0] ?? "";

  const { data: informations } = getInformation({
    filters: { user: user.id },
  });

  const myInformation = informations?.[0];

  const {
    useList: getNotifications,
    useInsert: insertNotifications,
    useUpdate: updateNotifications,
  } = useResourceLocked<
    Notification,
    CreateNotification,
    UpdateNotification
  >("notification", { showToast: false });

  const notifications =
    getNotifications({
      filters: role === "admin" ? {} : { user: user.id },
    }).data ?? [];

  const privateNotifications = useMemo(
    () =>
      role === "admin"
        ? notifications
        : notifications.filter((notification) => notification.user === user.id),
    [notifications, role, user.id]
  );

  const { useList: getDocuments } =
    useResourceLocked<TeacherDocument>("teacherdocument");

  const documents =
    getDocuments({
      filters: { user: user.id },
    }).data ?? [];

  const sortedNotifications = useMemo(
    () => sortByTime(privateNotifications, "created_at") ?? [],
    [privateNotifications]
  );

  const existingDescriptions = useRef(new Set<string>());

  useEffect(() => {
    existingDescriptions.current = new Set(
      sortedNotifications.map((n) => n.description)
    );
  }, [sortedNotifications]);

  useEffect(() => {
    if (!myInformation || !documents.length || role === "admin") return;

    const run = async () => {
      for (const doc of documents) {
        const status = getExpiryState(doc.expiry_date);
        if (status !== "expiring" && status !== "expired") continue;

        const description = `${myInformation.first_name} ${myInformation.middle_name} ${myInformation.last_name} - ${doc.document_title}`;

        if (existingDescriptions.current.has(description)) continue;

        existingDescriptions.current.add(description);

        await insertNotifications.run({
          user: user.id,
          type: status,
          title: `${doc.document_title} ${status}`,
          description,
          is_read: false,
        });
      }
    };

    run();
  }, [documents, myInformation, role, user.id, insertNotifications]);

  const profilePic = useMemo(
    () => myInformation?.photo_base64 ?? NO_FACE_IMAGE,
    [myInformation]
  );

  const unreadNotifications = useMemo(
    () => sortedNotifications.filter((n) => !n.is_read),
    [sortedNotifications]
  );

  const [notifMenuOpened, setNotifMenuOpened] = useState(false);
  const [localUnreadCount, setLocalUnreadCount] = useState(0);

  useEffect(() => {
    setLocalUnreadCount(unreadNotifications.length);
  }, [unreadNotifications]);

  const handleMarkAsRead = async (notification: Notification) => {
    if (role !== "admin" && notification.user !== user.id) {
      return;
    }

    if (!notification.is_read) {
      await updateNotifications.run({
        id: notification.id,
        payload: { is_read: true },
      });
      setLocalUnreadCount((c) => Math.max(0, c - 1));
    }
  };

  const [showComplianceDialog, setShowComplianceDialog] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  const navigate = useNavigate();

  const handleNotificationClick = async (notification: Notification) => {
    if (role !== "admin" && notification.user !== user.id) {
      toast.error("You can only access notifications for your own account.");
      return;
    }

    await handleMarkAsRead(notification);
    setSelectedNotification(notification);
    setShowComplianceDialog(true);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) =>
      setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpdatePhoto = async () => {
    if (!photoPreview || !myInformation) return;

    setIsUpdatingPhoto(true);

    try {
      await updateInformation.run({
        id: myInformation.id,
        payload: { photo_base64: photoPreview },
      });

      toast.success("Profile photo updated");
      setShowUpdatePhoto(false);
      setPhotoPreview("");
    } catch {
      toast.error("Failed to update photo");
    } finally {
      setIsUpdatingPhoto(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password too short");
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const authInstance = getAuth();
      const currentUser = authInstance.currentUser;

      if (!currentUser?.email) throw new Error();

      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );

      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);

      toast.success("Password updated");
      setShowUpdatePassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.message ?? "Update failed");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg border-b-4 border-yellow-400">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center space-x-3">
            <button
              aria-label="Open menu"
              onClick={() => toggleSidebar?.()}
              className="lg:hidden p-2 rounded-lg hover:bg-blue-500"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>

            <h1 className="font-bold truncate max-w-[240px] text-sm sm:text-base md:text-lg lg:text-xl">
              Katipunan Central School & SPED Center
            </h1>
          </div>

          {/* RIGHT */}
          <div className="flex items-center space-x-4">

            {/* NOTIFICATIONS */}
            <DropdownMenu
              onOpenChange={(open) => setNotifMenuOpened(open)}
            >
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Notifications"
                  className="relative p-2 hover:bg-blue-500 rounded-lg"
                >
                  <i className="fas fa-bell text-lg"></i>

                  {localUnreadCount > 0 && !notifMenuOpened && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-yellow-500 text-xs font-bold">
                      {localUnreadCount > 9 ? "9+" : localUnreadCount}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-80 p-0">
                <div className="border-b border-gray-100 p-4 font-bold">
                  Notifications
                </div>

                {sortedNotifications.length === 0 ? (
                  <p className="p-4 text-sm text-gray-500">
                    No Notifications
                  </p>
                ) : (
                  <div className="max-h-96 overflow-y-auto p-2">
                    {sortedNotifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className="cursor-pointer rounded-lg p-1 hover:bg-blue-50"
                      >
                        <NotificationCard
                          notification={n}
                          isRead={n.is_read}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* USER MENU */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div
                  aria-label="User menu"
                  className="flex items-center space-x-2 cursor-pointer hover:opacity-80"
                >
                  <img
                    src={resolveImageSource(profilePic)}
                    alt="Profile"
                    className="h-8 w-8 rounded-full border-2 border-yellow-400 object-cover"
                  />

                  <span className="text-sm font-medium truncate max-w-[120px]">
                    {user.username}
                  </span>

                  <i className="fas fa-chevron-down text-xs"></i>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">

                <DropdownMenuItem onClick={() => setShowUpdatePhoto(true)}>
                  Update Photo
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setShowUpdatePassword(true)}>
                  Update Password
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => auth.logout()}
                  className="text-red-600"
                >
                  Logout
                </DropdownMenuItem>

              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* PHOTO DIALOG */}
      <Dialog open={showUpdatePhoto} onOpenChange={setShowUpdatePhoto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Profile Photo</DialogTitle>
            <DialogDescription>
              Upload JPG/PNG/GIF (max 5MB)
            </DialogDescription>
          </DialogHeader>

          <input type="file" accept="image/*" onChange={handlePhotoSelect} />

          <DialogFooter>
            <button onClick={() => setShowUpdatePhoto(false)}>
              Cancel
            </button>

            <button
              onClick={handleUpdatePhoto}
              disabled={!photoPreview || isUpdatingPhoto}
            >
              {isUpdatingPhoto ? "Updating..." : "Update"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PASSWORD DIALOG */}
      <Dialog open={showUpdatePassword} onOpenChange={setShowUpdatePassword}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Password</DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <DialogFooter>
            <button onClick={() => setShowUpdatePassword(false)}>
              Cancel
            </button>

            <button
              onClick={handleUpdatePassword}
              disabled={isUpdatingPassword}
            >
              {isUpdatingPassword ? "Updating..." : "Update"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Navbar;
