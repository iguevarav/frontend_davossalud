export enum CashEntryType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export enum CashPaymentMethod {
  CASH = "CASH",
  CARD = "CARD",
  TRANSFER = "TRANSFER",
  YAPE = "YAPE",
  PLIN = "PLIN",
  OTHER = "OTHER",
}

export interface CashEntry {
  id: string;
  type: CashEntryType;
  concept: string;
  description?: string;
  amount: number;
  paymentMethod: CashPaymentMethod;
  referenceNumber?: string;
  date: string;
  userId?: string;
  user?: { firstName: string; lastName: string };
  createdAt: string;
  updatedAt: string;
}

export interface CreateCashEntryDto {
  type: CashEntryType;
  concept: string;
  description?: string;
  amount: number;
  paymentMethod?: CashPaymentMethod;
  referenceNumber?: string;
  date: string;
  userId?: string;
}

export interface UpdateCashEntryDto extends Partial<CreateCashEntryDto> {}

export interface CashSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  count: number;
}
