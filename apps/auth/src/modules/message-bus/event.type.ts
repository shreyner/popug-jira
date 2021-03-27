export type Event<E extends string, T extends unknown> = {
  eventId: string;
  eventVersion: number;
  eventTime: string;
  producer: string;
  eventName: E;
  data: T;
};
