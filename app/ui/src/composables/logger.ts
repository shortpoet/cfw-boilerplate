import { LogLevel } from '#/types';
import { getCorrelationId, getLogger } from '#/utils/logger/logger';
import { LoggerSymbol } from '../modules/logger';

export const useLogger = (req?: Request, level?: LogLevel) => {
  const logger = inject(LoggerSymbol);
  if (!logger) throw new Error('provideLogger() not called in parent');
  const correlationId = getCorrelationId(req?.headers);
  logger.level = level ?? logger.level;
  return logger.child({ correlationId });
};

export const useSsrLogger = (req?: Request, level?: LogLevel) => {
  const isSsr = true;
  const nodeEnv = 'development';
  const envLogLevel = 'debug';
  level = level ?? envLogLevel;
  const logger = getLogger({ isSsr, nodeEnv, envLogLevel, loggerOptions: { level } });
  const correlationId = getCorrelationId(req?.headers);
  return logger.child({ correlationId });
};
