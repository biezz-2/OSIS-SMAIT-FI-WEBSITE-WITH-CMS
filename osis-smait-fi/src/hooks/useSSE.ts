'use client';

import { useEffect, useState } from 'react';
import { Notification } from '@/lib/notificationService';

export function useSSE(endpoint: string = '/api/sse/notifications') {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimer: NodeJS.Timeout;

    const connect = () => {
      eventSource = new EventSource(endpoint);

      eventSource.onopen = () => {
        setStatus('connected');
        setError(null);
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'connected') return;

          setNotifications((prev) => [...prev, data].slice(-100));
        } catch (err) {
          console.error('Failed to parse SSE event data:', err);
        }
      };

      eventSource.onerror = () => {
        setStatus('disconnected');
        setError(new Error('SSE connection failed'));
        eventSource?.close();

        // Ponytail: auto reconnect every 5s ceiling. upgrade path: exponential backoff
        reconnectTimer = setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      eventSource?.close();
    };
  }, [endpoint]);

  return { notifications, status, error };
}
