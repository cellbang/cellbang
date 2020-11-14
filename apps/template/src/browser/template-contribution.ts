import URI from '@theia/core/lib/common/uri';
import { FrontendApplicationContribution, FrontendApplication } from '@theia/core/lib/browser';
import { FrontendApplicationStateService } from '@theia/core/lib/browser/frontend-application-state';
import { OpenerService, open } from '@theia/core/lib/browser';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { Autowired, Component } from '@malagu/core';

@Component(FrontendApplicationContribution)
export class GettingStartedContribution  implements FrontendApplicationContribution {

    @Autowired(FrontendApplicationStateService)
    protected readonly stateService: FrontendApplicationStateService;

    @Autowired(WorkspaceService)
    protected readonly workspaceService: WorkspaceService;

    @Autowired(OpenerService)
    protected openerService: OpenerService;

    async onStart(app: FrontendApplication): Promise<void> {
        if (this.workspaceService.opened) {
            this.stateService.reachedState('ready').then(
                () => open(this.openerService, new URI('/code/templates/README.md'))
            );
        }
    }
}
