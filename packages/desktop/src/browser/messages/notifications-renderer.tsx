import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { NotificationCenterComponentExt } from './notification-center-component';
import { NotificationToastsComponentExt } from './notification-toasts-component';
import { NotificationsRenderer } from '@theia/messages/lib/browser/notifications-renderer';
import { Component } from '@malagu/core';

@Component({ id: NotificationsRenderer, rebind: true })
export class NotificationsRendererExt extends NotificationsRenderer {

    protected render(): void {
        ReactDOM.render(<div>
            <NotificationToastsComponentExt manager={this.manager} corePreferences={this.corePreferences} />
            <NotificationCenterComponentExt manager={this.manager} />
        </div>, this.container);
    }

}
