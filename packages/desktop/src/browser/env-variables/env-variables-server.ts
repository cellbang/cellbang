import { Component } from '@malagu/core';
import { EnvVariable, EnvVariablesServer } from '@theia/core/lib/common/env-variables';

@Component({ id: EnvVariablesServer, rebind: true })
export class EnvVariablesServerImpl implements EnvVariablesServer {

    async getExecPath(): Promise<string> {
        return '/';
    }

    async getVariables(): Promise<EnvVariable[]> {
        return [];
    }

    async getValue(key: string): Promise<EnvVariable | undefined> {
        return;
    }

    getConfigDirUri(): Promise<string> {
        return Promise.resolve('.theia');
    }

    async getHomeDirUri(): Promise<string> {
        return Promise.resolve('/');
    }

    async getDrives(): Promise<string[]> {
        return [];
    }

}
