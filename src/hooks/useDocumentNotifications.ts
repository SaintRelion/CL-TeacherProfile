import { useState, useEffect, useCallback, useMemo } from "react";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import type { TeacherDocument } from "@/models/TeacherDocument";
import type { Notification, UpdateNotification } from "@/models/Notification";
import type { PersonalInformation } from "@/models/PersonalInformation";

export interface DocumentNotification {
  documentId: string;
  documentTitle: string;
  expiryDate: string;
  daysRemaining: number;
  status: "expired" | "expiring_today" | "expiring_soon" | "upcoming";
  urgency: "critical" | "high" | "medium" | "low";
  notificationId?: string;
  isRead: boolean;
  requiredAction: string;
  // Teacher info (populated for admin view)
  teacherName?: string;
  teacherDepartment?: string;
  teacherUserId?: string;
}

export interface UseDocumentNotificationsOptions {
  criticalDays?: number;
  highPriorityDays?: number;
  mediumPriorityDays?: number;
  refreshInterval?: number; // milliseconds
  autoRefresh?: boolean;
  isAdmin?: boolean; // Show all teachers' documents instead of just current user
}

const DEFAULT_OPTIONS: UseDocumentNotificationsOptions = {
  criticalDays: 7,
  highPriorityDays: 15,
  mediumPriorityDays: 30,
  refreshInterval: 60000, // 1 minute
  autoRefresh: true,
  isAdmin: false,
};

