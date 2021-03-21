
import { autoBind } from '@malagu/core';
import { ProxyProvider, ConverterUtil } from '@malagu/rpc';
import { RemoteFileSystemServer } from '@theia/filesystem/lib/common/remote-file-system-provider';
import '.';
import '../common';

export default autoBind((bind, unbind, isBound, rebind) => {

    rebind(RemoteFileSystemServer).toDynamicValue(ctx => {
        const path = RemoteFileSystemServer.toString();
        const proxyProvider = ctx.container.get<ProxyProvider>(ProxyProvider);
        const errorConverters = ConverterUtil.getGlobalErrorConverters(ctx.container);
        const errorConverter = ConverterUtil.getErrorConverters(RemoteFileSystemServer, ctx.container);
        if (errorConverter) {
            errorConverters.push(errorConverter);
        }
        const proxy = proxyProvider.provide(path, errorConverters);
        (proxy as any).setClient = () => {};
        return proxy;
    });
});
