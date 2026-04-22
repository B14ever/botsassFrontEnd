import api from '@/lib/api';

export type PaymentInitializePayload = {
  amount?: number;
  plan_code?: string;
  return_path?: string;
};

export const initializePayment = async (payload: PaymentInitializePayload) => {
  const response = await api.post('/payment/initialize', payload);
  return response.data;
};

export const verifyPayment = async (txRef: string) => {
  const response = await api.get(`/payment/verify/${txRef}`);
  return response.data;
};
