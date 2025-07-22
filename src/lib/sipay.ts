import axios from 'axios';
import crypto from 'crypto';

const SIPAY_BASE_URL = process.env.SIPAY_BASE_URL || 'https://provisioning.sipay.com.tr/api';
const SIPAY_APP_ID = process.env.SIPAY_APP_ID;
const SIPAY_APP_SECRET = process.env.SIPAY_APP_SECRET;
const SIPAY_MERCHANT_KEY = process.env.SIPAY_MERCHANT_KEY;

/**
 * Generates a hash key for Sipay requests.
 *
 * THIS IS AN EDUCATED GUESS. Sipay's documentation does not specify the algorithm.
 * This is a common pattern for Turkish payment gateways.
 * You MUST verify this with Sipay support.
 *
 * @param total The total amount of the transaction.
 * @param installments The number of installments.
 * @param currency The currency code.
 * @param merchantKey The merchant key.
 * @param invoiceId The unique invoice ID.
 * @returns The generated hash key.
 */
const generateHashKey = (total: string, installments: string, currency: string, merchantKey: string, invoiceId: string): string => {
    const appSecret = process.env.SIPAY_APP_SECRET;
    if (!appSecret) {
        throw new Error('Sipay app secret is not configured.');
    }

    const data = `${total}|${installments}|${currency}|${merchantKey}|${invoiceId}`;
    const hash = crypto.createHmac('sha256', appSecret).update(data).digest('base64');
    return hash;
};


export const createSipay3DPayment = async (paymentData: any) => {
    if (!SIPAY_MERCHANT_KEY || !SIPAY_APP_ID || !SIPAY_APP_SECRET) {
        throw new Error('Sipay credentials are not configured.');
    }

    const {
        cc_holder_name,
        cc_no,
        expiry_month,
        expiry_year,
        cvv,
        currency_code,
        installments_number,
        invoice_id,
        total,
        items,
        cancel_url,
        return_url,
    } = paymentData;

    const hashKey = generateHashKey(total, installments_number, currency_code, SIPAY_MERCHANT_KEY, invoice_id);

    const formData = new URLSearchParams();
    formData.append('cc_holder_name', cc_holder_name);
    formData.append('cc_no', cc_no);
    formData.append('expiry_month', expiry_month);
    formData.append('expiry_year', expiry_year);
    formData.append('cvv', cvv);
    formData.append('currency_code', currency_code);
    formData.append('installments_number', installments_number);
    formData.append('invoice_id', invoice_id);
    formData.append('total', total);
    formData.append('merchant_key', SIPAY_MERCHANT_KEY);
    formData.append('items', JSON.stringify(items));
    formData.append('cancel_url', cancel_url);
    formData.append('return_url', return_url);
    formData.append('hash_key', hashKey);


    try {
        const response = await axios.post(`${SIPAY_BASE_URL}/paySmart3D`, formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        // The response from paySmart3D is expected to be HTML for the 3D Secure page.
        // It needs to be returned to the client to be rendered in an iframe or as a full page redirect.
        return response.data;
    } catch (error) {
        console.error('Sipay API error:', error);
        throw new Error('Failed to create Sipay 3D payment.');
    }
}; 