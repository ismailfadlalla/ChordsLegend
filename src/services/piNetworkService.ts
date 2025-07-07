import { PiFeature, PiPayment, PiUser, PI_CONFIG } from '../config/piConfig';

declare global {
  interface Window {
    Pi: any;
  }
}

class PiNetworkService {
  private isInitialized = false;
  private currentUser: PiUser | null = null;

  /**
   * Initialize Pi Network SDK
   */
  async initialize(): Promise<boolean> {
    try {
      // Check if Pi SDK is available
      if (typeof window !== 'undefined' && window.Pi) {
        console.log('🥧 Pi Network SDK detected');
        this.isInitialized = true;
        return true;
      }
      
      // For React Native, we'll need to use Pi Mobile SDK
      console.log('🥧 Pi Network SDK not available - using fallback');
      return false;
    } catch (error) {
      console.error('❌ Pi Network initialization failed:', error);
      return false;
    }
  }

  /**
   * Authenticate user with Pi Network
   */
  async authenticate(): Promise<PiUser | null> {
    try {
      if (!this.isInitialized) {
        console.warn('⚠️ Pi Network not initialized');
        return null;
      }

      // Pi Network authentication flow
      const auth = await window.Pi.authenticate({
        scopes: ['payments', 'username'],
        onIncompletePaymentFound: (payment: any) => {
          console.log('💰 Incomplete payment found:', payment);
          // Handle incomplete payment
          this.handleIncompletePayment(payment);
        }
      });

      if (auth && auth.user) {
        this.currentUser = {
          uid: auth.user.uid,
          username: auth.user.username,
          accessToken: auth.accessToken,
          payments: []
        };

        console.log('✅ Pi Network authentication successful:', this.currentUser.username);
        return this.currentUser;
      }

      return null;
    } catch (error) {
      console.error('❌ Pi Network authentication failed:', error);
      return null;
    }
  }

  /**
   * Create a Pi payment for a premium feature
   */
  async createPayment(feature: PiFeature, userId: string): Promise<boolean> {
    try {
      if (!this.isInitialized || !this.currentUser) {
        console.warn('⚠️ Pi Network not ready for payments');
        return false;
      }

      const featureConfig = PI_CONFIG.FEATURES[feature];
      if (!featureConfig) {
        console.error('❌ Unknown feature:', feature);
        return false;
      }

      const payment: PiPayment = {
        amount: featureConfig.price,
        memo: `ChordsLegend: ${featureConfig.name}`,
        metadata: {
          feature,
          userId,
          timestamp: Date.now()
        }
      };

      // Create Pi payment
      const paymentId = await window.Pi.createPayment({
        amount: payment.amount,
        memo: payment.memo,
        metadata: payment.metadata
      });

      console.log('💰 Pi payment created:', paymentId);
      return true;

    } catch (error) {
      console.error('❌ Pi payment creation failed:', error);
      return false;
    }
  }

  /**
   * Check if user has purchased a specific feature
   */
  async hasPurchasedFeature(feature: PiFeature, userId: string): Promise<boolean> {
    try {
      // In a real implementation, check against your backend
      // For now, return false (user needs to purchase)
      return false;
    } catch (error) {
      console.error('❌ Feature check failed:', error);
      return false;
    }
  }

  /**
   * Handle incomplete payments
   */
  private async handleIncompletePayment(payment: any): Promise<void> {
    try {
      // Complete the payment
      await window.Pi.completePayment(payment.identifier);
      console.log('✅ Incomplete payment completed:', payment.identifier);
    } catch (error) {
      console.error('❌ Failed to complete payment:', error);
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): PiUser | null {
    return this.currentUser;
  }

  /**
   * Sign out from Pi Network
   */
  async signOut(): Promise<void> {
    try {
      if (this.isInitialized && window.Pi) {
        await window.Pi.signOut();
      }
      this.currentUser = null;
      console.log('👋 Pi Network signed out');
    } catch (error) {
      console.error('❌ Pi Network sign out failed:', error);
    }
  }

  /**
   * Check if Pi Network is available
   */
  isAvailable(): boolean {
    return this.isInitialized;
  }
}

// Export singleton instance
export const piNetworkService = new PiNetworkService();
export default piNetworkService;
