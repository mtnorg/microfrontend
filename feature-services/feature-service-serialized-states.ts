import { SerializedStateManagerV1 } from '@feature-hub/serialized-state-manager';

const processSerializedStates = (
  serializedStateManager: SerializedStateManagerV1,
): void => {
  const serializedStates = getSerializedStatesFromDom();

  if (serializedStates) {
    serializedStateManager.setSerializedStates(serializedStates);
  }
};

const getSerializedStatesFromDom = (): string | undefined => {
  const scriptElement = document.querySelector(
    'script[type="x-feature-hub/serialized-states"]',
  );

  return (scriptElement && scriptElement.textContent) || undefined;
};

export {
  processSerializedStates,
  getSerializedStatesFromDom as __getSerializedStatesFromDom,
};
