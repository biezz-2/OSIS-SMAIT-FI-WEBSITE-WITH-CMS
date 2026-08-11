export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'feedback' | 'inbox';
  title: string;
  message: string;
  data?: any;
  timestamp: number;
  read: boolean;
  source: 'strapi' | 'telegram' | 'internal';
  aiSummary?: string;
}

class NotificationService {
  private listeners: Set<(notification: Notification) => void> = new Set();
  private notifications: Notification[] = [];

  subscribe(callback: (notification: Notification) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  emit(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const fullNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: Date.now(),
      read: false,
    };

    this.notifications.push(fullNotification);
    this.listeners.forEach((callback) => callback(fullNotification));

    // Async persist to Strapi if configured
    this.persistToStrapi(fullNotification);
  }

  private async persistToStrapi(notification: Notification) {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.STRAPI_URL;
    const strapiToken = process.env.STRAPI_TOKEN || process.env.STRAPI_API_TOKEN;

    if (!strapiUrl) return;

    try {
      await fetch(`${strapiUrl}/api/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {}),
        },
        body: JSON.stringify({ data: notification }),
      });
    } catch (error) {
      console.error('Failed to persist notification to Strapi:', error);
    }
  }

  getRecentNotifications() {
    return this.notifications.slice(-50);
  }
}

export const notificationService = new NotificationService();
