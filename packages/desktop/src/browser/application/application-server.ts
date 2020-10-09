import { OS } from '@theia/core/lib/common';
import { ApplicationServer, ExtensionInfo, ApplicationInfo } from '@theia/core/lib/common/application-protocol';
import { Component } from '@malagu/core';

@Component({ id: ApplicationServer, rebind: true })
export class ApplicationServerImpl implements ApplicationServer {

    getExtensionsInfos(): Promise<ExtensionInfo[]> {
        return Promise.resolve([]);
    }

    getApplicationInfo(): Promise<ApplicationInfo | undefined> {
        return Promise.resolve(undefined);
    }

    async getBackendOS(): Promise<OS.Type> {
        return OS.Type.Linux;
    }
}
