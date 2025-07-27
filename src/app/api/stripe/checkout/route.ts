import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '~/lib/firebase-admin';
import { getUserProfile, updateUserProfile } from '~/lib/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-06-30.basil',
});

export async function POST(req: Request) {
    const { planId, success_url, cancel_url } = await req.json();
    const authToken = req.headers.get('Authorization')?.split('Bearer ')[1];

    if (!authToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const decodedToken = await auth.verifyIdToken(authToken);
        const { uid } = decodedToken;
        const user = await getUserProfile(uid);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        let stripeCustomerId = user.stripeCustomerId;

        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({ email: user.email });
            stripeCustomerId = customer.id;
            await updateUserProfile(uid, { stripeCustomerId });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: process.env[`STRIPE_PRICE_ID_${planId.toUpperCase()}`],
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            customer: stripeCustomerId,
            success_url,
            cancel_url: `${cancel_url}?planId=${planId}`,
            metadata: {
                userId: uid,
                planId,
            }
        });

        return NextResponse.json({ sessionId: session.id });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
} 