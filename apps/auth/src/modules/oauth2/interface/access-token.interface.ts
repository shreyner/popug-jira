import { ClientInterface } from '../../clients/interface/client.interface';
import { UserInterface } from '../../users/interface/user.interface';

export interface AccessTokenInterface {
  token: string;
  client: ClientInterface;
  user: UserInterface;
}
