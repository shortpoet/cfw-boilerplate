import { getCorrelationId, getLogger } from '#/utils/logger/logger';

export const withPino =
  ({ level = 'basic' } = {}) =>
  async (req: Request, res: Response, env: Env) => {
    console.log(`[api] [middlware] [withPino] -> ${req.method} -> ${req.url}`);
    console.log(env);
    const correlationId = getCorrelationId(req.headers);
    const isSsr = env.SSR;
    const nodeEnv = env.NODE_ENV;
    const envLogLevel = env.VITE_LOG_LEVEL;
    console.log(
      `[api] [middlware] [withPino] [params] -> ${correlationId} -> ${isSsr} -> ${nodeEnv} -> ${envLogLevel}`
    );

    // req.headers[X_CORRELATION_ID] = crypto.randomUUID()
    // requestLogger.info({
    //   url: req.url,
    //   method: req.method,
    //   correlationId: req.headers[X_CORRELATION_ID],
    //   msg: 'inbound request',
    // })

    const logger = getLogger({ isSsr, nodeEnv, envLogLevel, loggerOptions: { level } }).child({
      correlationId,
    });
    req.logger = logger;
    // this seems to log at end of request...
    req.logger.info(`[api] middlware.withPino -> ${req.method} -> ${req.url}`);
    // req.logger.error('this is at error level');
    // req.logger.info('the answer is %d', 42);
    // req.logger.info({ obj: 42 }, 'hello world');
    // req.logger.info({ obj: 42, b: 2 }, 'hello world');
    // req.logger.info({ nested: { obj: 42 } }, 'nested');
    // setImmediate(() => {
    //   req.logger.info('after setImmediate');
    // });
    // req.logger.error(new Error('an error'));

    // const child = req.logger.child({ a: 'property' });
    // child.info('hello child!');

    // const childsChild = child.child({ another: 'property' });
    // childsChild.info('hello baby..');

    // req.logger.debug('this should be mute');

    // req.logger.level = 'trace';

    // req.logger.debug('this is a debug statement');

    // req.logger.child({ another: 'property' }).debug('this is a debug statement via child');
    // req.logger.trace

    // req.logger.debug('this is a "debug" statement with "');

    // // req.logger.info(new Error('kaboom'));
    // req.logger.info(null);

    // // req.logger.info(new Error('kaboom'), 'with', 'a', 'message');

    console.log(`[api] middlware.withPino ->  END`);
  };
