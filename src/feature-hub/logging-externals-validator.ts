import {
  ExternalsValidator,
  Logger,
  ProvidedExternals,
  RequiredExternals,
} from '@feature-hub/core';

export class LoggingExternalsValidator extends ExternalsValidator {
  constructor(
    providedExternals: ProvidedExternals,
    private logger: Logger,
  ) {
    super(providedExternals);
  }

  /**
   * Validate that the required externals are provided in a compatible version.
   * If the required externals can't be satisfied it does not throw an error,
   * but it logs a warning.
   */
  override validate(
    requiredExternals: RequiredExternals,
    consumerId?: string,
  ): void {
    try {
      super.validate(requiredExternals, consumerId);
    } catch (error) {
      this.logger.warn(error);
    }
  }
}
