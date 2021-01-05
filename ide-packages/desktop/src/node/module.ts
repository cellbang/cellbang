
import { Container } from 'inversify';
import { autoBind } from '@malagu/core';
import { LoggerName, LoggerFactory, rootLoggerName, ILogger, Logger } from '@theia/core';
import { LoggerWatcher } from '@theia/core/lib/common/logger-watcher';
import '.';
import { ConsoleLoggerServer } from './console-logger-server';
import { ILoggerServer } from '@theia/core/lib/common/logger-protocol';

export default autoBind((bind, unbind, isBound, rebind) => {
    bind(LoggerName).toConstantValue(rootLoggerName);
    bind(ILogger).to(Logger).inSingletonScope().whenTargetIsDefault();
    bind(ILoggerServer).to(ConsoleLoggerServer).inSingletonScope();
    bind(LoggerWatcher).toSelf().inSingletonScope();
    bind(LoggerFactory).toFactory(ctx =>
        (name: string) => {
            const child = new Container({ defaultScope: 'Singleton' });
            child.parent = ctx.container;
            child.bind(ILogger).to(Logger).inTransientScope();
            child.bind(LoggerName).toConstantValue(name);
            return child.get(ILogger);
        }
    );
});
