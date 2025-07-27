import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateUserProfile } from '~/lib/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-06-30.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    const buf = await req.text();
    const sig = req.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err: any) {
        return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
    }

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session;
            const { userId, planId } = session.metadata!;
            
            await updateUserProfile(userId, { plan: planId as any });
            break;
        default:
            console.warn(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
} 