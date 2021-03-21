import { ClientInterface } from '../../clients/interface/client.interface';
import { UserInterface } from '../../users/interface/user.interface';

export interface AuthorizationCodeInterface {
  code: string;
  redirectUri: string;
  client: ClientInterface;
  user: UserInterface;
}
