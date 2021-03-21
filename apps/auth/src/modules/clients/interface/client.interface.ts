export interface ClientInterface {
  id: bigint;
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
  isTrusted: boolean;
}
