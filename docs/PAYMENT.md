# Stripe Payment Integration

This document outlines the integration of Stripe for handling payments within the application.

## Payment Toggle Feature

The application includes a payment toggle feature controlled by the `NEXT_PUBLIC_PAYMENT_ENABLED` environment variable. When set to `false`, the following changes occur:

- **Pricing Page**: Shows "Limited Usage Available" message instead of active pricing plans
- **AI Components**: All AI-related features are hidden (Voice AI Founder Modal, AI Founder Mode buttons)
- **Hero Section**: Shows modified messaging indicating AI features are coming soon
- **Project Editor**: AI Founder Mode button is hidden

### Environment Variable Configuration

Add this to your `.env.local` file:

```
# Payment Toggle - Controls if payment and AI features are enabled
NEXT_PUBLIC_PAYMENT_ENABLED=false
```

Set to `true` to enable full payment functionality and AI features.
Set to `false` to disable payments and AI features (limited usage mode).

## Overview

We use Stripe Checkout to process subscription payments. The flow is as follows:
1. The user selects a plan on the pricing page.
2. If the user is not logged in, they are prompted to do so.
3. A request is sent to our backend to create a Stripe Checkout session.
4. The user is redirected to the Stripe-hosted payment page.
5. After the payment is completed, Stripe sends a webhook to our server to confirm the payment.
6. The user's plan is updated in Firestore.

## Environment Variables

The following environment variables are required for the Stripe integration. These should be added to your `.env.local` file.

```
# Payment Toggle
NEXT_PUBLIC_PAYMENT_ENABLED=true

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# You will also need to create price IDs for each of your plans in the Stripe dashboard
# and add them as environment variables.
STRIPE_PRICE_ID_BASIC=price_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_UNLIMITED=price_...

# OpenAI Configuration (for AI features)
OPENAI_API_KEY=your_openai_api_key
```

**Note**: When `NEXT_PUBLIC_PAYMENT_ENABLED=false`, the Stripe and OpenAI configurations are not required.

## API Routes

### `/api/stripe/checkout`

This route is responsible for creating a Stripe Checkout session. It expects a POST request with the following JSON body:

- `planId`: The ID of the plan being purchased.
- `success_url`: The URL to redirect to on successful payment.
- `cancel_url`: The URL to redirect to on canceled payment.

It returns a JSON object with a `sessionId` property, which is the ID of the Stripe Checkout session.

### `/api/stripe/webhook`

This route handles webhooks from Stripe. It expects a POST request from Stripe's servers with a JSON body containing the event data.

The webhook is verified using the `STRIPE_WEBHOOK_SECRET`.

If the event is `checkout.session.completed`, the user's plan is updated in Firestore based on the `planId` passed in the metadata of the Checkout session.

## Webhook Handling

Stripe webhooks are used to reliably confirm payments. When a payment is successfully completed, Stripe sends a POST request to our `/api/stripe/webhook` route.

The webhook handler verifies the request using the `STRIPE_WEBHOOK_SECRET` and then updates the user's plan in Firestore. This ensures that the user's plan is upgraded even if they close their browser before being redirected to the success page. 