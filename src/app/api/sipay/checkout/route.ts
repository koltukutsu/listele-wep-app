import { NextResponse } from 'next/server';
import axios from 'axios';
import { updateUserProfile } from '~/lib/firestore';

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return new Response(null, { status: 405 });
  }

  const { amount, email, name, userId, planId } = await req.json();

  const baseUrl = process.env.SIPAY_BASE_URL || 'https://sandbox-api.sipay.com.tr';
  const merchantKey = process.env.SIPAY_MERCHANT_KEY;
  const secretKey = process.env.SIPAY_SECRET_KEY;

  if (!merchantKey || !secretKey) {
    return NextResponse.json({ error: 'Sipay merchant key or secret key is not configured.' }, { status: 500 });
  }

  const transactionId = `TX-${Date.now()}`;

  await updateUserProfile(userId, { transactionId });

  const payload = {
    merchant_key: merchantKey,
    secret_key: secretKey,
    transaction_id: transactionId,
    amount: (parseFloat(amount) * 100).toFixed(0), // kuruş cinsinden
    currency: 'TRY',
    email: email,
    name: name,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success`,
    fail_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-fail`,
    language: 'tr',
    mode: 'payment', // ödeme modu
    pass_through_data: {
        userId,
        planId,
    }
  };

  try {
    const response = await axios.post(`${baseUrl}/v1/checkout-form/generate`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.data && response.data.status === 'success') {
      const paymentUrl = response.data.data.payment_url;
      return NextResponse.json({ paymentUrl });
    } else {
      return NextResponse.json({ error: response.data.message || 'Failed to generate payment link.' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: 'Sipay API error', details: error.message }, { status: 500 });
  }
} 