import type { PropsWithChildren } from 'react';
import { ScrollViewStyleReset } from 'expo-router/html';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#F97316" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="채윤's Diary" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/yunistudydiary/manifest.json" />
        <link rel="apple-touch-icon" href="/yunistudydiary/icons/icon-192.png" />
        <ScrollViewStyleReset />
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/yunistudydiary/sw.js');
              });
              var reloading = false;
              navigator.serviceWorker.addEventListener('controllerchange', function() {
                if (reloading) return;
                reloading = true;
                window.location.reload();
              });
            }
          `
        }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
