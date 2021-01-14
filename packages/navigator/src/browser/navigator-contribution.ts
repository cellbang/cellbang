import { FileNavigatorContribution } from '@theia/navigator/lib/browser/navigator-contribution';
import { FrontendApplication } from '@theia/core/lib/browser';

import { Component } from '@malagu/core';

@Component({ id: FileNavigatorContribution, rebind: true })
export class FileNavigatorContributionExt extends FileNavigatorContribution {

    async initializeLayout(app: FrontendApplication): Promise<void> {
        await this.openView({
            toggle: false,
            reveal: true
        });
        this.shell.expandPanel('left');
    }

}
