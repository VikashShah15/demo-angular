import { environment } from 'src/environments/environment';

const AuthURL = environment.BASE_URL_AUTHENTICATION;

export const documentApi = {
    document: {
        getDocumentData : `${AuthURL}documents`,
        getDocumentType : `${AuthURL}document-type`,
        deleteDocumentData : `${AuthURL}document/{documentId}`,
        createDocument: `${AuthURL}document`,
        fileUpload: `${AuthURL}upload`,
        getUserPlan: `${AuthURL}plans`,
        getFileDownloadPreSignedUrl: `${AuthURL}download`,
        updateDocumentData: `${AuthURL}documents/{documentId}`,
    }
};
