import { FeatureAppManager, Logger } from "@feature-hub/core";
import { IntegratorFeatureServices } from "./feature-hub/service-dependencies";
import { FeatureAppIntegrator } from "./feature-apps/feature-app-integrator";
declare global {
    interface StateRegistry {
        addStore: (arg0: string, arg1: Record<string, unknown>, arg2: Record<string, unknown>) => void;
    }
    interface Microkernel {
        stateRegistry: StateRegistry;
    }
    interface Window {
        microkernel: Microkernel;
    }
}
declare const exportedObject: {
    __applyFeatureHub: (event: CustomEvent, featureAppIntegrator: FeatureAppIntegrator) => Promise<void>;
    __integrateFeatureApps: () => Promise<void>;
    __processFeatureServices: (featureServices: IntegratorFeatureServices) => void;
    __setupIntegrator: () => {
        featureAppManager: FeatureAppManager;
        logger: Logger;
    };
};
export default exportedObject;
