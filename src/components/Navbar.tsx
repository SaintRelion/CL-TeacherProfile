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
import type {
  CreatePersonalInformation,
  PersonalInformation,
} from "@/models/PersonalInformation";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import { getExpiryState } from "@/lib/utils";
import NotificationCard from "./dashboard/NotificationCard";
import type {
  CreateNotification,
  Notification,
  UpdateNotification,
} from "@/models/Notification";
import type {
  TeacherDocument,
  UpdateTeacherDocument,
} from "@/models/TeacherDocument";
import { useEffect, useMemo, useRef, useState } from "react";

import { sortByTime } from "@saintrelion/time-functions";
import { toast } from "@saintrelion/notifications";
import type { User } from "@/models/user";
import { AlertTriangle, Bell, ChevronDown, Menu } from "lucide-react";
import { BASE_API } from "@/sr-config";

const getAuthProof = (): Promise<{ type: "jwt"; access: string } | null> => {
  return new Promise((resolve) => {
    const request = indexedDB.open("AppCache");

    request.onsuccess = () => {
      const db = request.result;
      try {
        const transaction = db.transaction("kv", "readonly");
        const store = transaction.objectStore("kv");
        const getRequest = store.get("auth_proof");

        getRequest.onsuccess = () => {
          // If the value is a string, parse it. If it's already an object, return it.
          const data = getRequest.result;
          if (!data) return resolve(null);
          resolve(typeof data === "string" ? JSON.parse(data) : data);
        };
        getRequest.onerror = () => resolve(null);
      } catch (e) {
        console.error(`Store 'kv' not found in AppCache ${e}`);
        resolve(null);
      }
    };

    request.onerror = () => resolve(null);
  });
};

const Navbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const user = useCurrentUser<User>();
  const auth = useAuth();

  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showDocumentAlert, setShowDocumentAlert] = useState(false);
  const documentAlertSessionKey = `document-alert-shown:${user.id}`;

  const { useList: getInformation } = useResourceLocked<
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
  } = useResourceLocked<Notification, CreateNotification, UpdateNotification>(
    "notification",
    { showToast: false },
  );

  const notifications = getNotifications({
    filters: role === "admin" ? {} : { user: user.id },
  }).data;

  const privateNotifications = useMemo(() => {
    if (!notifications) return [];

    if (role === "admin") {
      return notifications;
    }

    return notifications.filter(
      (notification) => notification.user === user.id,
    );
  }, [notifications, role, user.id]);

  const { useList: getDocuments, useUpdate: updateDocument } =
    useResourceLocked<TeacherDocument, never, UpdateTeacherDocument>(
      "teacherdocument",
      { showToast: false },
    );

  const documents = getDocuments(
    role == "admin"
      ? {}
      : {
          filters: { user: user.id },
        },
  ).data;

  const sortedNotifications = useMemo(
    () => sortByTime(privateNotifications, "created_at") ?? [],
    [privateNotifications],
  );

  const existingDescriptions = useRef(new Set<string>());

  useEffect(() => {
    existingDescriptions.current = new Set(
      sortedNotifications.map((n) => n.description),
    );
  }, [sortedNotifications]);

  useEffect(() => {
    // Guard: We need documents and info to proceed at all
    // if (!myInformation) return;

    const run = async () => {
      if (!documents || !myInformation) return;

      for (const doc of documents) {
        const status = getExpiryState(doc.expiry_date);
        console.log(status);
        // SKIP if valid
        if (status !== "expiring" && status !== "expired") continue;

        // --- 1. AUTO-ARCHIVE (For Everyone, including Admin) ---
        if (status === "expired" && !doc.is_archived) {
          if (!updateDocument.isLocked) {
            await updateDocument.run({
              id: doc.id,
              payload: { is_archived: true },
            });
          }
        }

        // --- 2. NOTIFICATIONS (User Only) ---
        if (role !== "admin") {
          const description = `${myInformation.first_name} ${myInformation.middle_name} ${myInformation.last_name} - ${doc.document_title}`;

          if (!existingDescriptions.current.has(description)) {
            existingDescriptions.current.add(description);

            await insertNotifications.run({
              user: user.id,
              type: status,
              title: `${doc.document_title} ${status}`,
              description,
              is_read: false,
            });
          }
        }
      }
    };

    run();
  }, [
    documents,
    myInformation,
    role,
    user.id,
    insertNotifications,
    updateDocument,
  ]);

  const unreadNotifications = useMemo(
    () => sortedNotifications.filter((n) => !n.is_read),
    [sortedNotifications],
  );

  const documentAlerts = useMemo(
    () =>
      !documents
        ? []
        : documents
            .filter((doc) => !doc.is_archived)
            .map((doc) => ({
              doc,
              status: getExpiryState(doc.expiry_date),
            }))
            .filter(
              ({ status }) => status === "expiring" || status === "expired",
            ),
    [documents],
  );

  const [notifMenuOpened, setNotifMenuOpened] = useState(false);
  const [localUnreadCount, setLocalUnreadCount] = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    setLocalUnreadCount(unreadNotifications.length);
  }, [unreadNotifications]);

  useEffect(() => {
    if (role !== "teacher" || documentAlerts.length === 0) return;

    const alreadyShown = sessionStorage.getItem(documentAlertSessionKey);

    if (!alreadyShown) {
      setShowDocumentAlert(true);
      sessionStorage.setItem(documentAlertSessionKey, "true");
    }
  }, [documentAlertSessionKey, documentAlerts.length, role]);

  const currentDateLabel = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    [],
  );

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

  // const [showComplianceDialog, setShowComplianceDialog] = useState(false);
  // const [selectedNotification, setSelectedNotification] =
  //   useState<Notification | null>(null);

  // const navigate = useNavigate();

  const handleNotificationClick = async (notification: Notification) => {
    if (role !== "admin" && notification.user !== user.id) {
      toast.error("You can only access notifications for your own account.");
      return;
    }

    await handleMarkAsRead(notification);
    // setSelectedNotification(notification);
    // setShowComplianceDialog(true);
  };

  const handleUpdatePassword = async (): Promise<void> => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const authData = await getAuthProof();
      const token = authData?.access;

      if (!token) {
        toast.error("No token");
        console.log(token);
        return;
      }

      const response: Response = await fetch(
        `${BASE_API}api/accounts/change-password/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Using the token from IndexedDB
          },
          body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
            confirm_password: confirmPassword,
          }),
        },
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Password updated successfully!");
        setShowUpdatePassword(false);
        // Clear fields
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(result.detail || "Failed to update password.");
      }
    } catch (err) {
      const error = err as Record<string, string>;
      toast.error("A network error occurred. ", error);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 h-16 shrink-0 border-b border-slate-200 bg-white px-4 lg:px-8">
      <div className="flex h-full items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {role != "teacher" && (
            <button
              onClick={toggleSidebar}
              className="flex items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-50"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold text-slate-900 sm:text-base md:text-lg">
              Katipunan Central School & SPED Center
            </h1>
            <p className="text-[11px] font-medium tracking-tighter text-slate-400 uppercase">
              {currentDateLabel}
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          {/* NOTIFICATIONS */}
          <DropdownMenu onOpenChange={(open) => setNotifMenuOpened(open)}>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="Notifications"
                className="group relative rounded-xl p-2 text-slate-500 transition-all duration-300 hover:bg-slate-50 hover:text-slate-700"
              >
                <Bell className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />

                {localUnreadCount > 0 && !notifMenuOpened && (
                  <>
                    <span className="absolute top-0.5 right-0.5 h-3 w-3 animate-ping rounded-full bg-red-400/60" />
                    <span className="absolute top-0.5 right-0.5 h-3 w-3 scale-110 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.45)]" />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-80 rounded-2xl border border-slate-200/70 p-0 shadow-xl shadow-slate-200/60"
            >
              <div className="border-b border-slate-100 p-4 font-semibold text-slate-900">
                Notifications
              </div>

              {sortedNotifications.length === 0 ? (
                <p className="p-4 text-sm text-slate-500">No Notifications</p>
              ) : (
                <div className="max-h-96 overflow-y-auto p-2">
                  {sortedNotifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className="cursor-pointer rounded-xl p-1 transition-colors duration-200 hover:bg-slate-50"
                    >
                      <NotificationCard notification={n} isRead={n.is_read} />
                    </div>
                  ))}
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* USER MENU */}
          <DropdownMenu onOpenChange={setUserMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="User menu"
                className="group flex items-center gap-2 rounded-[4px] px-2 py-1.5 transition-all duration-300 hover:bg-slate-50"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white shadow-blue-500/20">
                  {user.username?.charAt(0).toUpperCase() || "A"}
                </div>

                <span className="max-w-[120px] truncate text-sm font-medium text-slate-700 sm:block">
                  {user.username || role}
                </span>

                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${
                    userMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-52 rounded-2xl border border-slate-200/70 p-1 shadow-xl shadow-slate-200/60"
            >
              <DropdownMenuItem onClick={() => setShowUpdatePassword(true)}>
                Update Password
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  sessionStorage.removeItem(documentAlertSessionKey);
                  auth.logout();
                }}
                variant="destructive"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* PASSWORD DIALOG */}
      <Dialog open={showUpdatePassword} onOpenChange={setShowUpdatePassword}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Password</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <input
              type="password"
              className="w-full rounded border p-2"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCurrentPassword(e.target.value)
              }
            />

            <input
              type="password"
              className="w-full rounded border p-2"
              placeholder="New password"
              value={newPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewPassword(e.target.value)
              }
            />

            <input
              type="password"
              className="w-full rounded border p-2"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e.target.value)
              }
            />
          </div>

          <DialogFooter>
            <button onClick={() => setShowUpdatePassword(false)}>Cancel</button>

            <button
              onClick={handleUpdatePassword}
              disabled={isUpdatingPassword}
              className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
            >
              {isUpdatingPassword ? "Updating..." : "Update"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDocumentAlert} onOpenChange={setShowDocumentAlert}>
        <DialogContent className="rounded-2xl border border-slate-200/70 bg-white shadow-2xl sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              Document Attention Needed
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Some of your uploaded documents are expired or expiring soon.
              Please review them after login.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
            {documentAlerts.map(({ doc, status }) => (
              <div
                key={doc.id}
                className={`rounded-2xl border p-4 ${
                  status === "expired"
                    ? "border-rose-200 bg-rose-50/70"
                    : "border-amber-200 bg-amber-50/70"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">
                      {doc.document_title}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {status === "expired"
                        ? "This document has expired."
                        : "This document is expiring soon."}
                    </p>
                  </div>
                  <span
                    className={`inline-flex rounded-xl px-2.5 py-1 text-xs font-semibold ${
                      status === "expired"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {status === "expired" ? "Expired" : "Expiring Soon"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <button
              onClick={() => setShowDocumentAlert(false)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Dismiss
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Navbar;
