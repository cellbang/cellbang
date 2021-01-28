import { AuthenticationError } from '@malagu/security/lib/node';

export class ShareAuthenticationError extends AuthenticationError {

}

export class ShareNotFoundError extends ShareAuthenticationError {

}
