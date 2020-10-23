import { Component } from '@malagu/core';
import { IntlUtil } from '../utils';
import { NotificationsContribution } from '@theia/messages/lib/browser/notifications-contribution';

@Component({ id: NotificationsContribution, rebind: true })
export class NotificationsContributionExt extends NotificationsContribution {

    protected getStatusBarItemTooltip(count: number): string {
        if (this.manager.centerVisible) {
            return 'Hide Notifications';
        }
        return count === 0
            ? 'No Notifications'
            : `${count} ${IntlUtil.get(count === 1 ? 'Notification' : 'Notifications')}`;
    }

}
