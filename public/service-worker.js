let userAgent;

addEventListener('message', (event) => {
  userAgent = event.data;
});

addEventListener('install', () => {
  self.skipWaiting();
});

addEventListener('push', async function (event) {
  console.log('Push message received.', event.data.text());

  self.registration.showNotification(
    `Today's FNBO Flex Rate: ${event.data.text()}%`,
    {
      icon: '/images/logo.png',
      vibrate: [200, 100, 200],
    }
  );
});

addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (!userAgent) {
    return;
  }

  const isChromium = /chrome/i.test(userAgent);
  const isOpera = /OPR/.test(userAgent);
  const isEdge = /Edg/.test(userAgent);
  const isFirefox = /Firefox/.test(userAgent);
  const isSafari = /OS X/.test(userAgent) && /Safari/.test(userAgent);
  const hasiPhoneInUserAgentString = /iPhone OS/.test(userAgent);
  const isMacOSSafari = isSafari && !hasiPhoneInUserAgentString;
  const isIOSSafari = isSafari && !!hasiPhoneInUserAgentString;

  if (isIOSSafari) {
    //clicking notification will focus the PWA already, so return
    return;
  }

  if (isChromium || isFirefox) {
    //clicking does nothing by default, so focus the first window with path ending in /workout
    event.waitUntil(
      clients
        .matchAll({
          type: 'window',
        })
        .then((clientList) => {
          for (const client of clientList) {
            return client.focus();
          }
          if (clients.openWindow) return clients.openWindow('/');
        })
    );
  }
});
