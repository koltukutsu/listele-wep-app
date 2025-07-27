export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const isPaymentEnabled = () => {
  return process.env.NEXT_PUBLIC_PAYMENT_ENABLED === 'true';
}; 