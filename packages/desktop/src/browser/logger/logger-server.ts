import { postConstruct } from 'inversify';
import { ILoggerServer, ILoggerClient, ConsoleLogger } from '@theia/core/lib/common/logger-protocol';
import { LogLevel } from '@theia/core/lib/common/logger-protocol';
import { Component } from '@malagu/core';

@Component({ id: ILoggerServer, rebind: true })
export class ConsoleLoggerServer implements ILoggerServer {

    protected client: ILoggerClient | undefined = undefined;

    @postConstruct()
    protected init() {
    }

    async setLogLevel(name: string, newLogLevel: number): Promise<void> {
        const event = {
            loggerName: name,
            newLogLevel
        };
        if (this.client !== undefined) {
            this.client.onLogLevelChanged(event);
        }
    }

    async getLogLevel(name: string): Promise<number> {
        return LogLevel.ERROR;
    }

    // tslint:disable:no-any
    async log(name: string, logLevel: number, message: string, params: any[]): Promise<void> {
        const configuredLogLevel = await this.getLogLevel(name);
        if (logLevel >= configuredLogLevel) {
            ConsoleLogger.log(name, logLevel, message, params);
        }
    }

    async child(name: string): Promise<void> {
        this.setLogLevel(name, await this.getLogLevel(name));
    }

    dispose(): void { }

    setClient(client: ILoggerClient | undefined) {
        this.client = client;
    }

}
