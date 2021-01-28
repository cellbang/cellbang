import { IntlUtil } from '@cellbang/desktop/lib/browser';
import { Component, Autowired } from '@malagu/core';
import { ErrorConverter, GlobalConverter } from '@malagu/rpc';
import { MessageService } from '@theia/core';
import { ShareService } from '../common';

@Component({ id: ErrorConverter, name: GlobalConverter })
export class GlobalErrorConverter implements ErrorConverter {

    @Autowired(MessageService)
    protected readonly messageService: MessageService;

    @Autowired(ShareService)
    protected readonly shareService: ShareService;

    serialize(e: any) {
    }

    deserialize(e: any) {
        this.handleUnauthorizedInSharing(e);
    }

    protected handleUnauthorizedInSharing(e: any) {

        if (e.toString().endsWith('Unauthorized')) {
            if (this.shareService.getShareId()) {
                this.messageService.warn(IntlUtil.get('Forbidden')!);
            }
        }

        if (e.toString().endsWith('Forbidden')) {
            this.messageService.warn(IntlUtil.get('Forbidden')!);
        }
    }

}
