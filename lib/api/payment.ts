import api from '@/lib/api';

export const initializePayment = async (amount: number) => {
  const response = await api.post('/payment/initialize', { amount });
  return response.data;
};

export const verifyPayment = async (txRef: string) => {
  const response = await api.get(`/payment/verify/${txRef}`);
  return response.data;
};
