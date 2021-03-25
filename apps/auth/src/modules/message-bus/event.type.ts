export type Event<E extends string, T extends unknown> = {
  eventId: string;
  eventVersion: string;
  eventTime: string;
  producer: string;
  eventName: E;
  data: T;
};
