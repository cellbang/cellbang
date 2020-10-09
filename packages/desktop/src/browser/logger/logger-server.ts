import { Component } from '@malagu/core';
import { ConsoleLogger, ILoggerClient, ILoggerServer, LogLevel } from '@theia/core/lib/common/logger-protocol';

@Component({ id: ILoggerServer, rebind: true })
export class EmptyLoggerServer implements ILoggerServer {

    setLogLevel(name: string, logLevel: number): Promise<void> {
        return Promise.resolve();
    }

    getLogLevel(name: string): Promise<number> {
        return Promise.resolve(LogLevel.ERROR);
    }

    log(name: string, logLevel: number, message: any, params: any[]): Promise<void> {
        ConsoleLogger.log(name, logLevel, message, params);
        return Promise.resolve();
    }

    child(name: string): Promise<void> {
        return Promise.resolve();
    }

    dispose(): void {
        // NoOp
    }

    setClient(client: ILoggerClient | undefined): void {
        // NoOp
    }

}
