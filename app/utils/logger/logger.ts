import pinoLogger, { Logger, LoggerOptions } from 'pino';
import { createUUId } from '../data';

const stream = (await import('pino-pretty')).default({
  colorize: true,
});

let logger: Logger;
type GetLoggerOpts = {
  env: Env;
  loggerOptions?: LoggerOptions;
};
export const getLogger = (opts: GetLoggerOpts) => {
  const loggerConfig: LoggerOptions =
    opts.env.NODE_ENV === 'development'
      ? {
          level: opts.env.VITE_LOG_LEVEL,
          // transport: {
          //   target: 'pino-pretty',
          //   options: {
          //     colorize: true,
          //   },
          // },
        }
      : { level: opts.env.VITE_LOG_LEVEL };

  console.log('[logger] init START');
  console.log(loggerConfig);
  console.log(`[logger] NODE_ENV: ${opts.env.NODE_ENV}`);
  const conf = {
    ...loggerConfig,
    ...opts.loggerOptions,
  };
  if (!logger) {
    // logger = pinoLogger(loggerConfig);

    logger = pinoLogger(conf);
    // opts.env.NODE_ENV === 'development'
    //   ? (logger = pinoLogger(conf, stream))
    //   : (logger = pinoLogger(conf));
  }
  logger.info('[logger] init END');
  return logger;
};

export const getCorrelationId = (headers: Headers) => {
  let correlationId = headers.get('x-correlation-id');
  if (!correlationId) {
    correlationId = createUUId();
    // correlationId = crypto.randomUUID();
  }
  return correlationId;
};
