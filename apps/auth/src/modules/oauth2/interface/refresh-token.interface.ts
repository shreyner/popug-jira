import { ClientInterface } from '../../clients/interface/client.interface';
import { UserInterface } from '../../users/interface/user.interface';

export interface RefreshTokenInterface {
  token: string;
  client: ClientInterface;
  user: UserInterface;
}
