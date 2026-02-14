import type { ComponentType } from "react";
export interface Customer {
  id: number;
  full_name: string;
  national_code: string;
  insurance_code: string;
  phone: string;
  birth_date: string;
  score: string;
  role: string;
  created_at: string;
  updated_at: string;
}
export interface RawPolicy {
  id: number;
  insurance_type: string;
  details: string;
  start_date: string | null;
  end_date: string | null;
  status: string;
  payment_type: string;
  payment_id: string | null;
  payment_link: string | null;
  pdf_path: string | null;
  policy_number: string | null;
}
export interface Policy {
  id: number;
  type: string;
  vehicle: string;
  startDate: string;
  endDate: string;
  status: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  isInstallment: boolean;
  payId: string | undefined;
  payLink: string | undefined;
  hasPdf: boolean;
  policyNumber: string | undefined;
}
export interface RawInstallment {
  id: number;
  due_date: string;
  status: string;
  pay_link: string;
  policy_id: number;
  installment_number: number;
  amount: string;
  policy: {
    insurance_type: string;
    policy_number: string | null;
  } | null;
}
export interface CustomerDashboardProps {
  onLogout: () => void;
}