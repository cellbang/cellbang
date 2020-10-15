
import { autoBind } from '@malagu/core';
// import { PreferenceProviderProvider, PreferenceSchemaProvider, PreferenceScope } from '@theia/core/lib/browser';
import '.';

export default autoBind((bind, unbind, isBound, rebind) => {
    // rebind(PreferenceProviderProvider).toFactory(ctx => (scope: PreferenceScope) => ctx.container.get(PreferenceSchemaProvider));
});
