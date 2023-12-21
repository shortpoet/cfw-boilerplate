const FILE_LOG_LEVEL = 'debug';
import { JsonData } from '../../../types';

interface Headers {
  [key: string]: string;
}

export const getBaseUrl = (env: Env) => {
  return {
    baseUrlApi:
      env.NODE_ENV === 'development' || env.NODE_ENV === 'staging'
        ? `http://${env.API_HOST}:${env.VITE_PORT_API}`
        : `https://${env.API_HOST}`,
    baseUrlApp:
      env.NODE_ENV === 'development' || env.NODE_ENV === 'staging'
        ? `http://${env.HOST}:${env.VITE_PORT}`
        : `https://${env.HOST}`,
  };
};

export const remapHeaders = (res: Response) => {
  const headers = new Headers(res.headers);
  Object.entries(headers).map(([key, val]) => res.headers.set(key, val));
  return res;
};

export const setHeaders = (
  res: Response,
  headers: Response['headers'] | Record<string, string>
) => {
  Object.entries(headers).map(([key, val]) => res.headers.set(key, val));
  return res;
};

export const remapResponseProperties = (res: Response, properties: (keyof ResponseInit)[]) => {
  const init: ResponseInit = {};
  properties.map((prop) => (init[prop] = res[prop]));
  return init;
};

export const initResponse = (res: Response | undefined) => {
  let init: ResponseInit = {};
  if (res) {
    init = remapResponseProperties(res, ['cf']);
    res = remapHeaders(res);
    res = setHeaders(res, {
      'content-type': 'application/json',
    });
    init.headers = res.headers;
  }
  return init;
};

const formatErr = (type: string, code: number, err: Error) => {
  return JSON.stringify(
    {
      error: {
        message: err.message,
        type: type,
        code: code,
      },
    },
    null,
    2
  );
};

export const notFoundResponse = (msg?: string, err?: Error, res?: Response) => {
  const newErr = err || new Error(`${msg}` || 'Resource Not found');
  const init = {
    ...res,
    status: 404,
    statusText: newErr.message,
  } as ResponseInit;
  const body = formatErr('NotFound', 404, newErr);
  return new Response(body, init);
};

export const badResponse = (msg?: string, err?: Error, res?: Response) => {
  const newErr = err || new Error(`${msg}` || 'Bad Request');
  const init = {
    ...res,
    status: 400,
    statusText: newErr.message,
  } as ResponseInit;
  const body = formatErr('BadRequest', 400, newErr);
  return new Response(body, init);
};

export const serverErrorResponse = (msg?: string, err?: Error, res?: Response) => {
  const newErr = err || new Error(`${msg}` || 'Server Error');
  const init = {
    ...res,
    status: 500,
    statusText: newErr.message,
  } as ResponseInit;
  const body = formatErr('ServerError', 500, newErr);
  return new Response(body, init);
};

export const jsonOkResponse = (data: any, res?: Response) => {
  return okResponse(JSON.stringify(data, null, 2), res);
};

export const jsonCreatedResponse = (data: any, res?: Response) => {
  return createdResponse(JSON.stringify(data), res);
};

export const okResponse = (data?: string, res?: Response) => {
  const init = initResponse(res);
  return new Response(data || '{}', { ...init, status: 200, statusText: 'OK' });
};

export const createdResponse = (data?: string, res?: Response) => {
  const init = initResponse(res);
  return new Response(data, { ...init, status: 201, statusText: 'Created' });
};

export const unauthorizedResponse = (data?: string, res?: Response, status = 401) => {
  const init = initResponse(res);
  return new Response(data, {
    ...init,
    status,
    statusText: 'Unauthorized',
  });
};
