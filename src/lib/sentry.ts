// src/lib/sentry.ts
import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enableInExpoDevelopment: true, // Set to false for production-only tracking
  debug: __DEV__, // Enable debug logs only in development
  environment: __DEV__ ? 'development' : 'production',
  integrations: [
    new Sentry.Native.ReactNativeTracing({
      tracingOrigins: ['localhost', /^\//],
    }),
  ],
});