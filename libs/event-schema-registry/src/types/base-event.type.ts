export type BaseEvent<E extends string, T> = {
  eventId: string;
  eventVersion: number;
  eventTime: string;
  producer: string;
  eventName: E;
  data: T;
};
