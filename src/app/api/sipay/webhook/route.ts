import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { updateUserProfile } from '~/lib/firestore';

export async function POST(req: Request) {
    const rawBody = await req.text();
    const signature = req.headers.get('x-sipay-signature');
    const secretKey = process.env.SIPAY_SECRET_KEY;

    if (!secretKey) {
        return NextResponse.json({ error: 'Sipay secret key is not configured.' }, { status: 500 });
    }

    const expectedSignature = crypto
        .createHmac('sha512', secretKey)
        .update(rawBody)
        .digest('hex');

    if (signature !== expectedSignature) {
        return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 });
    }

    const data = JSON.parse(rawBody);

    if (data.status === 'success') {
        const { userId, planId } = data.pass_through_data;
        await updateUserProfile(userId, { plan: planId });
    }

    return NextResponse.json({ status: 'ok' });
} 