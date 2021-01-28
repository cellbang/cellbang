
import { AclPolicy, PolicyType, Effect } from '@malagu/security';
import { ContainerUtil, TenantProvider } from '@malagu/core';

export const FILE_SERVICE_NAME = 'file';

export namespace FileActions {
    export const stat = `${FILE_SERVICE_NAME}:stat`;
    export const access = `${FILE_SERVICE_NAME}:access`;
    export const readdir = `${FILE_SERVICE_NAME}:readdir`;
    export const readFile = `${FILE_SERVICE_NAME}:readFile`;
    export const writeFile = `${FILE_SERVICE_NAME}:writeFile`;
    export const mkdir = `${FILE_SERVICE_NAME}:mkdir`;
    export const del = `${FILE_SERVICE_NAME}:delete`;
    export const rename = `${FILE_SERVICE_NAME}:rename`;
    export const copy = `${FILE_SERVICE_NAME}:copy`;
    export const updateFile = `${FILE_SERVICE_NAME}:updateFile`;
    export const upload = `${FILE_SERVICE_NAME}:upload`;
    export const download = `${FILE_SERVICE_NAME}:download`;
}

export const enum FilePermission {
    read = 'read', write = 'write', mkdir = 'mkdir', del = 'del', upload = 'upload', download = 'download'
}

export const PermissionMap: { [key: string]: string[] } = {
    [FilePermission.read]: [ FileActions.access, FileActions.readFile, FileActions.readdir, FileActions.stat ],
    [FilePermission.write]: [ FileActions.writeFile, FileActions.updateFile ],
    [FilePermission.mkdir]: [ FileActions.mkdir ],
    [FilePermission.del]: [ FileActions.del ],
    [FilePermission.upload]: [ FileActions.upload ],
    [FilePermission.download]: [ FileActions.download ]
};

export namespace PolicyUtils {
    export async function getPolicy(resource: string | string[], ...permissions: string[]) {
        const resources = Array.isArray(resource) ? resource : [resource];
        const tenantProvider = ContainerUtil.get<TenantProvider>(TenantProvider);
        const tenant = await tenantProvider.provide();
        return <AclPolicy>{
            type: PolicyType.acl,
            version: '2021-01-26',
            statement: [{
                effect: Effect.Allow,
                action: permissions.reduce<string[]>((acc, cur) => acc.concat(PermissionMap[cur] || []), []),
                resource: resources.map(r => `${tenant}:${FILE_SERVICE_NAME}:${r}`)
            }]
        };
    }
}
