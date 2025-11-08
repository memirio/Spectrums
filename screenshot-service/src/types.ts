export type Viewport = { width: number; height: number };

export type ScreenshotRequest = {
  url: string;
  fullPage?: boolean;
  viewport?: Viewport;
  mobile?: boolean;
  fresh?: boolean;
};

export type ScreenshotResult = {
  imageUrl: string;
  width: number;
  height: number;
  bytes: number;
  cached?: boolean;
};

