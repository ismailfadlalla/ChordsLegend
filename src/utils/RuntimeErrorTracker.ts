/**
 * Runtime Error Tracker for ChordsLegend
 * Helps identify and log runtime issues
 */

interface ErrorLog {
  timestamp: Date;
  error: string;
  stack?: string;
  component?: string;
  context?: any;
}

class RuntimeErrorTracker {
  private static logs: ErrorLog[] = [];
  private static maxLogs = 50;

  static logError(
    error: string | Error, 
    component?: string, 
    context?: any
  ): void {
    try {
      const errorMessage = error instanceof Error ? error.message : error;
      const stack = error instanceof Error ? error.stack : undefined;
      
      const log: ErrorLog = {
        timestamp: new Date(),
        error: errorMessage,
        stack,
        component,
        context
      };

      this.logs.unshift(log);
      
      // Keep only the most recent logs
      if (this.logs.length > this.maxLogs) {
        this.logs = this.logs.slice(0, this.maxLogs);
      }

      // Console log with emoji for easy identification
      console.error(`🚨 [${component || 'Unknown'}] Runtime Error:`, errorMessage);
      if (stack) {
        console.error('📍 Stack trace:', stack);
      }
      if (context) {
        console.error('🔍 Context:', context);
      }
    } catch (loggingError) {
      console.error('Failed to log error:', loggingError);
    }
  }

  static logWarning(
    warning: string, 
    component?: string, 
    context?: any
  ): void {
    try {
      console.warn(`⚠️ [${component || 'Unknown'}] Warning:`, warning);
      if (context) {
        console.warn('🔍 Context:', context);
      }
    } catch (loggingError) {
      console.error('Failed to log warning:', loggingError);
    }
  }

  static logInfo(
    message: string, 
    component?: string, 
    context?: any
  ): void {
    try {
      console.log(`ℹ️ [${component || 'Unknown'}] Info:`, message);
      if (context) {
        console.log('🔍 Context:', context);
      }
    } catch (loggingError) {
      console.error('Failed to log info:', loggingError);
    }
  }

  static getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  static clearLogs(): void {
    this.logs = [];
    console.log('🧹 Error logs cleared');
  }

  static getLogsAsString(): string {
    return this.logs
      .map(log => {
        const timestamp = log.timestamp.toISOString();
        const component = log.component ? `[${log.component}]` : '[Unknown]';
        const context = log.context ? `\nContext: ${JSON.stringify(log.context, null, 2)}` : '';
        const stack = log.stack ? `\nStack: ${log.stack}` : '';
        
        return `${timestamp} ${component} ${log.error}${context}${stack}`;
      })
      .join('\n\n---\n\n');
  }
}

// Safe wrapper for async operations
export const safeAsync = async <T>(
  operation: () => Promise<T>,
  component?: string,
  fallback?: T
): Promise<T | undefined> => {
  try {
    return await operation();
  } catch (error) {
    RuntimeErrorTracker.logError(error as Error, component);
    return fallback;
  }
};

// Safe wrapper for sync operations
export const safeSync = <T>(
  operation: () => T,
  component?: string,
  fallback?: T
): T | undefined => {
  try {
    return operation();
  } catch (error) {
    RuntimeErrorTracker.logError(error as Error, component);
    return fallback;
  }
};

// Global error handler setup
export const setupGlobalErrorHandling = (): void => {
  // Handle unhandled promise rejections
  if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
      RuntimeErrorTracker.logError(
        `Unhandled Promise Rejection: ${event.reason}`,
        'Global',
        { reason: event.reason }
      );
    });

    // Handle general errors
    window.addEventListener('error', (event) => {
      RuntimeErrorTracker.logError(
        event.error || event.message,
        'Global',
        { 
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      );
    });
  }

  // React Native specific error handling
  if (typeof ErrorUtils !== 'undefined') {
    const originalHandler = ErrorUtils.getGlobalHandler();
    
    ErrorUtils.setGlobalHandler((error, isFatal) => {
      RuntimeErrorTracker.logError(
        error,
        'ReactNative-Global',
        { isFatal }
      );
      
      // Call original handler
      if (originalHandler) {
        originalHandler(error, isFatal);
      }
    });
  }
};

export default RuntimeErrorTracker;
