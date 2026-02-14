export interface Customer {
  id: string;
  name: string;
  nationalCode: string;
  phone: string;
  email: string;
  birthDate: string;
  joinDate: string;
  activePolicies: number;
  status: string;
  score: 'A' | 'B' | 'C' | 'D';
  password?: string;
  role?: string;
}

export interface FormData {
  name: string;
  nationalCode: string;
  insuranceCode: string;
  phone: string;
  email: string;
  birthDate: string;
  score: 'A' | 'B' | 'C' | 'D';
  role: 'customer' | 'admin' | 'admin-2' | 'admin-3';
}

export interface Policy {
  id: string;
  customerName: string;
  customerNationalCode?: string;
  policyNumber?: string;
  type: string;
  vehicle: string;
  startDate: string;
  endDate: string;
  premium: string;
  status: string;
  paymentType: string;
  payId?: string;
  paymentLink?: string;
  installmentsCount?: number;
  installment_type?: string;
  first_installment_amount?: string;
  pdfFile?: File | null;
}

export interface Installment {
  id: string;
  customerName: string;
  policyType: string;
  amount: string;
  dueDate: string;
  status: string;
  daysOverdue: number;
  payLink?: string;
  customerNationalCode?: string;
  policyNumber?: string;
}

export interface CustomerAPI {
  id: number;
  full_name: string;
  national_code: string;
  phone: string;
  birth_date?: string;
  score?: string;
  insurance_code?: string;
  created_at?: string;
  role?: string;
  status?: string;
}

export interface PolicyAPI {
  id: number;
  customer?: {
    full_name: string;
    national_code: string;
  };
  policy_number?: string;
  insurance_type: string;
  details: string;
  start_date?: string;
  end_date?: string;
  premium: string;
  status: string;
  payment_type: string;
  payment_id?: string;
  payment_link?: string;
  installment_count?: number;
  installment_type?: string;
  first_installment_amount?: string;
}

export interface InstallmentAPI {
  id: number;
  customer?: {
    full_name: string;
    national_code: string;
  };
  policy?: {
    insurance_type: string;
  };
  amount: string;
  due_date: string;
  status: string;
  pay_link?: string;
}