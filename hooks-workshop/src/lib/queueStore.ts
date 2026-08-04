type Listener = () => void;

class TellerQueueStore {
  private queueLength = 4;
  private listeners = new Set<Listener>();

  constructor() {
    setInterval(() => {
      const delta = Math.random() > 0.5 ? 1 : -1;
      this.queueLength = Math.max(0, this.queueLength + delta);
      this.listeners.forEach((listener) => listener());
    }, 1500);
  }
//to know  when it changes , keep listening 
  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = () => this.queueLength; //to know the current value 
}

export const tellerQueueStore = new TellerQueueStore();

//A second independent externalstore -wrapping a real browser API(offline,online events) 
export function subscribeOnlineStatus(listener: Listener) {
  window.addEventListener('online', listener);
  window.addEventListener('offline', listener);
  return () => {
    window.removeEventListener('online', listener);
    window.removeEventListener('offline', listener);
  };
}

export function getOnlineStatusSnapshot() {
  return navigator.onLine; //watches whether your actual internet connection is up
}
