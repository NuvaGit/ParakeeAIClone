import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// For Stripe integration - you'll need to install the Stripe package:
// Inside the functions directory: npm install stripe

import Stripe from 'stripe';
const stripe = new Stripe(functions.config().stripe.secret, {
  apiVersion: '2022-11-15',
});

// Create a checkout session for subscription
export const createCheckoutSession = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to create a checkout session'
    );
  }

  const { priceId, successUrl, cancelUrl } = data;
  const userId = context.auth.uid;

  try {
    // Get or create the customer
    const userRecord = await admin.firestore().collection('users').doc(userId).get();
    let customerId = userRecord.data()?.stripeCustomerId;

    if (!customerId) {
      // Get user details
      const user = await admin.auth().getUser(userId);
      
      // Create a Stripe customer
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        metadata: {
          firebaseUserId: userId,
        },
      });
      
      customerId = customer.id;
      
      // Update user with Stripe customer ID
      await admin.firestore().collection('users').doc(userId).set({
        stripeCustomerId: customerId,
      }, { merge: true });
    }

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return { url: session.url };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Error creating checkout session'
    );
  }
});

// Create a portal session for managing subscription
export const createPortalSession = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to access the customer portal'
    );
  }

  const userId = context.auth.uid;
  const { returnUrl } = data;

  try {
    // Get the Stripe customer ID
    const userRecord = await admin.firestore().collection('users').doc(userId).get();
    const customerId = userRecord.data()?.stripeCustomerId;

    if (!customerId) {
      throw new functions.https.HttpsError(
        'not-found',
        'No Stripe customer found for this user'
      );
    }

    // Create a customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return { url: session.url };
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Error creating portal session'
    );
  }
});

// Get current subscription
export const getCurrentSubscription = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to check subscription status'
    );
  }

  const userId = context.auth.uid;

  try {
    // Get the Stripe customer ID
    const userRecord = await admin.firestore().collection('users').doc(userId).get();
    const customerId = userRecord.data()?.stripeCustomerId;

    if (!customerId) {
      return { subscription: null };
    }

    // Get subscriptions for the customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return { subscription: null };
    }

    return { subscription: subscriptions.data[0] };
  } catch (error) {
    console.error('Error getting subscription:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Error getting subscription'
    );
  }
});

// Cancel subscription
export const cancelSubscription = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to cancel a subscription'
    );
  }

  const userId = context.auth.uid;

  try {
    // Get the subscription ID
    const subscriptionDoc = await admin.firestore().collection('subscriptions').doc(userId).get();
    const subscriptionId = subscriptionDoc.data()?.stripeSubscriptionId;

    if (!subscriptionId) {
      throw new functions.https.HttpsError(
        'not-found',
        'No active subscription found'
      );
    }

    // Cancel the subscription
    await stripe.subscriptions.del(subscriptionId);

    // Update subscription status in Firestore
    await admin.firestore().collection('subscriptions').doc(userId).update({
      status: 'canceled',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Error canceling subscription'
    );
  }
});

// Webhook to handle Stripe events
export const stripeWebhook = functions.https.onRequest(async (request, response) => {
  const webhookSecret = functions.config().stripe.webhook_secret;
  const signature = request.headers['stripe-signature'] as string;

  try {
    const event = stripe.webhooks.constructEvent(
      request.rawBody,
      signature,
      webhookSecret
    );

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Add the subscription info to Firestore
        if (session.customer && session.subscription) {
          await handleSuccessfulSubscription(
            session.customer.toString(),
            session.subscription.toString()
          );
        }
        break;
      }
      
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        if (subscription.customer) {
          await updateSubscriptionStatus(
            subscription.customer.toString(),
            subscription
          );
        }
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    response.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    response.status(400).send(`Webhook Error: ${error.message}`);
  }
});

// Helper functions for webhook handling
async function handleSuccessfulSubscription(
  customerId: string,
  subscriptionId: string
) {
  try {
    // Get the subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    // Find the Firebase user associated with this customer
    const userQuery = await admin
      .firestore()
      .collection('users')
      .where('stripeCustomerId', '==', customerId)
      .limit(1)
      .get();
      
    if (userQuery.empty) {
      console.error('No user found with Stripe customer ID:', customerId);
      return;
    }
    
    const userId = userQuery.docs[0].id;
    
    // Add/update subscription data in Firestore
    await admin.firestore().collection('subscriptions').doc(userId).set({
      userId,
      stripeSubscriptionId: subscriptionId,
      status: subscription.status,
      priceId: subscription.items.data[0].price.id,
      interval: subscription.items.data[0].price.recurring?.interval,
      currentPeriodStart: admin.firestore.Timestamp.fromMillis(subscription.current_period_start * 1000),
      currentPeriodEnd: admin.firestore.Timestamp.fromMillis(subscription.current_period_end * 1000),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    
    // Update user's subscription status
    await admin.firestore().collection('users').doc(userId).set({
      hasActiveSubscription: true,
      subscriptionStatus: subscription.status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    
  } catch (error) {
    console.error('Error handling successful subscription:', error);
  }
}

async function updateSubscriptionStatus(
  customerId: string,
  subscription: Stripe.Subscription
) {
  try {
    // Find the Firebase user associated with this customer
    const userQuery = await admin
      .firestore()
      .collection('users')
      .where('stripeCustomerId', '==', customerId)
      .limit(1)
      .get();
      
    if (userQuery.empty) {
      console.error('No user found with Stripe customer ID:', customerId);
      return;
    }
    
    const userId = userQuery.docs[0].id;
    
    // Update subscription data in Firestore
    await admin.firestore().collection('subscriptions').doc(userId).set({
      status: subscription.status,
      currentPeriodStart: admin.firestore.Timestamp.fromMillis(subscription.current_period_start * 1000),
      currentPeriodEnd: admin.firestore.Timestamp.fromMillis(subscription.current_period_end * 1000),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    
    // Update user's subscription status
    await admin.firestore().collection('users').doc(userId).set({
      hasActiveSubscription: subscription.status === 'active',
      subscriptionStatus: subscription.status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    
  } catch (error) {
    console.error('Error updating subscription status:', error);
  }
}