export { IS_BROWSER, IS_NODE, IS_WORKER };

function isWorker() {
  return (
    // @ts-ignore
    typeof WebSocketPair !== 'undefined' || typeof caches !== 'undefined'
  );
}

function isNode() {
  return typeof process !== 'undefined' && process.release?.name === 'node';
}

function isBrowser() {
  return typeof window !== 'undefined';
}

const IS_WORKER = isWorker();
const IS_NODE = isNode();
const IS_BROWSER = isBrowser();

export const isClient = typeof window !== 'undefined';
const defaultWindow: (Window & typeof globalThis) | undefined = /* #__PURE__ */ isClient
  ? window
  : undefined;
