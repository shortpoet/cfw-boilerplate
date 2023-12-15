import { LogLevel } from '#/types';
import { getCorrelationId, getLogger } from '#/utils/logger/logger';

export { provideLogger, useLogger };

const LoggerSymbol: InjectionKey<ReturnType<typeof getLogger>> = Symbol();

const level = 'debug';
const provideLogger = (env: EnvVars) => {
  const logger = getLogger({ env, loggerOptions: { level } });
  provide(LoggerSymbol, logger);
};

const useLogger = (req?: Request, level?: LogLevel) => {
  const logger = inject(LoggerSymbol);
  if (!logger) throw new Error('provideLogger() not called in parent');
  const correlationId = getCorrelationId(req?.headers);
  logger.level = level ?? logger.level;
  return logger.child({ correlationId });
};
