
import { autoBind } from '@malagu/core';
import { PreferenceProviderProvider, PreferenceSchemaProvider, PreferenceScope, PreferenceProvider } from '@theia/core/lib/browser';

export default autoBind((bind, unbind, isBound, rebind) => {
    rebind(PreferenceProviderProvider).toFactory(ctx => (scope: PreferenceScope) => {
        if (scope === PreferenceScope.Default) {
            return ctx.container.get(PreferenceSchemaProvider);
        }
        return ctx.container.getNamed(PreferenceProvider, scope);
    });
});
