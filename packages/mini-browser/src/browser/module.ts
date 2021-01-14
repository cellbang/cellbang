
import { autoBind } from '@malagu/core';
import { ProxyProvider } from '@malagu/rpc';
import { MiniBrowserService } from '@theia/mini-browser/lib/common/mini-browser-service';
import '.';

export default autoBind((bind, unbind, isBound, rebind) => {
    rebind(MiniBrowserService).toDynamicValue(ctx => {
        const path = MiniBrowserService.toString();
        const proxyProvider = ctx.container.get<ProxyProvider>(ProxyProvider);
        return proxyProvider.provide(path);
    });
});
