import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'coffee-ratio-calculator',
  globalStyle: 'global.css',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
    {
      type: 'www',
      serviceWorker: null,
      copy: [
        { src: 'components/assets', dest: 'build/assets', warn: true },
      ],
    },
  ],
};
