import pino from "pino";
import pinoHttp from "pino-http";
import type { IncomingMessage, ServerResponse } from "http";

const level = process.env["LOG_LEVEL"] ?? "info";

export const logger = pino({
  level,
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export const httpLogger = (pinoHttp as unknown as typeof pinoHttp.default)({
  logger,
  customLogLevel: (
    _req: IncomingMessage,
    res: ServerResponse,
    err: Error | undefined
  ) => {
    if (res.statusCode >= 500 || err) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  customSuccessMessage: (req: IncomingMessage, res: ServerResponse) => {
    return `${String(req.method)} ${String(req.url)} ${String(res.statusCode)}`;
  },
  customErrorMessage: (req: IncomingMessage, res: ServerResponse) => {
    return `${String(req.method)} ${String(req.url)} ${String(res.statusCode)}`;
  },
  serializers: {
    req: (req: IncomingMessage) => ({
      method: req.method,
      url: req.url,
    }),
    res: (res: ServerResponse) => ({
      statusCode: res.statusCode,
    }),
  },
});
