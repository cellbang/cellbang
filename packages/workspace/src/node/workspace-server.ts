import { DefaultWorkspaceServer } from '@theia/workspace/lib/node';
import { Value } from '@malagu/core';
import { Rpc } from '@malagu/rpc';
import { WorkspaceServer } from '@theia/workspace/lib/common';

@Rpc({ id: WorkspaceServer, rebind: true })
export class WorkspaceServerImpl extends DefaultWorkspaceServer {

    @Value('cellbang.workspace.root')
    protected readonly _root?: string;

    protected async getRoot(): Promise<string | undefined> {
        let root = this._root;
        if (!root) {
            const data = await this.readRecentWorkspacePathsFromUserHome();
            if (data && data.recentRoots) {
                root = data.recentRoots[0];
            }
        }
        return root;
    }
}
