import { mockNotificationsResponse } from "../mockdata/notificationMockData";

// Manage clone notifications.
function cloneNotifications() {
  return mockNotificationsResponse.data.map((item) => ({ ...item }));
}

// Return a fresh copy on each call so UI state mutations do not leak back into
// the mock source and create inconsistent read/unread behavior across screens.
export async function getNotifications() {
  const data = cloneNotifications();
  return Promise.resolve({
    data,
    meta: {
      unread_count: data.filter((item) => !item.is_read).length,
    },
  });
}

// Manage mark notification read.
export async function markNotificationRead(id) {
  return Promise.resolve({
    message: "Notification marked as read.",
    data: {
      id,
      is_read: true,
    },
  });
}

// Manage mark all notifications read.
export async function markAllNotificationsRead() {
  return Promise.resolve({
    message: "All notifications marked as read.",
  });
}
