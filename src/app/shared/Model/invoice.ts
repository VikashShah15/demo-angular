export interface InvoiceModel {
  amount: number;
  docSize: number;
  invoiceFileURL: string;
  invoiceNumber: string;
  invoiceStatusId: any;
  invoiceTo: string;
  supportItemNumber: string;
  userId: string;
  planId: string;
  unit: number;
  supportSubCategoryId: number;
  pricePerUnit: number;
  supportDeliveredStartDate: Date;
  supportDeliveredEndDate: Date;
}
export interface InvoiceStatues {
  invoiceStatusId: number;
  title: string;
}
export interface InvoiceData {
  amount: number;
  docSize: number;
  invoiceFileURL: string;
  invoiceNumber: string;
  invoiceStatusId?: any;
  invoiceTo: string;
  supportItemNumber: string;
  userId: string;
  planId: string;
  unit: number;
  supportSubCategoryId: number;
  pricePerUnit: number;
  supportDeliveredStartDate: Date;
  supportDeliveredEndDate: Date;
  createdDate: Date;
  lastUpdated: Date;
  invoiceId: string;
}
