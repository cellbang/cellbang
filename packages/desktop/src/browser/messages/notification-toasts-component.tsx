import * as React from 'react';
import { NotificationComponentExt } from './notification-component';
import { NotificationToastsComponent } from '@theia/messages/lib/browser/notification-toasts-component';

export class NotificationToastsComponentExt extends NotificationToastsComponent {

    render(): React.ReactNode {
        return (
            <div className={`theia-notifications-container theia-notification-toasts ${this.state.visibilityState === 'toasts' ? 'open' : 'closed'}`}>
                <div className='theia-notification-list'>
                    {this.state.toasts.map(notification => <NotificationComponentExt key={notification.messageId} notification={notification} manager={this.props.manager} />)}
                </div>
            </div>
        );
    }

}
