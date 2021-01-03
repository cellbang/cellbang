
import '../../src/browser/style/index.css';

import { autoBind } from '@malagu/core';
import { CommonFrontendContribution, PreferenceProviderProvider, PreferenceSchemaProvider, PreferenceScope } from '@theia/core/lib/browser';
import '.';
import { Condition } from '../common/utils';
import { DesktopCommonFrontendContribution } from './application/common-contribution';
import { QuickCommandFrontendContribution } from '@theia/core/lib/browser';
import { DesktopQuickCommandContribution } from './application/quick-command-contribution';

export default autoBind((bind, unbind, isBound, rebind) => {
    rebind(PreferenceProviderProvider).toFactory(ctx => (scope: PreferenceScope) => ctx.container.get(PreferenceSchemaProvider));
    if (!Condition.isEditorMode()) {
        rebind(CommonFrontendContribution).to(DesktopCommonFrontendContribution).inSingletonScope();
        rebind(QuickCommandFrontendContribution).to(DesktopQuickCommandContribution).inSingletonScope();
    }
});
