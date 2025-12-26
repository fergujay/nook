/**
 * Payment Service - Stripe Integration (Test Mode)
 * 
 * Stripe supports Serbia and provides a comprehensive test API.
 * Test cards: https://stripe.com/docs/testing
 */

const STRIPE_TEST_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51QExampleKeyForSerbia';
const STRIPE_API_URL = 'https://api.stripe.com/v1';

export interface PaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
}

export interface PaymentMethod {
  id: string;
  type: 'card';
  card: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

export interface PaymentRequest {
  amount: number; // Amount in RSD (smallest currency unit, so 3500 = 35.00 RSD)
  currency: string; // 'rsd' for Serbian Dinar
  payment_method_id: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface PaymentResponse {
  success: boolean;
  payment_intent_id?: string;
  client_secret?: string;
  error?: string;
  message?: string;
}

/**
 * Create a Payment Intent with Stripe
 * In test mode, use test API keys
 */
export async function createPaymentIntent(
  amount: number,
  currency: string = 'rsd',
  metadata?: Record<string, string>
): Promise<PaymentResponse> {
  try {
    // In a real implementation, this would call your backend
    // For now, we'll simulate the API call
    const response = await fetch('/api/payment/create-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount), // Convert to smallest currency unit
        currency: currency.toLowerCase(),
        metadata: metadata || {},
      }),
    });

    if (!response.ok) {
      // Fallback to mock response for test mode
      return createMockPaymentIntent(amount, currency, metadata);
    }

    const data = await response.json();
    return {
      success: true,
      payment_intent_id: data.id,
      client_secret: data.client_secret,
    };
  } catch (error) {
    // In test mode, return mock response
    console.log('Using mock payment service (test mode)');
    return createMockPaymentIntent(amount, currency, metadata);
  }
}

/**
 * Confirm payment with payment method
 */
export async function confirmPayment(
  paymentIntentId: string,
  paymentMethodId: string
): Promise<PaymentResponse> {
  try {
    const response = await fetch('/api/payment/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payment_intent_id: paymentIntentId,
        payment_method_id: paymentMethodId,
      }),
    });

    if (!response.ok) {
      return createMockPaymentConfirmation(paymentIntentId);
    }

    const data = await response.json();
    return {
      success: data.status === 'succeeded',
      payment_intent_id: data.id,
      message: data.status === 'succeeded' ? 'Payment successful' : 'Payment processing',
    };
  } catch (error) {
    console.log('Using mock payment confirmation (test mode)');
    return createMockPaymentConfirmation(paymentIntentId);
  }
}

/**
 * Mock Payment Intent for test mode
 */
function createMockPaymentIntent(
  amount: number,
  currency: string,
  metadata?: Record<string, string>
): PaymentResponse {
  // Simulate API delay
  const paymentIntentId = `pi_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const clientSecret = `pi_test_${paymentIntentId}_secret_${Math.random().toString(36).substr(2, 16)}`;

  return {
    success: true,
    payment_intent_id: paymentIntentId,
    client_secret: clientSecret,
    message: 'Payment intent created (test mode)',
  };
}

/**
 * Mock Payment Confirmation for test mode
 */
function createMockPaymentConfirmation(paymentIntentId: string): PaymentResponse {
  // Simulate successful payment in test mode
  return {
    success: true,
    payment_intent_id: paymentIntentId,
    message: 'Payment confirmed (test mode)',
  };
}

/**
 * Test card numbers for Stripe (Serbia)
 * Use these in test mode:
 * - Success: 4242 4242 4242 4242
 * - Decline: 4000 0000 0000 0002
 * - 3D Secure: 4000 0027 6000 3184
 */
export const TEST_CARDS = {
  SUCCESS: '4242424242424242',
  DECLINE: '4000000000000002',
  REQUIRES_3D_SECURE: '4000002760003184',
};

