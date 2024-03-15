import * as FeatureHubReact from '@feature-hub/react';
import * as ModuleLoaderAmd from '@feature-hub/module-loader-amd';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as styled from 'styled-components';
import axios from 'axios';

// Add support for default imports of axios in feature apps, despite axios being
// a CJS module. For that to work in a bundled Feature App that has axios
// specified as an external, we need to define the `__esModule` property that
// webpack uses to decide whether to use the `default` property, or the module
// itself. The module itself is transformed to a Module object by SystemJS
// though, whereas the `default` property is the default function (with
// additional properties). See https://github.com/systemjs/systemjs/issues/2090
Object.defineProperty(axios, '__esModule', { value: true });

const definedExternals: ModuleLoaderAmd.Externals = {
  '@feature-hub/module-loader-amd': ModuleLoaderAmd,
  '@feature-hub/react': FeatureHubReact,
  axios,
  react: React,
  'react-dom': ReactDom,
  'styled-components': styled,
};

const providedExternals = {
  '@feature-hub/module-loader-amd': process.env.FEATURE_HUB_VERSION as string,
  '@feature-hub/react': process.env.FEATURE_HUB_VERSION as string,
  axios: process.env.AXIOS_VERSION as string,
  react: process.env.REACT_VERSION as string,
  'react-dom': process.env.REACT_DOM_VERSION as string,
  'styled-components': process.env.STYLED_COMPONENTS_VERSION as string,
};

export { definedExternals, providedExternals };
