## Document Notification System

A complete, production-ready notification system for tracking document expiration dates. This system fetches document data from existing APIs and calculates expiration statuses automatically.

### Features

✅ **Automatic Expiration Tracking**
- Monitors documents by expiry date
- Categorizes as: Expired, Due Today, Expiring Soon, Upcoming
- Configurable lead times (default: 7, 15, 30 days)

✅ **Real-time Updates**
- Auto-refresh capability (default: every 60 seconds)
- Manual refresh button
- Responsive to document changes

✅ **Per-User Account Notifications**
- Notifications only for document owner
- Read/unread state tracking
- Automatic filtering to current user

✅ **Three Integration Levels**
1. **Dropdown Manager** - Bell icon + dropdown notifications
2. **Full Page Component** - Dedicated notifications page
3. **Custom Hook** - Build your own UI with `useDocumentNotifications`

✅ **Comprehensive UI States**
- Loading state with spinner
- Error handling with messages
- Empty state when all caught up
- Responsive list and grid views

---

## Quick Start

### 1. Add Notification Bell to Navbar

```tsx
import DocumentNotificationManager from "@/components/document-notifications/DocumentNotificationManager";

export default function Navbar() {
  return (
    <header className="...">
      <div className="...">
        {/* Other navbar items */}
        
        {/* Add this */}
        <DocumentNotificationManager 
          className="mr-4"
          showDropdownOnHover={false}
        />
      </div>
    </header>
  );
}
```

### 2. Create Dedicated Notifications Page

```tsx
import DocumentNotificationsPage from "@/components/document-notifications/DocumentNotificationsPage";

export default function NotificationsPage() {
  return (
    <main className="min-h-screen bg-white p-6">
      <DocumentNotificationsPage />
    </main>
  );
}
```

### 3. Use Custom Hook

```tsx
import { useDocumentNotifications } from "@/hooks/useDocumentNotifications";
import { useCurrentUser } from "@saintrelion/auth-lib";
import type { User } from "@/models/user";

export default function CustomNotifications() {
  const user = useCurrentUser<User>();
  const {
    notifications,
    stats,
    isLoading,
    error,
    activeFilter,
    setActiveFilter,
    markAsRead,
    markAllAsRead,
    refetch
  } = useDocumentNotifications(user?.id ?? "", {
    criticalDays: 7,
    highPriorityDays: 15,
    mediumPriorityDays: 30,
    autoRefresh: true
  });

  // Use notifications, stats, and methods as needed
  return (
    <div>
      {/* Your custom UI */}
    </div>
  );
}
```

---

## Configuration Options

### useDocumentNotifications Hook

```typescript
interface UseDocumentNotificationsOptions {
  criticalDays?: number;      // Default: 7 (red)
  highPriorityDays?: number;  // Default: 15 (orange)
  mediumPriorityDays?: number; // Default: 30 (yellow)
  refreshInterval?: number;    // Default: 60000ms (1 min)
  autoRefresh?: boolean;       // Default: true
}
```

**Example with custom config:**
```tsx
<DocumentNotificationManager
  options={{
    criticalDays: 3,
    highPriorityDays: 10,
    mediumPriorityDays: 21,
    refreshInterval: 30000, // Refresh every 30 seconds
    autoRefresh: true
  }}
/>
```

### DocumentNotificationManager Props

```typescript
interface DocumentNotificationManagerProps {
  options?: UseDocumentNotificationsOptions;
  className?: string;
  showDropdownOnHover?: boolean;  // Default: false (click to open)
  autoCloseDelay?: number;        // Default: 5000ms
}
```

---

## Status Levels

### Expiration Status

| Status | Meaning | Color |
|--------|---------|-------|
| `expired` | Document expired (past expiry date) | Red |
| `expiring_today` | Expires at end of today | Orange |
| `expiring_soon` | Expires within critical days | Red/Orange |
| `upcoming` | Expires within medium days | Yellow/Blue |

### Urgency Levels

| Urgency | Condition |
|---------|-----------|
| `critical` | 0-7 days remaining or expired |
| `high` | 8-15 days remaining |
| `medium` | 16-30 days remaining |
| `low` | 30+ days remaining |

---

## Hook Return Values

```typescript
{
  notifications: DocumentNotification[];        // Filtered, sorted notifications
  filteredNotifications: DocumentNotification[]; // After filter applied
  allNotifications: DocumentNotification[];      // All notifications
  
  stats: {
    total: number;           // Total notifications
    expired: number;         // Count of expired
    expiring_today: number;  // Count of due today
    expiring_soon: number;   // Count of expiring soon
    unread: number;          // Count of unread
  };
  
  isLoading: boolean;        // Data loading state
  error: string | null;      // Error message if any
  lastRefresh: Date;         // Last refresh timestamp
  
  activeFilter: string;      // Current filter selected
  setActiveFilter: (filter) => void;
  
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refetch: () => void;       // Manual refresh
}
```

---

## Components

### NotificationBell
Displays bell icon with unread count badge.

Props:
- `unreadCount: number` - Number of unread notifications
- `isLoading?: boolean` - Show loading state
- `hasError?: boolean` - Show error indicator
- `onClick?: () => void` - Click handler
- `className?: string` - Custom classes

