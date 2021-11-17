export interface DocumentModel {
    createdDate: Date;
    description: string;
    documentId: string;
    documentTypeId: number;
    endDate: Date;
    filePath: string;
    fileSize: number;
    invoiceId: string;
    isDeleted: boolean;
    planId: string;
    startDate: Date;
    title: string;
    userId: string;
    documentTypes?: DocumentTypes;
}
export interface CreateDocument {
    description: string;
    documentId: string;
    documentTypeId: number;
    endDate: Date;
    filePath: string;
    fileSize: number;
    planId: string;
    startDate: Date;
    title: string;
    userId: string;
}
export interface DocumentType {
    documentTypeId?: number;
    name?: string;
    value?: number;
    label?: string;
}
export interface DocumentTypes {
    documentTypeId?: number;
    name?: string;
}
