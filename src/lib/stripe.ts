/**
 * Stripe payment service
 * 
 * This service handles Stripe payment processing and subscription management.
 */

import { sendSlackNotification } from './slack';

// Define subscription plan types
export enum SubscriptionPlan {
  FREE = 'free',
  STANDARD = 'standard',
  PREMIUM = 'premium',
}

// Define subscription plan details
export const SUBSCRIPTION_PLANS = {
  [SubscriptionPlan.FREE]: {
    name: 'Essai gratuit',
    price: 0,
    features: {
      documentsPerMonth: 5,
      teacherSessionsPerMonth: 1,
      teacherSessionDuration: 30, // minutes
      aiQuestionsPerMonth: 5,
      duration: 7, // days
    },
  },
  [SubscriptionPlan.STANDARD]: {
    name: 'Standard',
    price: 150,
    features: {
      documentsPerMonth: 20,
      teacherSessionsPerMonth: 4,
      teacherSessionDuration: 60, // minutes
      aiChat: 'unlimited',
      trialDays: 7,
    },
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID,
  },
  [SubscriptionPlan.PREMIUM]: {
    name: 'Premium',
    price: 175,
    features: {
      documentsPerMonth: 'unlimited',
      teacherSessionsPerMonth: 6,
      teacherSessionDuration: 60, // minutes
      aiChat: 'unlimited',
      trialDays: 7,
    },
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID,
  },
};

// Define individual session prices
export const SESSION_PRICES = {
  college: {
    name: 'Cours pour collégiens',
    price: 25,
    duration: 90, // minutes
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_COLLEGE_SESSION_PRICE_ID,
  },
  highschool: {
    name: 'Cours pour lycéens',
    price: 30,
    duration: 90, // minutes
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_HIGHSCHOOL_SESSION_PRICE_ID,
  },
};

/**
 * Create a Stripe checkout session for subscription
 * 
 * @param userId User ID
 * @param plan Subscription plan
 * @param customerEmail Customer email
 * @returns Checkout session URL
 */
export async function createSubscriptionCheckout(
  userId: string,
  plan: SubscriptionPlan,
  customerEmail: string
): Promise<string | null> {
  try {
    const planDetails = SUBSCRIPTION_PLANS[plan];
    
    if (!planDetails || !planDetails.stripePriceId) {
      throw new Error(`Invalid plan or missing Stripe price ID for plan: ${plan}`);
    }
    
    // This would be implemented with actual Stripe API calls
    // For now, we'll just return a mock URL
    console.log(`Creating subscription checkout for user ${userId}, plan ${plan}`);
    
    // In a real implementation, you would create a Stripe checkout session
    // and return the session URL
    
    // Mock successful checkout
    return `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id=mock_session_id`;
  } catch (error) {
    console.error('Error creating subscription checkout:', error);
    return null;
  }
}

/**
 * Create a Stripe checkout session for a single session
 * 
 * @param userId User ID
 * @param sessionType Session type (college or highschool)
 * @param customerEmail Customer email
 * @returns Checkout session URL
 */
export async function createSessionCheckout(
  userId: string,
  sessionType: 'college' | 'highschool',
  customerEmail: string
): Promise<string | null> {
  try {
    const sessionDetails = SESSION_PRICES[sessionType];
    
    if (!sessionDetails || !sessionDetails.stripePriceId) {
      throw new Error(`Invalid session type or missing Stripe price ID for type: ${sessionType}`);
    }
    
    // This would be implemented with actual Stripe API calls
    // For now, we'll just return a mock URL
    console.log(`Creating session checkout for user ${userId}, type ${sessionType}`);
    
    // In a real implementation, you would create a Stripe checkout session
    // and return the session URL
    
    // Mock successful checkout
    return `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id=mock_session_id`;
  } catch (error) {
    console.error('Error creating session checkout:', error);
    return null;
  }
}

/**
 * Handle Stripe webhook events
 * 
 * @param event Stripe webhook event
 * @returns Success status
 */
export async function handleStripeWebhook(event: any): Promise<boolean> {
  try {
    // This would be implemented with actual Stripe webhook handling
    // For now, we'll just log the event type
    console.log(`Handling Stripe webhook event: ${event.type}`);
    
    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        // Process successful checkout
        const session = event.data.object;
        
        // Send notification to Slack
        await sendSlackNotification('payment', {
          customerName: session.customer_details?.name || 'Unknown',
          email: session.customer_details?.email || 'Unknown',
          amount: session.amount_total / 100, // Convert from cents to euros
          plan: session.metadata?.plan || 'Unknown',
        });
        
        break;
        
      case 'invoice.paid':
        // Process successful invoice payment
        const invoice = event.data.object;
        
        // Send notification to Slack
        await sendSlackNotification('payment', {
          customerName: invoice.customer_name || 'Unknown',
          email: invoice.customer_email || 'Unknown',
          amount: invoice.amount_paid / 100, // Convert from cents to euros
          plan: invoice.lines.data[0]?.description || 'Unknown',
        });
        
        break;
        
      case 'customer.subscription.created':
        // Process new subscription
        console.log('New subscription created');
        break;
        
      case 'customer.subscription.updated':
        // Process subscription update
        console.log('Subscription updated');
        break;
        
      case 'customer.subscription.deleted':
        // Process subscription cancellation
        console.log('Subscription cancelled');
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error handling Stripe webhook:', error);
    return false;
  }
}
