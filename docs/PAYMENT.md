# Sipay Payment Integration

This document outlines the integration of Sipay for handling payments within the application.

## Overview

We use Sipay's Checkout Link API to process one-time payments. The flow is as follows:
1. The user selects a plan on the billing page.
2. A request is sent to our backend to generate a Sipay checkout link.
3. The user is redirected to the Sipay payment page.
4. After the payment is completed, Sipay sends a webhook to our server to confirm the payment.
5. The user's plan is updated in Firestore.

## Environment Variables

The following environment variables are required for the Sipay integration. These should be added to your `.env.local` file.

```
SIPAY_MERCHANT_KEY=your_merchant_key
SIPAY_SECRET_KEY=your_secret_key
SIPAY_BASE_URL=https://api.sipay.com.tr
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
For testing, you can use the Sipay sandbox URL: `https://sandbox-api.sipay.com.tr`

## API Routes

### `/api/sipay/checkout`

This route is responsible for generating a Sipay checkout link. It expects a POST request with the following JSON body:

- `amount`: The amount to be charged.
- `email`: The user's email address.
- `name`: The user's name.
- `userId`: The user's ID.
- `planId`: The ID of the plan being purchased.

It returns a JSON object with a `paymentUrl` property, which is the URL to the Sipay checkout page.

### `/api/sipay/webhook`

This route handles webhooks from Sipay. It expects a POST request from Sipay's servers with a JSON body containing the payment status.

The webhook is verified using an HMAC-SHA512 signature. The signature is passed in the `x-sipay-signature` header.

If the payment is successful, the user's plan is updated in Firestore based on the `planId` passed in the `pass_through_data` of the original checkout request.

## Webhook Handling

Sipay webhooks are used to reliably confirm payments. When a payment is successfully completed, Sipay sends a POST request to our `/api/sipay/webhook` route.

The webhook handler verifies the request using the `SIPAY_SECRET_KEY` and then updates the user's plan in Firestore. This ensures that the user's plan is upgraded even if they close their browser before being redirected to the success page. 