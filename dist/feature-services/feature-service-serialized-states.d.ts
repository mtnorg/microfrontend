import { SerializedStateManagerV1 } from '@feature-hub/serialized-state-manager';
declare const processSerializedStates: (serializedStateManager: SerializedStateManagerV1) => void;
declare const getSerializedStatesFromDom: () => string | undefined;
export { processSerializedStates, getSerializedStatesFromDom as __getSerializedStatesFromDom, };
