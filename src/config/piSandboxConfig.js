/**
 * Pi Network Sandbox Configuration
 * This file handles Pi Browser detection and sandbox mode setup
 */

// Pi Network sandbox configuration
const PI_SANDBOX_CONFIG = {
  // IMPORTANT: Set this to TRUE for Pi Network sandbox testing
  SANDBOX_MODE: true,
  
  // Pi Network app configuration
  APP_ID: 'chords-legend',
  APP_NAME: 'ChordsLegend',
  
  // Sandbox URLs
  SANDBOX_URL: 'https://sandbox.minepi.com/app/chords-legend',
  
  // Detection methods
  isPiBrowser: () => {
    // Check if running in Pi Browser environment
    return (
      typeof window !== 'undefined' && 
      (
        window.navigator.userAgent.includes('PiBrowser') ||
        window.location.hostname.includes('minepi.com') ||
        window.location.hostname.includes('pi.network') ||
        // Check for Pi-specific global objects
        window.Pi !== undefined ||
        // Check for sandbox environment
        window.location.href.includes('sandbox.minepi.com')
      )
    );
  },
  
  isSandboxMode: () => {
    return (
      PI_SANDBOX_CONFIG.SANDBOX_MODE ||
      (typeof window !== 'undefined' && window.location.href.includes('sandbox.minepi.com'))
    );
  },
  
  // Get current environment
  getEnvironment: () => {
    if (PI_SANDBOX_CONFIG.isSandboxMode()) {
      return 'sandbox';
    } else if (PI_SANDBOX_CONFIG.isPiBrowser()) {
      return 'production';
    } else {
      return 'development';
    }
  }
};

/**
 * Initialize Pi Browser integration
 * This function sets up the Pi SDK and handles authentication
 */
export const initializePiBrowser = async () => {
  try {
    // Check if we're in a Pi Browser environment
    if (!PI_SANDBOX_CONFIG.isPiBrowser() && !PI_SANDBOX_CONFIG.isSandboxMode()) {
      console.log('Not running in Pi Browser environment');
      return false;
    }

    console.log(`Initializing Pi Browser in ${PI_SANDBOX_CONFIG.getEnvironment()} mode`);
    
    // Wait for Pi SDK to be available
    if (typeof window !== 'undefined' && window.Pi) {
      try {
        // Initialize Pi SDK
        await window.Pi.init({
          version: "2.0",
          sandbox: PI_SANDBOX_CONFIG.isSandboxMode()
        });
        
        console.log('Pi SDK initialized successfully');
        
        // Set up Pi authentication if in sandbox mode
        if (PI_SANDBOX_CONFIG.isSandboxMode()) {
          console.log('Running in Pi Network sandbox mode');
          
          // You can add sandbox-specific initialization here
          // For example, auto-authenticate for testing
          try {
            const auth = await window.Pi.authenticate(['payments', 'username'], {
              onIncompletePaymentFound: (payment) => {
                console.log('Incomplete payment found:', payment);
              }
            });
            console.log('Pi authentication successful:', auth);
          } catch (authError) {
            console.log('Pi authentication not required in current context:', authError.message);
          }
        }
        
        return true;
      } catch (error) {
        console.error('Error initializing Pi SDK:', error);
        return false;
      }
    } else {
      // Pi SDK not available, but we're in the right environment
      console.log('Pi SDK not yet available, but in Pi environment');
      return true;
    }
  } catch (error) {
    console.error('Error in Pi Browser initialization:', error);
    return false;
  }
};

/**
 * Create a Pi payment
 * This function handles Pi Network payments
 */
export const createPiPayment = async (amount, memo, metadata = {}) => {
  try {
    if (!window.Pi) {
      throw new Error('Pi SDK not available');
    }

    const payment = await window.Pi.createPayment({
      amount: amount,
      memo: memo,
      metadata: {
        ...metadata,
        app: PI_SANDBOX_CONFIG.APP_NAME,
        environment: PI_SANDBOX_CONFIG.getEnvironment()
      }
    });

    console.log('Pi payment created:', payment);
    return payment;
  } catch (error) {
    console.error('Error creating Pi payment:', error);
    throw error;
  }
};

/**
 * Get Pi user information
 */
export const getPiUser = async () => {
  try {
    if (!window.Pi) {
      throw new Error('Pi SDK not available');
    }

    const user = await window.Pi.authenticate(['username'], {
      onIncompletePaymentFound: (payment) => {
        console.log('Incomplete payment found:', payment);
      }
    });

    console.log('Pi user information:', user);
    return user;
  } catch (error) {
    console.error('Error getting Pi user:', error);
    throw error;
  }
};

// Log current configuration on load
if (typeof window !== 'undefined') {
  console.log('Pi Sandbox Configuration:', {
    sandboxMode: PI_SANDBOX_CONFIG.isSandboxMode(),
    isPiBrowser: PI_SANDBOX_CONFIG.isPiBrowser(),
    environment: PI_SANDBOX_CONFIG.getEnvironment(),
    userAgent: window.navigator.userAgent,
    location: window.location.href
  });
}

export default PI_SANDBOX_CONFIG;
