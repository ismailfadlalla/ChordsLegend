// utils/errorHandling.ts
// Safe error handling with optional Sentry

let Sentry: any = null;

try {
  Sentry = require('@sentry/react-native');
  
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  });
} catch (error) {
  console.warn('Sentry not available:', error);
  Sentry = {
    captureException: (error: any) => console.error('Mock Sentry:', error),
    captureMessage: (message: string) => console.log('Mock Sentry:', message),
  };
}

export function setupErrorHandling() {
  if (process.env.NODE_ENV === 'production' && Sentry) {
    try {
      Sentry.init({
        dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
        environment: process.env.NODE_ENV,
      });
    } catch (error) {
      console.warn('Could not initialize Sentry:', error);
    }
  }
}