
import { autoBind } from '@malagu/core';
import { WorkspaceServer } from '@theia/workspace/lib/common';
import { ProxyProvider } from '@malagu/rpc';
import '.';

export default autoBind((bind, unbind, isBound, rebind) => {
    rebind(WorkspaceServer).toDynamicValue(ctx => {
        const path = WorkspaceServer.toString();
        const proxyProvider = ctx.container.get<ProxyProvider>(ProxyProvider);
        return proxyProvider.provide(path);
    });
});
