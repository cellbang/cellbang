import { IntlUtil } from '@cellbang/desktop/lib/browser';
import { Component, Autowired } from '@malagu/core';
import { ErrorConverter, GlobalConverter } from '@malagu/rpc';
import { MessageService } from '@theia/core';
import { parse } from 'querystring';

@Component({ id: ErrorConverter, name: GlobalConverter })
export class GlobalErrorConverter implements ErrorConverter {

    @Autowired(MessageService)
    protected readonly messageService: MessageService;

    serialize(e: any) {
    }

    deserialize(e: any) {
        this.handleUnauthorizedInSharing(e);
    }

    protected handleUnauthorizedInSharing(e: any) {

        if (e.toString().endsWith('Unauthorized')) {
            if (this.getShareId()) {
                this.messageService.warn(IntlUtil.get('Forbidden')!);
            }
        }

        if (e.toString().endsWith('Forbidden')) {
            this.messageService.warn(IntlUtil.get('Forbidden')!);
        }
    }

    protected getShareId() {
        return parse(location.search && location.search.substring(1))['share'] as string;
    }

}
