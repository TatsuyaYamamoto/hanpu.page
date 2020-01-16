import { auth, firestore } from "firebase/app";

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
  error?: any;
}

export class AuditLog {
  public static getColRef() {
    return firestore().collection(`auditLogs`);
  }

  public static async write(log: {
    type: LogType;
    params: any;
    ok: boolean;
    error?: any;
  }): Promise<void> {
    const { currentUser } = auth();
    const userId = currentUser ? currentUser.uid : null;
    const newLog: Partial<AuditLogDocument> = {
      userId,
      type: log.type,
      createdAt: firestore.FieldValue.serverTimestamp(),
      href: location.href,
      userAgent: navigator.userAgent,
      params: log.params,
      ok: log.ok
    };

    if (log.error) {
      newLog.error = log.error;
    }

    await AuditLog.getColRef().add(newLog);
  }
}
