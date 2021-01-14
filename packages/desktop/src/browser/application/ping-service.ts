import { Component } from '@malagu/core';
import { PingService } from '@theia/core/lib/browser/connection-status-service';

@Component({ id: PingService, rebind: true })
export class PingServiceImpl implements PingService {
    ping(): Promise<void> {
        return Promise.resolve();
    }

}
