import { Component } from '@malagu/core';
import { WebSocketConnectionProvider } from '@theia/core/lib/browser';
import { AbstractConnectionProvider } from '@theia/core/lib/common/messaging/abstract-connection-provider';
import { WebSocketChannel } from '@theia/core/lib/common/messaging/web-socket-channel';

@Component([WebSocketConnectionProvider])
export class EmptyConnectionProvider extends AbstractConnectionProvider<{}> {

    protected createChannel(id: number): WebSocketChannel {
        return new WebSocketChannel(id, content => {  });
    }

}
