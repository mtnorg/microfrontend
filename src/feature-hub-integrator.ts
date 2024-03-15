import {
  FeatureAppManager,
  FeatureServiceConsumerDefinition,
  FeatureServiceRegistry,
  Logger,
} from "@feature-hub/core";
import {
  IntegratorFeatureServices,
  featureServiceDependencies,
} from "./feature-hub/service-dependencies";
import { defineExternals, loadAmdModule } from "@feature-hub/module-loader-amd";
import { DebugListener } from "./debug-extension/debug-listener";
import { FeatureAppIntegrator } from "./feature-apps/feature-app-integrator";
import { LoggingExternalsValidator } from "./feature-hub/logging-externals-validator";
import { createLogger } from "./logger";
import { processSerializedStates } from "./feature-services/feature-service-serialized-states";
import { definedExternals, providedExternals } from "./feature-hub/provided-externals";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare global {
  interface StateRegistry {
    addStore: (
      arg0: string,
      arg1: Record<string, unknown>,
      arg2: Record<string, unknown>
    ) => void;
  }
  interface Microkernel {
    stateRegistry: StateRegistry;
  }
  interface Window {
    microkernel: Microkernel;
  }
}

const PAGE_LOADED = "PAGE_LOADED";
const LAYER_LOADED = "LAYER_LOADED";
const CONTENT_RENDERED = "content:rendered";

const __setupIntegrator = (): {
  featureAppManager: FeatureAppManager;
  logger: Logger;
} => {
  defineExternals(definedExternals);

  const logger = createLogger();

  const externalsValidator = new LoggingExternalsValidator(
    providedExternals,
    logger
  );

  const featureServiceRegistry = new FeatureServiceRegistry({
    externalsValidator,
    logger,
  });

  const integratorDefinition: FeatureServiceConsumerDefinition = {
    dependencies: { featureServices: featureServiceDependencies },
  };

  const featureAppManager = new FeatureAppManager(featureServiceRegistry, {
    externalsValidator,
    logger,
    moduleLoader: loadAmdModule,
  });

  return {
    featureAppManager,
    logger,
  };
};

const __processFeatureServices = (
  featureServices: IntegratorFeatureServices
): void => {
  const serializedStateManager = featureServices["s2:serialized-state-manager"];
  processSerializedStates(serializedStateManager);
  const historyService = featureServices["s2:history"];
};

const __applyFeatureHub = async (
  event: CustomEvent,
  featureAppIntegrator: FeatureAppIntegrator
): Promise<void> => {
  if (
    event &&
    event.type &&
    (event.type === PAGE_LOADED ||
      event.type === LAYER_LOADED ||
      event.type === CONTENT_RENDERED)
  ) {
    if (event.detail && event.detail.element) {
      await featureAppIntegrator.initFeatureApps(event.detail.element);
    }
  }
};

const __integrateFeatureApps = async (): Promise<void> => {
  const { featureAppManager } =
    exportedObject.__setupIntegrator();

  const featureAppIntegrator = new FeatureAppIntegrator(
    featureAppManager,
  );

  const applyFeatureHubToPartial = (event: CustomEvent): void => {
    exportedObject.__applyFeatureHub(event, featureAppIntegrator);
  };

  document.addEventListener(PAGE_LOADED, applyFeatureHubToPartial);
  document.addEventListener(LAYER_LOADED, applyFeatureHubToPartial);
  document.addEventListener(CONTENT_RENDERED, applyFeatureHubToPartial);

  setTimeout(async () => {
    await featureAppIntegrator.initFeatureApps(document.body);
  });
};
const exportedObject = {
  __applyFeatureHub,
  __integrateFeatureApps,
  __processFeatureServices,
  __setupIntegrator,
};
exportedObject.__integrateFeatureApps().catch(console.error);
export default exportedObject;
