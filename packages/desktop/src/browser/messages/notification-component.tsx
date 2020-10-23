
import * as React from 'react';
import { NotificationComponent } from '@theia/messages/lib/browser/notification-component';
import { IntlUtil } from '../utils';

export class NotificationComponentExt extends NotificationComponent {

    render(): React.ReactNode {
        const { messageId, message, type, progress, collapsed, expandable, source, actions } = this.props.notification;
        const isProgress = typeof progress === 'number';
        return (<div key={messageId} className='theia-notification-list-item'>
            <div className={`theia-notification-list-item-content ${collapsed ? 'collapsed' : ''}`}>
                <div className='theia-notification-list-item-content-main'>
                    <div className={`theia-notification-icon theia-notification-icon-${type}`} />
                    <div className='theia-notification-message'>
                        <span dangerouslySetInnerHTML={{ __html: IntlUtil.get(message)! }} onClick={this.onMessageClick} />
                    </div>
                    <ul className='theia-notification-actions'>
                        {expandable && (
                            <li className={collapsed ? 'expand' : 'collapse'} title={IntlUtil.get(collapsed ? 'Expand' : 'Collapse')}
                                data-message-id={messageId} onClick={this.onToggleExpansion} />
                        )}
                        { !isProgress && (<li className='clear' title={IntlUtil.get('Clear')} data-message-id={messageId} onClick={this.onClear} />)}
                    </ul>
                </div>
                {(source || !!actions.length) && (
                    <div className='theia-notification-list-item-content-bottom'>
                        <div className='theia-notification-source'>
                            {source && (<span>{IntlUtil.get(source)}</span>)}
                        </div>
                        <div className='theia-notification-buttons'>
                            {actions && actions.map((action, index) => (
                                <button key={messageId + `-action-${index}`} className='theia-button'
                                    data-message-id={messageId} data-action={action}
                                    onClick={this.onAction}>
                                    {IntlUtil.get(action)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            { isProgress && (
                <div className='theia-notification-item-progress'>
                    <div className='theia-notification-item-progressbar' style={{ width: `${progress}%` }} />
                </div>
            )}
        </div>);
    }

}
