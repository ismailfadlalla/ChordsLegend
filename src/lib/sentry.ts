// src/lib/sentry.ts
try {
  const Sentry = require('sentry-expo');
  
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
  
  module.exports = Sentry;
} catch (error) {
  console.warn('Sentry not available:', error);
  // Export a mock Sentry object
  module.exports = {
    captureException: (error: any) => console.error('Mock Sentry:', error),
    captureMessage: (message: string) => console.log('Mock Sentry:', message),
    addBreadcrumb: (breadcrumb: any) => console.log('Mock Sentry breadcrumb:', breadcrumb),
  };
}