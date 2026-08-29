import "server-only";

export type AsaasPayment = {
  id: string;
  customer: string;
  subscription?: string | null;
  billingType: string;
  status: string;
  value: number;
  dueDate: string;
  invoiceUrl?: string | null;
  bankSlipUrl?: string | null;
  confirmedDate?: string | null;
  paymentDate?: string | null;
  clientPaymentDate?: string | null;
};

export type AsaasPaymentListResponse = {
  data: AsaasPayment[];
  totalCount: number;
  hasMore: boolean;
};
