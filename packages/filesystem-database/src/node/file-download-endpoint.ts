
import { FileUri } from '@theia/core/lib/node/file-uri';
import { MVC_HANDLER_ADAPTER_PRIORITY } from '@malagu/mvc/lib/node';
import { Autowired, Component } from '@malagu/core';
import { Context, HandlerAdapter } from '@malagu/web/lib/node';
import { GetFileHandlerAdapter, DownloadLinkHandlerAdapter, SingFileDownloadHandlerAdapter, MultiFileDownloadHandlerAdapter } from '@cellbang/filesystem/lib/node';
import { FileSystemProvider } from '@theia/filesystem/lib/common/files';
import { DownloadLinkHandler, FileDownloadHandler, MultiFileDownloadHandler, SingleFileDownloadHandler } from './file-download-handler';

@Component(HandlerAdapter)
export class DatabaseDownloadLinkHandlerAdapter extends DownloadLinkHandlerAdapter {
    readonly priority = MVC_HANDLER_ADAPTER_PRIORITY + 15;

    @Autowired(DownloadLinkHandler)
    protected readonly databaseDownloadLinkHandler: FileDownloadHandler;

    handle(): Promise<void> {
        Context.setSkipAutoEnd(true);
        return this.databaseDownloadLinkHandler.handle(Context.getRequest() as any, Context.getResponse() as any);

    }

}

@Component(HandlerAdapter)
export class DatabaseSingFileDownloadHandlerAdapter extends SingFileDownloadHandlerAdapter {
    readonly priority = MVC_HANDLER_ADAPTER_PRIORITY + 15;

    @Autowired(SingleFileDownloadHandler)
    protected readonly databaseSingleFileDownloadHandler: FileDownloadHandler;

    handle(): Promise<void> {
        return this.databaseSingleFileDownloadHandler.handle(Context.getRequest() as any, Context.getResponse() as any);
    }
}

@Component(HandlerAdapter)
export class DatabaseMultiFileDownloadHandlerAdapter extends MultiFileDownloadHandlerAdapter {
    readonly priority = MVC_HANDLER_ADAPTER_PRIORITY + 15;

    @Autowired(MultiFileDownloadHandler)
    protected readonly databaseMultiFileDownloadHandler: FileDownloadHandler;

    handle(): Promise<void> {
        return this.databaseMultiFileDownloadHandler.handle(Context.getRequest() as any, Context.getResponse() as any);
    }
}

@Component(HandlerAdapter)
export class DatabaseGetFileHandlerAdapter extends GetFileHandlerAdapter {

    readonly priority = MVC_HANDLER_ADAPTER_PRIORITY + 15;

    @Autowired(FileSystemProvider)
    protected readonly fileSystemProvider: FileSystemProvider;

    handle(): Promise<void> {
        const response = Context.getResponse();
        const uri = <string>Context.getRequest().query.uri;
        if (!uri) {
            response.statusCode = 400;
            response.body = 'invalid uri';
            return Promise.resolve();
        }
        const fsPath = FileUri.create(decodeURIComponent(uri));
        response.body = this.fileSystemProvider.readFile!(fsPath);
        return Promise.resolve();
    }

}
