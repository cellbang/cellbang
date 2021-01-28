import { TenantProvider } from '@malagu/core';
import { Component } from '@malagu/core';
import { Context, AttributeScope } from '@malagu/web/lib/node';
import { SecurityContext } from '@malagu/security/lib/node';
import { CURRENT_SHARE_REQUEST_KEY } from './share-middleware';
import { Share } from '../common';

@Component({ id: TenantProvider, rebind: true })
export class ShareTenantProvider implements TenantProvider {
    async provide(tenant?: string): Promise<string> {
        if (tenant) {
            return tenant;
        }
        const share = Context.getAttr<Share>(CURRENT_SHARE_REQUEST_KEY, AttributeScope.Request);
        return share?.tenant || SecurityContext.getAuthentication().name;
    }
}
