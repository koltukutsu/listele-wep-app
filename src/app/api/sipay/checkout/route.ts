import { NextResponse } from 'next/server';
import { updateUserProfile } from '~/lib/firestore';
import { createSipay3DPayment } from '~/lib/sipay';

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return new Response(null, { status: 405 });
  }

  const {
    amount,
    email,
    name,
        userId,
        planId,
    cc_holder_name,
    cc_no,
    expiry_month,
    expiry_year,
    cvv,
    installments_number,
  } = await req.json();

  const invoice_id = `TX-${Date.now()}`;
  await updateUserProfile(userId, { invoice_id });

  const paymentData = {
    cc_holder_name,
    cc_no,
    expiry_month,
    expiry_year,
    cvv,
    currency_code: 'TRY',
    installments_number: installments_number || '1',
    invoice_id,
    total: amount.toString(),
    items: [
      {
        name: `Listele.io ${planId} Plan`,
        price: amount.toString(),
        quantity: 1,
        description: `1-month subscription to the ${planId} plan.`,
      },
    ],
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-fail`,
  };

  try {
    const htmlResponse = await createSipay3DPayment(paymentData);
    return new Response(htmlResponse, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Sipay API error', details: error.message }, { status: 500 });
  }
} 