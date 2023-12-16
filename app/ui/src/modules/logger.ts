import { getLogger } from '#/utils/logger/logger';

export { provideLogger, LoggerSymbol };

const LoggerSymbol: InjectionKey<ReturnType<typeof getLogger>> = Symbol();

const level = 'debug';
const provideLogger = (env: EnvVars) => {
  const isSsr = env.SSR;
  const nodeEnv = env.NODE_ENV;
  const envLogLevel = env.VITE_LOG_LEVEL;
  const logger = getLogger({ isSsr, nodeEnv, envLogLevel, loggerOptions: { level } });
  provide(LoggerSymbol, logger);
};
