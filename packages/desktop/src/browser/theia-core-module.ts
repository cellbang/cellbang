
import { FrontendApplicationConfigProvider} from '@theia/core/lib/browser/frontend-application-config-provider';

FrontendApplicationConfigProvider.set({
    defaultTheme: 'dark',
    defaultIconTheme: 'none',
    applicationName: 'Function Compute IDE'
});

import { frontendApplicationModule } from '@theia/core/lib/browser/frontend-application-module';

export default frontendApplicationModule;
