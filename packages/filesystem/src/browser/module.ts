
import { autoBind } from '@malagu/core';
import { ErrorConverter } from '@malagu/rpc';
import { ProxyProvider } from '@malagu/rpc/lib/browser';
import { RemoteFileSystemServer } from '@theia/filesystem/lib/common/remote-file-system-provider';
import '.';
import '../common';

export default autoBind((bind, unbind, isBound, rebind) => {
    rebind(RemoteFileSystemServer).toDynamicValue(ctx => {
        const path = RemoteFileSystemServer.toString();
        const proxyProvider = ctx.container.get<ProxyProvider>(ProxyProvider);
        const errorConverters = [ctx.container.getNamed<ErrorConverter>(ErrorConverter, RemoteFileSystemServer)];
        const proxy = proxyProvider.provide(path, errorConverters);
        (proxy as any).setClient = () => {};
        return proxy;
    });
});
