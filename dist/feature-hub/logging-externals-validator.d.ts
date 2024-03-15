import { ExternalsValidator, Logger, ProvidedExternals, RequiredExternals } from '@feature-hub/core';
export declare class LoggingExternalsValidator extends ExternalsValidator {
    private logger;
    constructor(providedExternals: ProvidedExternals, logger: Logger);
    /**
     * Validate that the required externals are provided in a compatible version.
     * If the required externals can't be satisfied it does not throw an error,
     * but it logs a warning.
     */
    validate(requiredExternals: RequiredExternals, consumerId?: string): void;
}
