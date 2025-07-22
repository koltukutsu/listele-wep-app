import { NextResponse } from 'next/server';
import { getUserByTransactionId, updateUserProfile } from '~/lib/firestore';
import crypto from 'crypto';

/**
 * Generates a hash key for Sipay webhook verification.
 *
 * THIS IS AN EDUCATED GUESS. Sipay's documentation does not specify the algorithm.
 * This is a common pattern for Turkish payment gateways.
 * You MUST verify this with Sipay support.
 *
 * @param invoiceId The unique invoice ID.
 * @param status The status of the transaction.
 * @param netAmount The net amount of the transaction.
 * @returns The generated hash key.
 */
const generateWebhookHashKey = (invoiceId: string, status: string, netAmount: string): string => {
    const appSecret = process.env.SIPAY_APP_SECRET;
    if (!appSecret) {
        throw new Error('Sipay app secret is not configured.');
    }

    const data = `${invoiceId}|${status}|${netAmount}`;
    const hash = crypto.createHmac('sha256', appSecret).update(data).digest('base64');
    return hash;
}


export async function POST(req: Request) {
    const formData = await req.formData();
    const invoice_id = formData.get('invoice_id') as string;
    const status = formData.get('status') as string;
    const hash_key = formData.get('hash_key') as string;
    const net_amount = formData.get('net_amount') as string;

    const expected_hash_key = generateWebhookHashKey(invoice_id, status, net_amount);

    if (hash_key !== expected_hash_key) {
        return new Response('Invalid hash key', { status: 401 });
    }

    if (status === 'success') {
        const user = await getUserByTransactionId(invoice_id);
        if (user) {
            // This is where you would determine the plan based on the invoice or other data.
            // For now, I'll assume a 'pro' plan.
            await updateUserProfile(user.uid, { plan: 'pro' });
        }
    }

    return new Response('OK', { status: 200 });
} 