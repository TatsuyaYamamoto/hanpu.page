import { AuditLog, LogType } from "../../domains/AuditLog";

const useAuditLogger = () => {
  const log = (data: {
    type: LogType;
    params: any;
    ok: boolean;
    error?: any;
  }) => {
    return AuditLog.write(data);
  };

  const okAudit = (data: { type: LogType; params: any }) => {
    return log({ type: data.type, params: data.params, ok: true });
  };

  const errorAudit = (data: { type: LogType; params: any; error: any }) => {
    return log({
      type: data.type,
      params: data.params,
      ok: false,
      error: data.error
    });
  };

  return { okAudit, errorAudit };
};

export default useAuditLogger;
