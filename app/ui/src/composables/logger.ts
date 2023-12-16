import { LogLevel } from '#/types';
import { getCorrelationId, getLogger, X_CORRELATION_ID } from '#/utils/logger/logger';
import { LoggerSymbol } from '../modules/logger';

export { X_CORRELATION_ID, useLogger, useSsrLogger };

const useLogger = (level?: LogLevel) => {
  const logger = inject(LoggerSymbol);
  if (!logger) throw new Error('provideLogger() not called in parent');
  const correlationId = getCorrelationId();
  logger.level = level ?? logger.level;
  return { logger: logger.child({ correlationId }), correlationId };
};

const useSsrLogger = (level?: LogLevel) => {
  const isSsr = true;
  const nodeEnv = 'development';
  const envLogLevel = 'debug';
  level = level ?? envLogLevel;
  const logger = getLogger({ isSsr, nodeEnv, envLogLevel, loggerOptions: { level } });
  const correlationId = getCorrelationId();
  return { logger: logger.child({ correlationId }), correlationId };
};
