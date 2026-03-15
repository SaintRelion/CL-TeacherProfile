import { useState, useRef, useEffect } from "react";
import { useCurrentUser } from "@saintrelion/auth-lib";
import type { User } from "@/models/user";
import { useDocumentNotifications, type UseDocumentNotificationsOptions } from "@/hooks/useDocumentNotifications";
import NotificationBell from "./NotificationBell";
import NotificationList from "./NotificationList";

interface DocumentNotificationManagerProps {
  options?: UseDocumentNotificationsOptions;
  className?: string;
  showDropdownOnHover?: boolean;
  autoCloseDelay?: number; // milliseconds
}

const DocumentNotificationManager = ({
  options,
  className = "",
  showDropdownOnHover = false,
  autoCloseDelay = 5000,
}: DocumentNotificationManagerProps) => {
  const user = useCurrentUser<User>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Determine if user is admin
  const isAdmin = user?.roles?.includes("admin") ?? false;

  const {
    notifications,
    stats,
    isLoading,
    error,
    activeFilter,
    setActiveFilter,
    markAsRead,
    markAllAsRead,
  } = useDocumentNotifications(user?.id ?? "", {
    ...options,
    isAdmin, // Pass admin flag to show all teachers' documents
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isDropdownOpen]);

  // Auto-close dropdown after delay
  useEffect(() => {
    if (isDropdownOpen && !showDropdownOnHover) {
      closeTimeoutRef.current = setTimeout(() => {
        setIsDropdownOpen(false);
      }, autoCloseDelay);

      return () => {
        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current);
        }
      };
    }
  }, [isDropdownOpen, showDropdownOnHover, autoCloseDelay]);

  if (!user?.id) {
    return null;
  }

  return (
    <div
      ref={dropdownRef}
      className={`relative ${className}`}
      onMouseEnter={() => {
        if (showDropdownOnHover) setIsDropdownOpen(true);
      }}
      onMouseLeave={() => {
        if (showDropdownOnHover) setIsDropdownOpen(false);
      }}
    >
      {/* Notification Bell */}
      <NotificationBell
        unreadCount={stats.unread}
        isLoading={isLoading}
        hasError={!!error}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      />

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 top-12 z-50 w-full sm:w-auto">
          <NotificationList
            notifications={notifications}
            isLoading={isLoading}
            error={error}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
            stats={stats}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>
      )}
    </div>
  );
};

export default DocumentNotificationManager;
