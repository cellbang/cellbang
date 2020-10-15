
import { named } from 'inversify';
import { FileUri } from '@theia/core/lib/node/file-uri';
import { MVC_HANDLER_ADAPTER_PRIORITY } from '@malagu/mvc/lib/node';
import { Autowired, Component } from '@malagu/core';
import { Context, HandlerAdapter, RequestMatcher } from '@malagu/web/lib/node';
import { PathResolver, HttpMethod } from '@malagu/web';
import { FileDownloadHandler } from '@theia/filesystem/lib/node/download/file-download-handler';
import { readFileSync } from 'fs';

@Component(HandlerAdapter)
export class DownloadLinkHandlerAdapter implements HandlerAdapter {
    readonly priority = MVC_HANDLER_ADAPTER_PRIORITY + 10;

    @Autowired(RequestMatcher)
    protected readonly requestMatcher: RequestMatcher;

    @Autowired(PathResolver)
    protected readonly pathResolver: PathResolver;

    @Autowired(FileDownloadHandler)
    @named(FileDownloadHandler.DOWNLOAD_LINK)
    protected readonly downloadLinkHandler: FileDownloadHandler;

    handle(): Promise<void> {
        Context.setSkipAutoEnd(true);
        return this.downloadLinkHandler.handle(Context.getRequest() as any, Context.getResponse() as any);

    }

    async canHandle(): Promise<boolean> {
        return this.requestMatcher.match(await this.pathResolver.resolve('/files/download/'));
    }

}

@Component(HandlerAdapter)
export class SingFileDownloadHandlerAdapter implements HandlerAdapter {
    readonly priority = MVC_HANDLER_ADAPTER_PRIORITY + 10;

    @Autowired(RequestMatcher)
    protected readonly requestMatcher: RequestMatcher;

    @Autowired(PathResolver)
    protected readonly pathResolver: PathResolver;

    @Autowired(FileDownloadHandler)
    @named(FileDownloadHandler.SINGLE)
    protected readonly singleFileDownloadHandler: FileDownloadHandler;

    handle(): Promise<void> {
        return this.singleFileDownloadHandler.handle(Context.getRequest() as any, Context.getResponse() as any);
    }

    async canHandle(): Promise<boolean> {
        return this.requestMatcher.match(await this.pathResolver.resolve('/files/'), HttpMethod.GET);
    }

}

@Component(HandlerAdapter)
export class MultiFileDownloadHandlerAdapter implements HandlerAdapter {
    readonly priority = MVC_HANDLER_ADAPTER_PRIORITY + 10;

    @Autowired(RequestMatcher)
    protected readonly requestMatcher: RequestMatcher;

    @Autowired(PathResolver)
    protected readonly pathResolver: PathResolver;

    @Autowired(FileDownloadHandler)
    @named(FileDownloadHandler.MULTI)
    protected readonly multiFileDownloadHandler: FileDownloadHandler;

    handle(): Promise<void> {
        return this.multiFileDownloadHandler.handle(Context.getRequest() as any, Context.getResponse() as any);
    }

    async canHandle(): Promise<boolean> {
        return this.requestMatcher.match(await this.pathResolver.resolve('/files'), HttpMethod.PUT);
    }

}

@Component(HandlerAdapter)
export class GetFileHandlerAdapter implements HandlerAdapter {
    readonly priority = MVC_HANDLER_ADAPTER_PRIORITY + 10;

    @Autowired(RequestMatcher)
    protected readonly requestMatcher: RequestMatcher;

    @Autowired(PathResolver)
    protected readonly pathResolver: PathResolver;

    handle(): Promise<void> {
        const response = Context.getResponse();
        const uri = Context.getRequest().query.uri;
        if (!uri) {
            response.statusCode = 400;
            response.body = 'invalid uri';
            return Promise.resolve();
        }
        const fsPath = FileUri.fsPath(decodeURIComponent(uri));
        response.body = readFileSync(fsPath, { encoding: 'utf8' });
        return Promise.resolve();
    }

    async canHandle(): Promise<boolean> {
        return this.requestMatcher.match(await this.pathResolver.resolve('/file/'), HttpMethod.GET);
    }

}
