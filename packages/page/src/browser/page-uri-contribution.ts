import URI from '@theia/core/lib/common/uri';
import { LabelProviderContribution, URIIconReference } from '@theia/core/lib/browser';
import { WorkspaceUriLabelProviderContribution } from '@theia/workspace/lib/browser/workspace-uri-contribution';
import { Component } from '@malagu/core';
import { FileStat } from '@theia/filesystem/lib/common/files';

@Component(PageUriLabelProviderContribution, LabelProviderContribution)
export class PageUriLabelProviderContribution extends WorkspaceUriLabelProviderContribution {

    canHandle(element: object): number {
        let uri: URI | undefined;
        if (element instanceof URI) {
            uri = element;
        } else if (URIIconReference.is(element)) {
            uri = element.uri;
        } else if (FileStat.is(element)) {
            uri = element.resource;
        }
        if (uri?.path.ext === '.url') {
            return 20;
        }
        return 0;
    }

    getIcon(element: URI | URIIconReference | FileStat): string {
        return super.getIcon(element);
    }

    getName(element: URI | URIIconReference | FileStat): string | undefined {
        const uri = this.getUri(element);
        return uri && uri.path.name;
    }
}
