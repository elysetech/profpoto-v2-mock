import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { createSessionCheckout } from '@/lib/stripe';
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

    // Get the session type from the query parameters
    const url = new URL(request.url);
    const sessionType = url.searchParams.get('type');
    
    if (!sessionType || !['college', 'highschool'].includes(sessionType)) {
      return NextResponse.json(
        { error: 'Invalid session type' },
        { status: 400 }
      );
    }

    // Create a checkout session
    const checkoutUrl = await createSessionCheckout(
      user.uid,
      sessionType as 'college' | 'highschool',
      user.email || ''
    );

    if (!checkoutUrl) {
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      );
    }

    // Send notification to Slack
    await sendSlackNotification('new_session', {
      studentName: user.displayName || user.email || 'Unknown',
      teacherName: 'À déterminer',
      sessionDate: 'À programmer',
      duration: sessionType === 'college' ? '90' : '90',
    });

    // Redirect to the checkout URL
    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error('Error creating session checkout:', error);
    return NextResponse.json(
      { error: 'Failed to create session checkout' },
      { status: 500 }
    );
  }
}
