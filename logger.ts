import { Logger } from '@feature-hub/logger';

function isDebugMode(searchParamString: string): boolean {
  const searchParams = new URLSearchParams(searchParamString);
  const debugMode = searchParams.get('debug');
  return debugMode && debugMode === 'true' ? true : false;
}

function createLogger(): Logger {
  const verbose =
    process.env.NODE_ENV !== 'production' ||
    isDebugMode(window.location.search) ||
    isDebugMode(window.location.hash.slice(1));

  const info = verbose ? console.info.bind(console) : (): void => undefined;
  const warn = verbose ? console.warn.bind(console) : (): void => undefined;
  const error = console.error.bind(console);

  return {
    debug: info,
    error: error,
    info: info,
    trace: info,
    warn: warn,
  };
}

export { createLogger, isDebugMode as __isDebugMode };