export const useDocumentNotifications = (
  userId: string,
  options: UseDocumentNotificationsOptions = {},
) => {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  const { useList: getDocuments } =
    useResourceLocked<TeacherDocument>("teacherdocument");
  const { useList: getNotifications, useUpdate: updateNotification } =
    useResourceLocked<Notification, never, UpdateNotification>("notification");

  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [activeFilter, setActiveFilter] = useState<
    "all" | "expired" | "expiring_today" | "expiring_soon" | "upcoming"
  >("all");

  // Fetch documents - for admins, fetch all documents; for users, fetch only their own
  const documentsData = getDocuments({
    filters: mergedOptions.isAdmin
      ? { is_archived: "False" } // Admin: fetch all documents
      : {
          user: userId, // User: fetch only their documents
          is_archived: "False",
        },
  });

  // For notifications, always filter by current user (personal notifications)
  const notificationsData = getNotifications({
    filters: {
      user: userId,
      type: "document_expiry",
    },
  });

  // Fetch teacher personal information (for admin view to show teacher names)
  const { useList: getPersonalInfo } = useResourceLocked<PersonalInformation>(
    "personalinformation",
  );

  const personalInfoData = getPersonalInfo().data;

  // Calculate days remaining
  const calculateDaysRemaining = useCallback((expiryDate: string): number => {
    if (!expiryDate) return -1;

    const expiry = new Date(expiryDate);
    const today = new Date();

    // Normalize to midnight for accurate day calculation
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }, []);

  // Determine notification status and urgency
  const getNotificationDetails = useCallback(
    (
      daysRemaining: number,
    ): {
      status: DocumentNotification["status"];
      urgency: DocumentNotification["urgency"];
      requiredAction: string;
    } => {
      if (daysRemaining < 0) {
        return {
          status: "expired",
          urgency: "critical",
          requiredAction: `Overdue by ${Math.abs(daysRemaining)} day(s). Update required immediately.`,
        };
      }

      if (daysRemaining === 0) {
        return {
          status: "expiring_today",
          urgency: "critical",
          requiredAction: "Expires today. Update required immediately.",
        };
      }

      if (daysRemaining <= mergedOptions.criticalDays!) {
        return {
          status: "expiring_soon",
          urgency: "critical",
          requiredAction: `Expires in ${daysRemaining} day(s). Update required soon.`,
        };
      }

      if (daysRemaining <= mergedOptions.highPriorityDays!) {
        return {
          status: "expiring_soon",
          urgency: "high",
          requiredAction: `Expires in ${daysRemaining} day(s). Plan to update.`,
        };
      }

      if (daysRemaining <= mergedOptions.mediumPriorityDays!) {
        return {
          status: "expiring_soon",
          urgency: "medium",
          requiredAction: `Expires in ${daysRemaining} day(s).`,
        };
      }

      return {
        status: "upcoming",
        urgency: "low",
        requiredAction: `Expires in ${daysRemaining} day(s).`,
      };
    },
    [mergedOptions],
  );

  // Process documents into notifications
  const processedNotifications = useMemo(() => {
    if (!documentsData.data) return [];

    const processed: DocumentNotification[] = documentsData.data
      .map((doc) => {
        const daysRemaining = calculateDaysRemaining(doc.expiry_date);

        // Only include documents that need notification (not far from expiry)
        if (daysRemaining > mergedOptions.mediumPriorityDays!) {
          return null;
        }

        const details = getNotificationDetails(daysRemaining);

        // Get teacher info if available (for admin view)
        const teacherInfo = personalInfoData?.find(
          (info) => info.user === doc.user_id,
        );

        return {
          documentId: doc.id,
          documentTitle: doc.document_title,
          expiryDate: doc.expiry_date,
          daysRemaining,
          ...details,
          isRead: false,
          teacherName: teacherInfo
            ? `${teacherInfo.first_name} ${teacherInfo.last_name}`.trim()
            : undefined,
          teacherDepartment: teacherInfo?.department,
          teacherUserId: doc.user_id,
        };
      })
      .filter(Boolean) as DocumentNotification[];

    return processed;
  }, [
    documentsData.data,
    personalInfoData,
    calculateDaysRemaining,
    getNotificationDetails,
    mergedOptions.mediumPriorityDays,
  ]);

  // Apply filters
  const filteredNotifications = useMemo(() => {
    if (activeFilter === "all") {
      return processedNotifications;
    }

    return processedNotifications.filter((n) => n.status === activeFilter);
  }, [processedNotifications, activeFilter]);

  // Sort notifications by urgency then days remaining
  const sortedNotifications = useMemo(() => {
    const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return [...filteredNotifications].sort((a, b) => {
      const urgencyDiff = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      if (urgencyDiff !== 0) return urgencyDiff;
      return a.daysRemaining - b.daysRemaining;
    });
  }, [filteredNotifications]);

  // Summary stats
  const stats = useMemo(() => {
    return {
      total: processedNotifications.length,
      expired: processedNotifications.filter((n) => n.status === "expired")
        .length,
      expiring_today: processedNotifications.filter(
        (n) => n.status === "expiring_today",
      ).length,
      expiring_soon: processedNotifications.filter(
        (n) => n.status === "expiring_soon",
      ).length,
      unread: processedNotifications.filter((n) => !n.isRead).length,
    };
  }, [processedNotifications]);

  // Mark notification as read
  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await updateNotification.run({
          id: notificationId,
          payload: { is_read: true },
        });
      } catch (err) {
        console.error("Failed to mark notification as read", err);
      }
    },
    [updateNotification],
  );

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      const unreadNotifications = (notificationsData.data ?? []).filter(
        (n) => !n.is_read,
      );
      await Promise.all(
        unreadNotifications.map((n) =>
          updateNotification.run({
            id: n.id,
            payload: { is_read: true },
          }),
        ),
      );
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  }, [notificationsData.data, updateNotification]);

  // Loading state
  const isLoading = documentsData.isLoading || notificationsData.isLoading;

  // Error handling
  useEffect(() => {
    if (documentsData.error) {
      setError("Failed to fetch documents");
    } else if (notificationsData.error) {
      setError("Failed to fetch notifications");
    } else {
      setError(null);
    }
  }, [documentsData.error, notificationsData.error]);

  // Auto-refresh
  useEffect(() => {
    if (!mergedOptions.autoRefresh) return;

    const interval = setInterval(() => {
      setLastRefresh(new Date());
      // Trigger re-fetch
      documentsData.refetch?.();
      notificationsData.refetch?.();
    }, mergedOptions.refreshInterval);

    return () => clearInterval(interval);
  }, [
    mergedOptions.autoRefresh,
    mergedOptions.refreshInterval,
    documentsData,
    notificationsData,
  ]);

  return {
    notifications: sortedNotifications,
    filteredNotifications,
    allNotifications: processedNotifications,
    stats,
    isLoading,
    error,
    lastRefresh,
    activeFilter,
    setActiveFilter,
    markAsRead,
    markAllAsRead,
    refetch: () => {
      setLastRefresh(new Date());
      documentsData.refetch?.();
      notificationsData.refetch?.();
    },
  };
};
