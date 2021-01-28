import { SHARE_AUTHENTICATION_ERROR_HANDlER_PRIORITY } from './error-protocol';
import { ErrorHandler, Context, AttributeScope } from '@malagu/web/lib/node';
import { Component, Value } from '@malagu/core';
import { HttpStatus, HttpHeaders } from '@malagu/web';
import { AUTHENTICATION_SCHEME_CB_SHARE, Share } from '../../common';
import { ShareAuthenticationError } from './error';
import { CURRENT_SHARE_REQUEST_KEY } from '../share-middleware';
import { AuthenticationError } from '@malagu/security/lib/node';

@Component([AuthenticationErrorHandler, ErrorHandler])
export class AuthenticationErrorHandler implements ErrorHandler {
    readonly priority: number = SHARE_AUTHENTICATION_ERROR_HANDlER_PRIORITY;

    @Value('malagu.security.basic.realm')
    protected realm: string;

    async canHandle(ctx: Context, err: Error): Promise<boolean> {
        const share = Context.getAttr<Share>(CURRENT_SHARE_REQUEST_KEY, AttributeScope.Request);
        return share && err instanceof AuthenticationError || err instanceof ShareAuthenticationError;
    }

    async handle(ctx: Context, err: AuthenticationError): Promise<void> {
        if (err instanceof ShareAuthenticationError) {
            ctx.response.setHeader(HttpHeaders.WWW_AUTHENTICATE, `${AUTHENTICATION_SCHEME_CB_SHARE} realm="${this.realm}"`);
            ctx.response.statusCode = HttpStatus.UNAUTHORIZED;
            ctx.response.end(err.message);
        } else {
            ctx.response.statusCode = HttpStatus.FORBIDDEN;
            ctx.response.end(HttpStatus.FORBIDDEN_REASON_PHRASE);
        }
    }
}
