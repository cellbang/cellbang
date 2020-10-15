
import { autoBind } from '@malagu/core';
import { ProcessManager } from '@theia/process/lib/node/process-manager';
import { ApplicationLifecycle } from '@malagu/core';

export default autoBind((bind, unbind, isBound, rebind) => {
    bind(ApplicationLifecycle).to(ProcessManager).inSingletonScope();
});
