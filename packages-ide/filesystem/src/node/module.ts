
import { autoBind } from '@malagu/core';
import { EncodingService } from '@theia/core/lib/common/encoding-service';
import '.';
import '../common';

export default autoBind((bind, unbind, isBound, rebind) => {
    bind(EncodingService).toSelf().inSingletonScope();
});
