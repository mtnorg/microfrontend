import { FeatureAppManager, FeatureServices } from '@feature-hub/core';

class DebugListener {
  featureAppManager: FeatureAppManager;
  featureServices: FeatureServices;

  constructor(
    featureAppManager: FeatureAppManager,
    featureServices: FeatureServices,
  ) {
    this.featureAppManager = featureAppManager;
    this.featureServices = featureServices;
    this.init();
  }

  init(): void {
    window.addEventListener('message', (message): void => {
      const action = message && message.data && message.data.action;
      if (action == 'feature-hub:get-all') {
        this.sendAppListMessage();
        this.sendServiceListMessage();
      }
      //   console.log("message received in feature hub integrator", message.data, sender);
    });
  }

  sendAppListMessage(): void {
    //    console.log("send app list");
    const apps = Array.from(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (<any>this.featureAppManager).featureAppRetainers.keys(),
    ).map((element) => {
      return { id: element };
    });
    //  console.log((<any>this.featureAppManager));
    window.postMessage(
      {
        action: 'feature-hub-debug:feature-apps-list',
        body: apps,
        source: 'fh-integrator',
      },
      '*',
    );
  }

  sendServiceListMessage(): void {
    //  console.log("send service list");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const registry = (<any>this.featureAppManager).featureServiceRegistry;
    const serviceMap = registry.sharedFeatureServices;
    const services = Array.from(serviceMap.keys()).map((element) => {
      const service: { id: unknown; versions?: unknown } = { id: element };
      const versionMappingObject = serviceMap.get(element);
      service['versions'] = Object.keys(versionMappingObject);
      return service;
    });
    window.postMessage(
      {
        action: 'feature-hub-debug:feature-service-list',
        body: services,
        source: 'fh-integrator',
      },
      '*',
    );
  }
}

export { DebugListener };
