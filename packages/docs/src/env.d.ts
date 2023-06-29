/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly GITHUB_TOKEN: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  const dataLayer: (string | Date)[];
}

declare module 'html-escaper';

export {};
