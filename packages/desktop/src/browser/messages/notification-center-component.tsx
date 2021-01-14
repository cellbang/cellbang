import * as React from 'react';
import { NotificationCenterComponent } from '@theia/messages/lib/browser/notification-center-component';
import { NotificationComponentExt } from './notification-component';
import { IntlUtil } from '../utils';
const PerfectScrollbar = require('react-perfect-scrollbar');

export class NotificationCenterComponentExt extends NotificationCenterComponent {

    render(): React.ReactNode {
        const empty = this.state.notifications.length === 0;
        const title = empty ? IntlUtil.get('NO NEW NOTIFICATIONS') : IntlUtil.get('NOTIFICATIONS');
        return (
            <div className={`theia-notifications-container theia-notification-center ${this.state.visibilityState === 'center' ? 'open' : 'closed'}`}>
                <div className='theia-notification-center-header'>
                    <div className='theia-notification-center-header-title'>{title}</div>
                    <div className='theia-notification-center-header-actions'>
                        <ul className='theia-notification-actions'>
                            <li className='collapse' title={IntlUtil.get('Hide Notification Center')} onClick={this.onHide} />
                            <li className='clear-all' title={IntlUtil.get('Clear All')} onClick={this.onClearAll} />
                        </ul>
                    </div>
                </div>
                <PerfectScrollbar className='theia-notification-list-scroll-container'>
                    <div className='theia-notification-list'>
                        {this.state.notifications.map(notification =>
                            <NotificationComponentExt key={notification.messageId} notification={notification} manager={this.props.manager} />
                        )}
                    </div>
                </PerfectScrollbar>
            </div>
        );
    }

}
