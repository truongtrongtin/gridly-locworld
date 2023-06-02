/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
  readonly VITE_GAME_VIEW_ID: string;
  readonly VITE_CHARACTER_VIEW_ID: string;
  readonly VITE_X_SHARE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
