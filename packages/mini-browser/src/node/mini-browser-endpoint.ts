import { MiniBrowserEndpoint } from '@theia/mini-browser/lib/node/mini-browser-endpoint';
import { Autowired, ApplicationLifecycle } from '@malagu/core';
import { BackendApplication } from '@malagu/core/lib/node';
import { Context, HandlerAdapter, RequestMatcher } from '@malagu/web/lib/node';
import { MVC_HANDLER_ADAPTER_PRIORITY } from '@malagu/mvc/lib/node';
import { Rpc } from '@malagu/rpc';
import { PathResolver } from '@malagu/web';
import { MiniBrowserService } from '@theia/mini-browser/lib/common/mini-browser-service';

@Rpc({ id: [MiniBrowserService, HandlerAdapter, ApplicationLifecycle], rebind: true})
@Rpc('', 'dd')
export class MiniBrowserEndpointExt extends MiniBrowserEndpoint implements HandlerAdapter, ApplicationLifecycle<BackendApplication> {
    readonly priority = MVC_HANDLER_ADAPTER_PRIORITY + 10;

    @Autowired(RequestMatcher)
    protected readonly requestMatcher: RequestMatcher;

    @Autowired(PathResolver)
    protected readonly pathResolver: PathResolver;

    async canHandle(): Promise<boolean> {
        return this.requestMatcher.match(await this.pathResolver.resolve(`${MiniBrowserEndpoint.HANDLE_PATH}*`));
    }

    async handle(): Promise<void> {
        Context.setSkipAutoEnd(true);
        await this.response(await this.getUri(Context.getRequest() as any), Context.getResponse() as any);
    }
}
