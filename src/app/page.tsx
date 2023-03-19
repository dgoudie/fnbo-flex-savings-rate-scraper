'use client';

import { FormEventHandler, useCallback, useEffect, useState } from 'react';

import styles from './page.module.scss';

export default function Home() {
  const [email, setEmail] = useState('');

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      const fn = async () => {
        event.preventDefault();
        await setupNotifications(email);
        alert('✅ Notifications Setup.');
      };
      fn();
    },
    [email]
  );

  useEffect(() => {
    const fn = async () => {
      const reg = await navigator.serviceWorker.register('/service-worker.js');
      reg.active?.postMessage(window.navigator.userAgent);
    };
    fn();
  }, []);

  return (
    <form className={styles.main} onSubmit={onSubmit}>
      <input
        className={styles.email}
        type='email'
        required
        placeholder='email'
        autoFocus
        defaultValue={email}
        onInput={(event) => setEmail((event.target as HTMLInputElement).value)}
      />
      <button type='submit' className={styles.button}>
        Setup Notifications
      </button>
    </form>
  );
}

const unsubscribe = async () => {
  return navigator.serviceWorker.ready
    .then((reg) => reg.pushManager.getSubscription().catch(() => null))
    .then((sub) => {
      if (sub) sub.unsubscribe();
    });
};

const setupNotifications = async (email: string) => {
  // Check if desktop notifications are supported
  if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
    console.warn("Notifications aren't supported.");
    return;
  }
  await Notification.requestPermission();
  if (Notification.permission !== 'granted') {
    console.warn('The user has blocked notifications.');
    return;
  }

  // Check if push API is supported
  if (!('PushManager' in window)) {
    console.warn("Push messaging isn't supported.");
    return;
  }
  const serviceWorkerRegistration = await navigator.serviceWorker.ready;
  let subscription;
  try {
    subscription =
      await serviceWorkerRegistration.pushManager.getSubscription();
  } catch (e) {
    if ((e as Error).message.includes('No connection to push daemon')) {
      console.warn("Push messaging isn't supported.");
      return;
    }
  }
  if (!!subscription) {
    await unsubscribe();
  }
  const applicationServerKey = await fetch('/api/push/vapid_public_key').then(
    (res) => res.arrayBuffer()
  );
  subscription = await serviceWorkerRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: new Uint8Array(applicationServerKey),
  });

  const subscriptionBase64 = btoa(JSON.stringify(subscription));
  await fetch(`/api/push/subscribe`, {
    method: 'POST',
    body: JSON.stringify({ subscriptionBase64, email }),
    headers: { 'content-type': 'application/json' },
  });
};
