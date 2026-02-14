import { RegisterHandler } from './register.handler';
import { LoginHandler } from './login.handler';
import { RefreshHandler } from './refresh.handler';
import { LogoutHandler } from './logout.handler';

export const commandHandlers = [RegisterHandler, RefreshHandler, LogoutHandler, LoginHandler];
