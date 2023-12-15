import pinoLogger, { Logger, LoggerOptions } from 'pino';

import { createUUId } from '../data';
import { config } from '../../ui/vite.config';

const stream = (await import('pino-pretty')).default({
  colorize: true,
});

const loggerConfig: LoggerOptions =
  config.env.NODE_ENV === 'development'
    ? {
        level: config.env.VITE_LOG_LEVEL,
        // transport: {
        //   target: 'pino-pretty',
        //   options: {
        //     colorize: true,
        //   },
        // },
      }
    : { level: config.env.VITE_LOG_LEVEL };

let logger: Logger;
export const getLogger = (opts: LoggerOptions = {}) => {
  console.log('[logger] init START');
  console.log(loggerConfig);
  console.log(`[logger] NODE_ENV: ${config.env.NODE_ENV}`);
  const conf = {
    ...loggerConfig,
    ...opts,
  };
  if (!logger) {
    // logger = pinoLogger(loggerConfig);

    config.env.NODE_ENV === 'development'
      ? (logger = pinoLogger(conf, stream))
      : (logger = pinoLogger(conf));
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
