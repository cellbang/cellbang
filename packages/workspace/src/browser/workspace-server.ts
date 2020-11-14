import { postConstruct } from 'inversify';
import { Deferred } from '@theia/core/lib/common/promise-util';
import { WorkspaceServer } from '@theia/workspace/lib/common';

import { Component, Value } from '@malagu/core';

@Component({ id: WorkspaceServer, rebind: true })
export class WorkspaceServerImpl implements WorkspaceServer {

    protected root: Deferred<string | undefined> = new Deferred();

    @Value('cellbang.workspace.root')
    protected readonly _root?: string;

    @postConstruct()
    protected async init() {
        const root = await this.getRoot();
        this.root.resolve(root);
    }

    protected async getRoot(): Promise<string | undefined> {
        return this._root;
    }

    getMostRecentlyUsedWorkspace(): Promise<string | undefined> {
        return this.root.promise;
    }

    async setMostRecentlyUsedWorkspace(uri: string): Promise<void> {
        this.root.resolve(uri);
    }

    async getRecentWorkspaces(): Promise<string[]> {
        return [];
    }
}
