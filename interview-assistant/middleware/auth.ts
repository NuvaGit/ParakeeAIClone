// File: middleware/auth.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/firebase/admin';

export async function withAuth(
  request: NextRequest,
  handler: (req: NextRequest, uid: string) => Promise<NextResponse>
): Promise<NextResponse> {
  // Get the authorization header
  const authHeader = request.headers.get('Authorization');
  
  // Check if the Authorization header exists and is properly formatted
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Unauthorized: Missing or invalid Authorization header' },
      { status: 401 }
    );
  }
  
  // Extract the token
  const token = authHeader.split('Bearer ')[1];
  
  try {
    // Verify the token with Firebase
    const decodedToken = await auth.verifyIdToken(token);
    const uid = decodedToken.uid;
    
    // Call the handler with the authenticated user's UID
    return await handler(request, uid);
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Unauthorized: Invalid or expired token' },
      { status: 401 }
    );
  }
}

export async function validateUserCredits(uid: string): Promise<{ 
  hasPermission: boolean; 
  message?: string;
  hasActiveSubscription?: boolean;
  credits?: number;
}> {
  try {
    // Import the Firestore db here to avoid circular dependencies
    const { db } = await import('@/firebase/admin');
    
    // Get the user document
    const userDoc = await db.collection('users').doc(uid).get();
    
    // Check if the user exists
    if (!userDoc.exists) {
      return { hasPermission: false, message: 'User not found' };
    }
    
    const userData = userDoc.data();
    const hasActiveSubscription = userData?.hasActiveSubscription || false;
    const credits = userData?.credits || 0;
    
    // If the user has an active subscription or enough credits, allow access
    if (hasActiveSubscription || credits > 0) {
      return { 
        hasPermission: true,
        hasActiveSubscription,
        credits
      };
    }
    
    // Otherwise, deny access
    return { 
      hasPermission: false, 
      message: 'Insufficient credits. Please upgrade your plan or purchase more credits.',
      hasActiveSubscription,
      credits
    };
  } catch (error) {
    console.error('Error validating user credits:', error);
    return { 
      hasPermission: false, 
      message: 'Failed to verify authorization' 
    };
  }
}