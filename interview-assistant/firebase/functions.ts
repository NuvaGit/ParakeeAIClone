import { httpsCallable } from 'firebase/functions';
import { functions } from './config';

// Payment functions
export const createCheckoutSession = httpsCallable(
  functions,
  'createCheckoutSession'
);

export const createPortalSession = httpsCallable(
  functions,
  'createPortalSession'
);

// Subscription functions
export const getCurrentSubscription = httpsCallable(
  functions,
  'getCurrentSubscription'
);

export const cancelSubscription = httpsCallable(
  functions,
  'cancelSubscription'
);