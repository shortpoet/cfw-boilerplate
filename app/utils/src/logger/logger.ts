import pinoLogger, { Logger, LoggerOptions } from 'pino';
import pretty from 'pino-pretty';

import { createUUId } from '../data';
import { config } from '../config';

const stream = pretty({
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
export const getLogger = () => {
  console.log('[logger] init START');
  console.log(loggerConfig);
  console.log(`[logger] NODE_ENV: ${config.env.NODE_ENV}`);
  if (!logger) {
    // logger = pinoLogger(loggerConfig);

    config.env.NODE_ENV === 'development'
      ? (logger = pinoLogger(loggerConfig, stream))
      : (logger = pinoLogger(loggerConfig));
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
