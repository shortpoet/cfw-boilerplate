import pinoLogger, { Logger, LoggerOptions } from 'pino';
import { createUUId } from '../data';
export const X_CORRELATION_ID = 'x-correlation-id';
import { IS_BROWSER } from '../runtime';
// const stream = (await import('pino-pretty')).default({
//   colorize: true,
// });

let logger: Logger;
type GetLoggerOpts = {
  env: EnvVars;
  loggerOptions?: LoggerOptions;
};
export const getLogger = (opts: GetLoggerOpts) => {
  const loggerConfig: LoggerOptions =
    // VITE sets this to VITE_USER_NODE_ENV
    // conveniently this allows the strem not to load on browser
    IS_BROWSER
      ? { level: opts.env.VITE_LOG_LEVEL, browser: { asObject: true } }
      : opts.env.NODE_ENV === 'development'
        ? {
            level: opts.env.VITE_LOG_LEVEL,
            transport: {
              target: 'pino-pretty',
              options: {
                colorize: true,
              },
            },
          }
        : { level: opts.env.VITE_LOG_LEVEL };

  console.log('[logger] init START');
  // console.log(loggerConfig);
  // console.log(`[logger] NODE_ENV: ${opts.env.NODE_ENV}`);
  // console.log(`[logger] ENV:`);
  // console.log(opts.env);
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

export const getCorrelationId = (headers?: Headers) => {
  let correlationId = headers?.get(X_CORRELATION_ID);
  if (!correlationId) {
    correlationId = createUUId();
    // correlationId = crypto.randomUUID();
  }
  return correlationId;
};
