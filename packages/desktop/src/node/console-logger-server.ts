import { postConstruct, injectable } from 'inversify';
import { LoggerWatcher } from '@theia/core/lib/common/logger-watcher';
import { ILoggerServer, ILoggerClient, ConsoleLogger } from '@theia/core/lib/common/logger-protocol';
import { LogLevel } from '@theia/core';
import { Autowired } from '@malagu/core';

export interface LogLevels {
    [key: string]: LogLevel,
}

@injectable()
export class ConsoleLoggerServer implements ILoggerServer {

    protected logLevels: LogLevels = {};

    protected defaultLogLevel: LogLevel = LogLevel.INFO;

    protected client: ILoggerClient | undefined = undefined;

    @Autowired(LoggerWatcher)
    protected watcher: LoggerWatcher;

    @postConstruct()
    protected init(): void {
        for (const name of Object.keys(this.logLevels)) {
            this.setLogLevel(name, this.logLevels[name]);
        }
    }

    async setLogLevel(name: string, newLogLevel: number): Promise<void> {
        const event = {
            loggerName: name,
            newLogLevel
        };
        if (this.client !== undefined) {
            this.client.onLogLevelChanged(event);
        }
        this.watcher.fireLogLevelChanged(event);
    }

    async getLogLevel(name: string): Promise<number> {
        return this.defaultLogLevel;
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
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

    setClient(client: ILoggerClient | undefined): void {
        this.client = client;
    }

}
