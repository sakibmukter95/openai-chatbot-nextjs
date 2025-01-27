'use server'

import { clerkClient, currentUser } from '@clerk/nextjs'

import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16'
})

export async function AddFreeCredits() {
  const user = await currentUser()

  if (!user) {
    return { success: false, error: 'You need to sign in first.' }
  }

  await clerkClient.users.updateUserMetadata(user.id, {
    publicMetadata: {
      credits: 10
    }
  })

  return { success: true, error: null }
}

type LineItem = Stripe.Checkout.SessionCreateParams.LineItem

export async function createStripeCheckoutSession(lineItems: LineItem[]) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Specify payment method types
      mode: 'subscription', // Or 'payment' for one-time payments
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
    });

    return { sessionId: session.id, checkoutError: null };
  } catch (error) {
    return { sessionId: null, checkoutError: (error as Error).message };
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
