// Minimal ExtendableEvent shim for Workbox compatibility
interface ExtendableEvent extends Event {
  waitUntil(fn: Promise<any>): void;
}



