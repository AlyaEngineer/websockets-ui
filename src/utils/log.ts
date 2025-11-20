export function log(...args: Parameters<typeof console.log>) {
  console.log('[WS]', ...args);
}
