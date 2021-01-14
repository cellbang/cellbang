
import '../../src/browser/style/index.css';

import { autoBind } from '@malagu/core';
import { CommonFrontendContribution, PreferenceProviderProvider, PreferenceSchemaProvider, PreferenceScope } from '@theia/core/lib/browser';
import '.';
import { Condition } from '../common/utils';
import { DesktopCommonFrontendContribution } from './application/common-contribution';
import { QuickCommandFrontendContribution } from '@theia/core/lib/browser';
import { DesktopQuickCommandContribution } from './application/quick-command-contribution';
import { EnvVariablesServerImpl } from '../common/env-variables';
import { EnvVariablesServer } from '@theia/core/lib/common/env-variables';

export default autoBind((bind, unbind, isBound, rebind) => {
    rebind(EnvVariablesServer).to(EnvVariablesServerImpl);
    rebind(PreferenceProviderProvider).toFactory(ctx => (scope: PreferenceScope) => ctx.container.get(PreferenceSchemaProvider));
    if (!Condition.isEditorMode()) {
        rebind(CommonFrontendContribution).to(DesktopCommonFrontendContribution).inSingletonScope();
        rebind(QuickCommandFrontendContribution).to(DesktopQuickCommandContribution).inSingletonScope();
    }
});
