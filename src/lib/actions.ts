'use server'

import { clerkClient, currentUser } from '@clerk/nextjs'

import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16'
})

export async function AddFreeCredits() {
  const user = await currentUser();

  if (!user) {
    return { success: false, error: "You need to sign in first." };
  }

  const currentCredits = typeof user.publicMetadata?.credits === 'number' ? user.publicMetadata.credits : 0;
  await clerkClient.users.updateUserMetadata(user.id, {
    publicMetadata: {
      credits: currentCredits + 10,
    },
  });

  return { success: true, error: null };
}

type LineItem = Stripe.Checkout.SessionCreateParams.LineItem

export async function createStripeCheckoutSession(lineItems: LineItem[]) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription", // Or 'payment' for one-time payments
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
    });

    return { sessionId: session.id, checkoutError: null };
  } catch (error) {
    console.error("Error creating Stripe session:", error); // Log the actual error for debugging
    return { sessionId: null, checkoutError: (error as Error).message || "Unknown error occurred" };
  }
}

export async function retrieveStripeCheckoutSession(sessionId: string) {
  if (!sessionId) {
    return { success: false, error: 'No session ID provided.' }
  }

  const user = await currentUser()
  if (!user) {
    return { success: false, error: 'You need to sign in first.' }
  }

  const previousCheckoutSessionIds = Array.isArray(
    user.publicMetadata.checkoutSessionIds
  )
    ? user.publicMetadata.checkoutSessionIds
    : []

  if (previousCheckoutSessionIds.includes(sessionId)) {
    return {
      success: true,
      error: null
    }
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['subscription']
  })

  await clerkClient.users.updateUserMetadata(user.id, {
    publicMetadata: {
      credits: 100,
      checkoutSessionIds: [...previousCheckoutSessionIds, sessionId],
      stripeCustomerId: session.customer,
      stripeSubscriptionId:
        typeof session.subscription === 'string'
          ? session.subscription
          : session.subscription?.id,
      stripeCurrentPeriodEnd:
        typeof session.subscription === 'string'
          ? undefined
          : session.subscription?.current_period_end
    }
  })

  return { success: true, error: null }
}
