'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

function getDeviceId(): string {
  if (typeof window === 'undefined') return '';
  const COOKIE_NAME = 'mubes_device_id';
  const match = document.cookie.match(new RegExp('(^| )' + COOKIE_NAME + '=([^;]+)'));
  if (match) return match[2];

  const newId = 'dev_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
  // Set cookie for 1 year
  document.cookie = `${COOKIE_NAME}=${newId}; path=/; max-age=31536000; SameSite=Lax`;
  return newId;
}

function parseDeviceSpecs() {
  if (typeof window === 'undefined') {
    return {
      deviceType: 'desktop',
      browser: 'unknown',
      os: 'unknown',
      screenResolution: 'unknown',
    };
  }

  const ua = navigator.userAgent;
  let deviceType = 'desktop';
  if (/mobile|android|iphone|ipad|phone/i.test(ua)) {
    deviceType = /ipad|tablet/i.test(ua) ? 'tablet' : 'mobile';
  }

  let browser = 'Unknown';
  if (/chrome|crios/i.test(ua) && !/edg|opr/i.test(ua)) browser = 'Chrome';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/edg/i.test(ua)) browser = 'Edge';
  else if (/opr|opera/i.test(ua)) browser = 'Opera';

  let os = 'Unknown';
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  const screenResolution = `${window.screen.width}x${window.screen.height} (${window.devicePixelRatio || 1}dpr)`;

  return { deviceType, browser, os, screenResolution };
}

export default function TelemetryTracker() {
  const pathname = usePathname();
  const startTimeRef = useRef<number>(0);
  const currentPathRef = useRef<string>(pathname);
  const referrerRef = useRef<string>('');

  const sendTelemetry = (targetPath: string, dwellSeconds: number) => {
    if (typeof window === 'undefined' || !targetPath) return;

    const deviceId = getDeviceId();
    const specs = parseDeviceSpecs();

    const payload = JSON.stringify({
      deviceId,
      pagePath: targetPath,
      referrer: referrerRef.current || document.referrer || '',
      dwellTimeSeconds: Math.max(1, Math.round(dwellSeconds)),
      deviceType: specs.deviceType,
      browser: specs.browser,
      os: specs.os,
      screenResolution: specs.screenResolution,
      userAgent: navigator.userAgent,
    });

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon('/api/telemetry/record', blob);
    } else {
      fetch('/api/telemetry/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  };

  useEffect(() => {
    // Initial page enter
    referrerRef.current = document.referrer || '';
    startTimeRef.current = Date.now();
    currentPathRef.current = pathname;

    const handleBeforeUnload = () => {
      const dwell = (Date.now() - startTimeRef.current) / 1000;
      sendTelemetry(currentPathRef.current, dwell);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      const dwell = (Date.now() - startTimeRef.current) / 1000;
      sendTelemetry(currentPathRef.current, dwell);
    };
  }, []);

  useEffect(() => {
    if (currentPathRef.current === pathname) return;

    // Previous page dwell recorded
    const dwell = (Date.now() - startTimeRef.current) / 1000;
    sendTelemetry(currentPathRef.current, dwell);

    // Update for new page
    referrerRef.current = currentPathRef.current;
    currentPathRef.current = pathname;
    startTimeRef.current = Date.now();
  }, [pathname]);

  return null;
}
