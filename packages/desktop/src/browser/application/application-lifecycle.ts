import { ApplicationLifecycle, Component, ContainerProvider } from '@malagu/core';
import { FrontendApplication } from '@malagu/core/lib/browser';
import { ThemeService } from '@theia/core/lib/browser/theming';
import { FrontendApplication as TheiaFrontendApplication} from '@theia/core/lib/browser';
import { Autowired } from '@malagu/core';

@Component(ApplicationLifecycle)
export class ApplicationLifecycleImpl implements ApplicationLifecycle<FrontendApplication> {

    @Autowired(TheiaFrontendApplication)
    protected readonly theiaFrontendApplication: TheiaFrontendApplication;

    initialize?(): void {
        const globel: any = window;
        (globel['theia'] = globel['theia'] || {}).container = ContainerProvider.provide();
        const themeService = ThemeService.get();
        themeService.loadUserTheme();
        this.theiaFrontendApplication.start();
    }

}
