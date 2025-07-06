// utils/errorHandling.ts
// In your errorHandling.ts
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
});
export function setupErrorHandling() {
  if (process.env.NODE_ENV === 'production') {
    const Sentry = require('@sentry/react-native');
    Sentry.init({
      dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
    });
  }
}