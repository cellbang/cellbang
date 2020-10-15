
import { autoBind } from '@malagu/core';
import { ProxyProvider } from '@malagu/rpc/lib/browser';
import { FileSearchService } from '@theia/file-search/lib/common/file-search-service';

export default autoBind((bind, unbind, isBound, rebind) => {
    rebind(FileSearchService).toDynamicValue(ctx => {
        const path = FileSearchService.toString();
        const proxyProvider = ctx.container.get<ProxyProvider>(ProxyProvider);
        const proxy = proxyProvider.provide(path);
        (proxy as any).setClient = () => {};
        return proxy;
    });
});
