export type EventKey = string;
export type EventMap = Map<EventKey, Array<(data: unknown) => void>>;

export class EventManager {
  private handlers: EventMap = new Map();

  public emit<T>(key: EventKey, data?: T) {
    const handlers = this.handlers.get(key);

    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }

  public addHandler<T>(key: EventKey, handler: (data: T) => void): void {
    if (!this.handlers.has(key)) {
      this.handlers.set(key, []);
    }

    this.handlers.get(key)!.push(handler as (data: unknown) => void);
  }

  public removeHandler<T>(key: EventKey, handler: (data: T) => void): void {
    const handlers = this.handlers.get(key);

    if (!handlers) return;

    const filteredHandlers = handlers.filter((h) => h !== handler);

    if (filteredHandlers.length === 0) {
      this.handlers.delete(key);
    } else {
      this.handlers.set(key, filteredHandlers);
    }
  }

  public removeAllHandlers(key: EventKey) {
    this.handlers.delete(key);
  }

  public hasHandlers(key: EventKey): boolean {
    return this.handlers.has(key) && this.handlers.get(key)!.length > 0;
  }

  public clear(): void {
    this.handlers.clear();
  }
}
