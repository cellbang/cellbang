import { Component, Value } from '@malagu/core';
import { EnvVariable, EnvVariablesServer } from '@theia/core/lib/common/env-variables';

@Component({ id: EnvVariablesServer, rebind: true })
export class EnvVariablesServerImpl implements EnvVariablesServer {

    @Value('cellbang.env')
    protected readonly config: any;

    async getExecPath(): Promise<string> {
        return this.config.execPath;
    }

    async getVariables(): Promise<EnvVariable[]> {
        return [];
    }

    async getValue(key: string): Promise<EnvVariable | undefined> {
        return;
    }

    getConfigDirUri(): Promise<string> {
        return Promise.resolve(this.config.configDirUri);
    }

    async getHomeDirUri(): Promise<string> {
        return Promise.resolve(this.config.HomeDirUri);
    }

    async getDrives(): Promise<string[]> {
        return [];
    }

}
