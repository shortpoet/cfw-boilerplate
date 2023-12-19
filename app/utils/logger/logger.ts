import pinoLogger, { Logger, LoggerOptions } from 'pino';
import { createUUId } from '../data';
export const X_CORRELATION_ID = 'x-correlation-id';
import { IS_BROWSER } from '../runtime';
import colors from 'kleur';

// import * as _stream from 'pino-pretty';

// const stream = (await import('pino-pretty')).default({
//   colorize: true,
// });

// const stream = _stream.default({
//   colorize: true,
// });

let logger: Logger;
type GetLoggerOpts = {
  isSsr: EnvVars['SSR'];
  nodeEnv: EnvVars['NODE_ENV'];
  envLogLevel: EnvVars['VITE_LOG_LEVEL'];
  loggerOptions?: LoggerOptions;
};
export const getLogger = (opts: GetLoggerOpts) => {
  // console.log('[logger] init START');
  const { isSsr, nodeEnv, envLogLevel } = opts;
  const loggerConfig: LoggerOptions =
    // VITE sets this to VITE_USER_NODE_ENV
    // conveniently this allows the strem not to load on browser
    IS_BROWSER
      ? { level: envLogLevel, browser: { asObject: true } }
      : nodeEnv === 'development' || isSsr
        ? {
            level: envLogLevel,
            transport: {
              target: 'pino-pretty',
              options: {
                colorize: true,
              },
            },
          }
        : { level: envLogLevel };
  const conf = {
    ...loggerConfig,
    ...opts.loggerOptions,
  };
  // console.log(conf);
  if (!logger) {
    logger = pinoLogger(conf);
    // logger = pinoLogger(conf, stream);
  }
  // logger.info('[logger] init END');
  return logger;
};

export const getCorrelationId = (headers?: Headers) => {
  // console.log(colors.yellow('[logger] getCorrelationId'));
  // console.log(headers);
  let correlationId = headers?.get(X_CORRELATION_ID);
  // console.log(colors.magenta(`[logger] getCorrelationId PRE -> ${correlationId}`));
  if (!correlationId) {
    correlationId = createUUId();
    // correlationId = crypto.randomUUID();
  }
  // console.log(colors.green(`[logger] getCorrelationId RET -> ${correlationId}`));
  return correlationId;
};
