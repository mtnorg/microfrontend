import { Logger } from '@feature-hub/core';

interface FeatureAppStringAttributes {
  readonly baseUrl: string;
  readonly callbacks: string;
  readonly configAttribute: string;
  readonly content: string;
  readonly cssAttribute: string;
  readonly featureAppId: string;
  readonly serverSrc: string;
  readonly src: string;
}

function getConfig(
  configAttribute: string,
  featureAppId: string,
  logger: Logger,
): Record<string, unknown> {
  let config = {};
  if (configAttribute) {
    const configString =
      featureAppId === 'audi-feature-app-editor'
        ? configAttribute
        : configAttribute.replace(new RegExp('\\\\"', 'g'), '"');
    try {
      config = JSON.parse(configString);
    } catch (error) {
      logger.error(`config could not be parsed - ${error.message}`);
    }
  }
  return config;
}

function parseFeatureAppAttributes(
  featureApp: Element,
): FeatureAppStringAttributes {
  const baseUrl: string | null = featureApp.getAttribute('base-url');
  const callbacks: string | null = featureApp.getAttribute('callbacks');
  const configAttribute: string | null = featureApp.getAttribute('config');
  const content: string | null = featureApp.getAttribute('data-content');
  const cssAttribute: string | null = featureApp.getAttribute('css');
  const featureAppId: string | null = featureApp.getAttribute('id');
  const serverSrc: string | null = featureApp.getAttribute('server-src');
  const src: string | null = featureApp.getAttribute('src');

  return {
    baseUrl,
    callbacks,
    configAttribute,
    content,
    cssAttribute,
    featureAppId,
    serverSrc,
    src,
  };
}

export { getConfig, parseFeatureAppAttributes };
