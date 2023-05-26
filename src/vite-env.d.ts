/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
  readonly VITE_VIEW_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
