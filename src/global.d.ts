/// <reference lib="webworker" />

declare global {
  interface ExtendableEvent extends Event {
    waitUntil(fn: Promise<any>): void;
  }
}

export {};
