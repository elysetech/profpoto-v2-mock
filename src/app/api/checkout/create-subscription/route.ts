import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { createSubscriptionCheckout, SubscriptionPlan } from '@/lib/stripe';
import { sendSlackNotification } from '@/lib/slack';

export async function GET(request: NextRequest) {
  try {
    // Get the current user
    const user = auth.currentUser;
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get the plan from the query parameters
    const url = new URL(request.url);
    const plan = url.searchParams.get('plan');
    
    if (!plan || !['standard', 'premium'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    // Create a checkout session
    const checkoutUrl = await createSubscriptionCheckout(
      user.uid,
      plan === 'standard' ? SubscriptionPlan.STANDARD : SubscriptionPlan.PREMIUM,
      user.email || ''
    );

    if (!checkoutUrl) {
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      );
    }

    // Send notification to Slack
    await sendSlackNotification('payment', {
      customerName: user.displayName || user.email || 'Unknown',
      email: user.email || 'Unknown',
      amount: plan === 'standard' ? 150 : 175,
      plan: plan === 'standard' ? 'Standard' : 'Premium',
    });

    // Redirect to the checkout URL
    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error('Error creating subscription checkout:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription checkout' },
      { status: 500 }
    );
  }
}
