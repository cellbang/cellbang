require('es6-promise/auto');
import { ConfigUtil } from '@malagu/core';
import { FrontendApplicationConfigProvider} from '@theia/core/lib/browser/frontend-application-config-provider';

const { cellbang: { desktop } } = ConfigUtil.getRaw();
FrontendApplicationConfigProvider.set({
    defaultTheme: desktop.defaultTheme,
    defaultIconTheme: desktop.defaultIconTheme,
    applicationName: desktop.applicationName
});

import { frontendApplicationModule } from '@theia/core/lib/browser/frontend-application-module';

export default frontendApplicationModule;