### NotificationList
Displays filtered list of notifications.

Props:
- `notifications: DocumentNotification[]`
- `isLoading?: boolean`
- `error?: string | null`
- `onMarkAsRead?: (id: string) => void`
- `onMarkAllAsRead?: () => void`
- `stats?: Stats`
- `activeFilter?: string`
- `onFilterChange?: (filter) => void`

### DocumentNotificationManager
Complete dropdown solution with bell + list.

Props:
- `options?: UseDocumentNotificationsOptions`
- `className?: string`
- `showDropdownOnHover?: boolean`
- `autoCloseDelay?: number`

### DocumentNotificationsPage
Full-page notifications view with list/grid toggle.

Props:
- `options?: UseDocumentNotificationsOptions`

---

## API Integration

The system automatically fetches from these endpoints via `@saintrelion/data-access-layer`:

**TeacherDocument endpoint:**
```
GET /api/teacherdocument/?user={userId}&is_archived=False
```

Returns documents with `expiry_date` field used for calculation.

**Notification endpoint:**
```
GET /api/notification/?user={userId}&type=document_expiry
PUT /api/notification/{id}/ { is_read: boolean }
```

Used for tracking read/unread state.

---

## Example: Navbar Integration

```tsx
// src/components/Navbar.tsx
import DocumentNotificationManager from "@/components/document-notifications/DocumentNotificationManager";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Logo and title */}
        <div className="flex items-center space-x-3">
          <h1>Teacher Profile System</h1>
        </div>

        {/* Right side: notifications and profile */}
        <div className="flex items-center space-x-4">
          {/* Document notifications */}
          <DocumentNotificationManager
            options={{
              criticalDays: 7,
              highPriorityDays: 15,
              mediumPriorityDays: 30,
              autoRefresh: true
            }}
          />

          {/* Profile menu, etc. */}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
```

---

## Example: Custom UI with Hook

```tsx
import { useDocumentNotifications } from "@/hooks/useDocumentNotifications";
import { useCurrentUser } from "@saintrelion/auth-lib";
import type { User } from "@/models/user";

export default function MyCustomNotifications() {
  const user = useCurrentUser<User>();
  const { notifications, stats, isLoading, error, markAsRead } = 
    useDocumentNotifications(user?.id ?? "");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      {/* Show count badges */}
      <div className="flex gap-4">
        <div className="bg-red-100 p-4 rounded">
          <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
          <p className="text-sm text-red-700">Expired</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded">
          <p className="text-2xl font-bold text-yellow-600">{stats.expiring_soon}</p>
          <p className="text-sm text-yellow-700">Expiring Soon</p>
        </div>
      </div>

      {/* List notifications */}
      <div className="space-y-2">
        {notifications.map((notif) => (
          <div
            key={notif.documentId}
            onClick={() => notification.notificationId && markAsRead(notif.notificationId)}
            className="p-4 border rounded cursor-pointer hover:bg-gray-50"
          >
            <h4 className="font-medium">{notif.documentTitle}</h4>
            <p className="text-sm text-gray-600">{notif.requiredAction}</p>
            <p className="text-xs text-gray-500 mt-2">
              Expires: {notif.expiryDate}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## File Structure

```
src/
├── hooks/
│   └── useDocumentNotifications.ts          # Main hook
├── components/
│   └── document-notifications/
│       ├── NotificationBell.tsx             # Bell icon with badge
│       ├── NotificationList.tsx             # Notification list view
│       ├── DocumentNotificationManager.tsx  # Complete dropdown
│       └── DocumentNotificationsPage.tsx    # Full page view
```

---

## Performance Considerations

- **Auto-refresh interval:** Default 60 seconds (configurable)
- **Memoization:** Uses `useMemo` to prevent unnecessary recalculations
- **Filtering/Sorting:** Done client-side for instant responsiveness
- **API Calls:** Minimal, only fetches user's own documents
- **Re-renders:** Optimized with proper dependencies

---

## Accessibility

- Semantic HTML with proper labels
- ARIA labels on interactive elements
- Keyboard navigation support
- Color indicators + text labels (not color-only)
- Focus states on buttons
- Loading and error announcements

---

## Browser Support

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Mobile browsers: ✅

---

## Notes

- Notifications are **per-user account** (only shows current user's documents)
- **Read/unread state** is persisted via API
- **Real-time updates** optional via auto-refresh
- **No backend changes needed** - uses existing endpoints
- **Responsive design** works on all screen sizes
- **No UI redesign** - integrates with existing Blue-Yellow-White theme

---

## Troubleshooting

### Notifications not showing?
- Verify user has documents with `expiry_date` field
- Check browser console for API errors
- Ensure `useCurrentUser` is properly initialized

### Auto-refresh not working?
- Check `autoRefresh: true` in options
- Verify `refreshInterval` is set to reasonable value
- Check network tab for API calls

### Styling not matching?
- Ensure Tailwind CSS is included
- Check that `NO_FACE_IMAGE` constant is imported if needed
- Verify color classes are available (blue, red, yellow, orange, green)
