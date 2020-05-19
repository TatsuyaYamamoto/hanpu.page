import { firestore } from "firebase/app";

export enum LogType {
  ACTIVATE_WITH_DOWNLOAD_CODE = "ACTIVATE_WITH_DOWNLOAD_CODE",
  DOWNLOAD_PRODUCT_FILE = "DOWNLOAD_PRODUCT_FILE",
  PLAY_PRODUCT_FILE = "DOWNLOAD_PRODUCT_FILE"
}

export interface AuditLogDocument {
  // who
  userId:
    | string // login user
    | null; // non-login user (ex. download only)

  // what
  type: LogType;

  // when
  createdAt: Date | firestore.FieldValue;

  // where
  href: string;
  userAgent: string;

  // how
  params: any;

  // results
  ok: boolean;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

export const getColRef = () => {
  return firestore().collection(`auditLogs`);
};
