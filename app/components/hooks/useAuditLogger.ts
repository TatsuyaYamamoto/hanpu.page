import firebase from "firebase/app";

import {
  AuditLogDocument,
  LogType,
  getColRef as getAuditLogColRef
} from "../../domains/AuditLog";

const useAuditLogger = () => {
  const log = async <E extends Error>(
    type: LogType,
    params: any,
    ok: boolean,
    error?: E
  ) => {
    const { currentUser } = firebase.auth();
    const userId = currentUser ? currentUser.uid : null;
    const newLog: Partial<AuditLogDocument> = {
      userId,
      type,
      params,
      ok,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      href: window.location.href,
      userAgent: navigator.userAgent
    };

    if (error) {
      const { name, message, stack } = error;
      newLog.error = {
        name,
        message,
        stack
      };
    }

    await getAuditLogColRef().add(newLog);

    // tslint:disable-next-line
    console.log("sending auditLog is successfully.", newLog);
  };

  interface OkAuditData {
    type: LogType;
    params: any;
  }

  const okAudit = (data: OkAuditData) => {
    return log(data.type, data.params, true);
  };

  interface ErrorAuditData<E extends Error = Error> {
    type: LogType;
    params: any;
    error: E;
  }

  const errorAudit = (data: ErrorAuditData) => {
    const { type, params, error } = data;
    return log(type, params, false, error);
  };

  return { okAudit, errorAudit };
};

export default useAuditLogger;
