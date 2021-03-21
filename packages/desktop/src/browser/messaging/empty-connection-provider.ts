import { Component } from '@malagu/core';
import { Emitter, Event } from '@theia/core';
import { WebSocketConnectionProvider } from '@theia/core/lib/browser';
import { AbstractConnectionProvider } from '@theia/core/lib/common/messaging/abstract-connection-provider';
import { WebSocketChannel } from '@theia/core/lib/common/messaging/web-socket-channel';

@Component([WebSocketConnectionProvider])
export class EmptyConnectionProvider extends AbstractConnectionProvider<{}> {

    protected readonly onSocketDidOpenEmitter: Emitter<void> = new Emitter();
    readonly onSocketDidOpen: Event<void> = this.onSocketDidOpenEmitter.event;

    protected readonly onSocketDidCloseEmitter: Emitter<void> = new Emitter();
    readonly onSocketDidClose: Event<void> = this.onSocketDidCloseEmitter.event;

    protected createChannel(id: number): WebSocketChannel {
        return new WebSocketChannel(id, content => {  });
    }

}
