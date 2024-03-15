import { Logger } from '@feature-hub/logger';
declare function isDebugMode(searchParamString: string): boolean;
declare function createLogger(): Logger;
export { createLogger, isDebugMode as __isDebugMode };
