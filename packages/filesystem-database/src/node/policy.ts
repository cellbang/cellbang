import { AclPolicy, PolicyType, Effect } from '@malagu/security';
import { Context } from '@malagu/web/lib/node';
import { FileUri } from '@theia/core/lib/node/file-uri';

export const FILE_SERVICE_NAME = 'file';

export namespace FileActions {
    export const listMember = `${FILE_SERVICE_NAME}:listMember`;
    export const deleteMember = `${FILE_SERVICE_NAME}:deleteMember`;
    export const updateMember = `${FILE_SERVICE_NAME}:updateMember`;

    export const createCollaboration = `${FILE_SERVICE_NAME}:createCollaboration`;
    export const updateCollaboration = `${FILE_SERVICE_NAME}:updateCollaboration`;
    export const readCollaboration = `${FILE_SERVICE_NAME}:readCollaboration`;

    export const createShare = `${FILE_SERVICE_NAME}:createShare`;
    export const updateShare = `${FILE_SERVICE_NAME}:updateShare`;
    export const readShare = `${FILE_SERVICE_NAME}:readShare`;

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

export const enum FileRole {
    admin = 'admin', member = 'member', guest = 'guest'
}

export const PermissionMap: { [key: string]: string[] } = {
    [FilePermission.read]: [ FileActions.access, FileActions.readFile, FileActions.readdir, FileActions.stat,
        FileActions.listMember, FileActions.readCollaboration, FileActions.readShare ],
    [FilePermission.write]: [ FileActions.writeFile, FileActions.updateFile, FileActions.updateMember, FileActions.createCollaboration,
        FileActions.updateCollaboration, FileActions.createShare, FileActions.updateShare ],
    [FilePermission.mkdir]: [ FileActions.mkdir ],
    [FilePermission.del]: [ FileActions.del, FileActions.deleteMember ],
    [FilePermission.upload]: [ FileActions.upload ],
    [FilePermission.download]: [ FileActions.download ]
};

export const RolePermissionMap: { [role: string]: string[] } = {
    [FileRole.admin]: ['*'],
    [FileRole.member]: [ FilePermission.del, FilePermission.download, FilePermission.upload, FilePermission.mkdir, FilePermission.read, FilePermission.write ],
    [FileRole.guest]: [ FilePermission.read ]
};

export namespace PolicyUtils {
    export async function getPolicy(resource: string | string[], ...permissions: string[]) {
        const resources = Array.isArray(resource) ? resource : [resource];
        return <AclPolicy>{
            type: PolicyType.acl,
            statement: [{
                effect: Effect.Allow,
                action: permissions.reduce<string[]>((acc, cur) => acc.concat(PermissionMap[cur] || []), []),
                resource: resources.map(r => ResourceUtils.getReource(r))
            }]
        };
    }

}

export namespace ResourceUtils {

    export function getReource(resource: string) {
        const tenant = Context.getTenant();
        return `${tenant}:${FILE_SERVICE_NAME}:${FileUri.fsPath(resource)}`;
    }

}

