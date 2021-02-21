import { BaseWidget, Message, Navigatable, StatefulWidget } from '@theia/core/lib/browser';
import URI from '@theia/core/lib/common/uri';
import { SelectionService, Event} from '@theia/core';
import { Injectable, Autowired, PostConstruct, Logger, ConfigUtil } from '@malagu/core';
import { Disposable } from '@theia/core/lib/common/disposable';
import { LabelProvider, NavigatableWidgetOptions } from '@theia/core/lib/browser';
import { KeybindingRegistry } from '@theia/core/lib/browser/keybinding';
import { WindowService } from '@theia/core/lib/browser/window/window-service';
import { parseCssTime } from '@theia/core/lib/browser';
import { Emitter } from '@theia/core/lib/common/event';
import { ApplicationShellMouseTracker } from '@theia/core/lib/browser/shell/application-shell-mouse-tracker';
import { EncodingService } from '@theia/core/lib/common/encoding-service';
import debounce = require('lodash.debounce');
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { FileChangesEvent, FileChangeType } from '@theia/filesystem/lib/common/files';
import { PageStyle } from './page-style';
import { IntlUtil } from '@cellbang/desktop/lib/browser';

export const PageWidgetOptions = Symbol('PageWidgetOptions');
export interface PageWidgetOptions extends NavigatableWidgetOptions {
}

export interface PageProps {
    location?: string;
}

@Injectable()
export class PageWidget extends BaseWidget implements Navigatable, StatefulWidget {

    static FACTORY_ID = 'page-opener';

    @Autowired(PageWidgetOptions)
    protected readonly pageWidgetOptions: PageWidgetOptions;

    @Autowired(LabelProvider)
    protected readonly labelProvider: LabelProvider;

    @Autowired(SelectionService)
    protected readonly selectionService: SelectionService;

    @Autowired(KeybindingRegistry)
    protected readonly keybindings: KeybindingRegistry;

    @Autowired(Logger)
    protected readonly logger: Logger;

    @Autowired(EncodingService)
    protected readonly encodingService: EncodingService;

    @Autowired(WindowService)
    protected readonly windowService: WindowService;

    @Autowired(ApplicationShellMouseTracker)
    protected readonly mouseTracker: ApplicationShellMouseTracker;

    @Autowired(FileService)
    protected readonly fileService: FileService;

    protected readonly refreshEmitter = new Emitter<void>();

    protected readonly loadIndicator: HTMLElement;
    protected readonly errorBar: HTMLElement & Readonly<{ message: HTMLElement }>;
    protected readonly frame: HTMLIFrameElement;
    // eslint-disable-next-line max-len
    // XXX This is a hack to be able to tack the mouse events when drag and dropping the widgets. On `mousedown` we put a transparent div over the `iframe` to avoid losing the mouse tacking.
    protected readonly transparentOverlay: HTMLElement;

    protected frameLoadTimeout: number;

    protected uri: URI;

    constructor() {
        super();
        this.node.tabIndex = 0;
        this.addClass(PageStyle.Page);
        this.createToolbar(this.node);
        const contentArea = this.createContentArea(this.node);
        this.frame = contentArea.frame;
        this.transparentOverlay = contentArea.transparentOverlay;
        this.loadIndicator = contentArea.loadIndicator;
        this.errorBar = contentArea.errorBar;
        this.toDispose.pushAll([ this.refreshEmitter ]);
    }

    @PostConstruct()
    protected async init(): Promise<void> {
        this.uri = new URI(this.pageWidgetOptions.uri);

        this.setLabels();
        const labelListener = this.labelProvider.onDidChange(event => {
            if (event.affects(this.uri)) {
                this.setLabels();
            }
        });
        this.onDispose(() => labelListener.dispose());

        this.id = this.id + ':' + this.uri.toString();
        this.title.closable = true;
        this.toDispose.push(this.mouseTracker.onMousedown(e => {
            if (this.frame.style.display !== 'none') {
                this.transparentOverlay.style.display = 'block';
            }
        }));
        this.toDispose.push(this.mouseTracker.onMouseup(e => {
            if (this.frame.style.display !== 'none') {
                this.transparentOverlay.style.display = 'none';
            }
        }));
        setTimeout(() => this.go(), 10);
        this.listenOnContentChange();
    }

    protected async parseContent() {
        const { value } = await this.fileService.readFile(this.uri);
        const decoded = this.encodingService.decode(value, 'utf8');
        const lines = decoded.split('\n');
        const pageProps: PageProps = {};
        for (const line of lines) {
            if (line.startsWith('URL=')) {
                pageProps.location = line.substr(4);
            }
        }

        return pageProps;
    }

    protected async listenOnContentChange(): Promise<void> {
        if (await this.fileService.exists(this.uri)) {
            const fileUri = this.uri;
            const watcher = this.fileService.watch(fileUri);
            this.toDispose.push(watcher);
            const onFileChange = (event: FileChangesEvent) => {
                if (event.contains(fileUri, FileChangeType.ADDED) || event.contains(fileUri, FileChangeType.UPDATED)) {
                    this.go({
                        showLoadIndicator: false
                    });
                }
            };
            this.toDispose.push(this.fileService.onDidFilesChange(debounce(onFileChange, 500)));
        }
    }

    protected createToolbar(parent: HTMLElement) {
        const toolbar = document.createElement('div');
        parent.appendChild(toolbar);
    }

    // eslint-disable-next-line max-len
    protected createContentArea(parent: HTMLElement): HTMLElement & Readonly<{ frame: HTMLIFrameElement, loadIndicator: HTMLElement, errorBar: HTMLElement & Readonly<{ message: HTMLElement }>, transparentOverlay: HTMLElement }> {
        const contentArea = document.createElement('div');
        contentArea.classList.add(PageStyle.CONTENT_AREA);

        const loadIndicator = document.createElement('div');
        loadIndicator.classList.add(PageStyle.PRE_LOAD);
        loadIndicator.style.display = 'none';

        const errorBar = this.createErrorBar();

        const frame = this.createIFrame();
        this.refreshEmitter.event(this.handleRefresh.bind(this));

        const transparentOverlay = document.createElement('div');
        transparentOverlay.classList.add(PageStyle.TRANSPARENT_OVERLAY);
        transparentOverlay.style.display = 'none';

        contentArea.appendChild(errorBar);
        contentArea.appendChild(transparentOverlay);
        contentArea.appendChild(loadIndicator);
        contentArea.appendChild(frame);

        parent.appendChild(contentArea);
        return Object.assign(contentArea, { frame, loadIndicator, errorBar, transparentOverlay });
    }

    protected createIFrame(): HTMLIFrameElement {
        const frame = document.createElement('iframe');
        frame.sandbox.add(...ConfigUtil.get<string[]>('cellbang.page.sandbox'));
        this.addEventListener(frame, 'load', this.onFrameLoad.bind(this));
        this.addEventListener(frame, 'error', this.onFrameError.bind(this));
        return frame;
    }

    protected createErrorBar(): HTMLElement & Readonly<{ message: HTMLElement }> {
        const errorBar = document.createElement('div');
        errorBar.classList.add(PageStyle.ERROR_BAR);
        errorBar.style.display = 'none';

        const icon = document.createElement('span');
        icon.classList.add('fa', 'problem-tab-icon');
        errorBar.appendChild(icon);

        const message = document.createElement('span');
        errorBar.appendChild(message);

        return Object.assign(errorBar, { message });
    }

    protected onFrameLoad(): void {
        clearTimeout(this.frameLoadTimeout);
        this.hideLoadIndicator();
        this.hideErrorBar();
    }

    protected onFrameError(): void {
        clearTimeout(this.frameLoadTimeout);
        this.hideLoadIndicator();
        this.showErrorBar(IntlUtil.get('An error occurred while loading this page')!);
    }

    protected onFrameTimeout(): void {
        clearTimeout(this.frameLoadTimeout);
        this.hideLoadIndicator();
        this.showErrorBar(IntlUtil.get('Still loading...')!);
    }

    protected showLoadIndicator(): void {
        this.loadIndicator.classList.remove(PageStyle.FADE_OUT);
        this.loadIndicator.style.display = 'block';
    }

    protected hideLoadIndicator(): void {
        // Start the fade-out transition.
        this.loadIndicator.classList.add(PageStyle.FADE_OUT);
        // Actually hide the load indicator after the transition is finished.
        const preloadStyle = window.getComputedStyle(this.loadIndicator);
        const transitionDuration = parseCssTime(preloadStyle.transitionDuration, 0);
        setTimeout(() => {
            // But don't hide it if it was shown again since the transition started.
            if (this.loadIndicator.classList.contains(PageStyle.FADE_OUT)) {
                this.loadIndicator.style.display = 'none';
                this.loadIndicator.classList.remove(PageStyle.FADE_OUT);
            }
        }, transitionDuration);
    }

    protected showErrorBar(message: string): void {
        this.errorBar.message.textContent = message;
        this.errorBar.style.display = 'block';
    }

    protected hideErrorBar(): void {
        this.errorBar.message.textContent = '';
        this.errorBar.style.display = 'none';
    }

    handleRefresh(): void {
        this.go();
    }

    protected contentDocument(): Document | null {
        try {
            let { contentDocument } = this.frame;
            // eslint-disable-next-line no-null/no-null
            if (contentDocument === null) {
                const { contentWindow } = this.frame;
                if (contentWindow) {
                    contentDocument = contentWindow.document;
                }
            }
            return contentDocument;
        } catch {
            // eslint-disable-next-line no-null/no-null
            return null;
        }
    }

    protected async go(options?: Partial<{
        /* default: true */
        showLoadIndicator: boolean,
        /* default: true */
        preserveFocus: boolean
    }>): Promise<void> {
        const { location } = await this.parseContent();
        const { showLoadIndicator, preserveFocus } = {
            showLoadIndicator: true,
            preserveFocus: true,
            ...options
        };
        if (location) {
            try {
                clearTimeout(this.frameLoadTimeout);
                this.frameLoadTimeout = window.setTimeout(this.onFrameTimeout.bind(this), 4000);
                if (showLoadIndicator) {
                    this.showLoadIndicator();
                }

                this.frame.style.display = 'block';
                this.frame.src = location;
                // The load indicator will hide itself if the content of the iframe was loaded.
                if (!preserveFocus) {
                    this.frame.addEventListener('load', () => {
                        const window = this.frame.contentWindow;
                        if (window) {
                            window.focus();
                        }
                    }, { once: true });
                }
                // Delegate all the `keypress` events from the `iframe` to the application.
                this.addEventListener(this.frame, 'load', () => {
                    try {
                        const { contentDocument } = this.frame;
                        if (contentDocument) {
                            const keypressHandler = (e: KeyboardEvent) => this.keybindings.run(e);
                            contentDocument.addEventListener('keypress', keypressHandler, true);
                            this.toDisposeOnDetach.push(Disposable.create(() => contentDocument.removeEventListener('keypress', keypressHandler)));
                        }
                    } catch {
                        // There is not much we could do with the security exceptions due to CORS.
                    }
                });
            } catch (e) {
                clearTimeout(this.frameLoadTimeout);
                this.hideLoadIndicator();
                this.showErrorBar(String(e));
                console.log(e);
            }
        }
    }

    protected setLabels(): void {
        this.title.caption = this.labelProvider.getLongName(this.uri);
        const icon = this.labelProvider.getIcon(this.uri);
        this.title.label = this.labelProvider.getName(this.uri);
        this.title.iconClass = icon + ' file-icon';
    }

    protected onActivateRequest(msg: Message): void {
        super.onActivateRequest(msg);
        this.selectionService.selection = this;
        this.node.focus();
    }

    storeState(): object {
        return {};
    }

    restoreState(oldState: object): void {
    }

    getResourceUri(): URI | undefined {
        return this.uri;
    }

    createMoveToUri(resourceUri: URI): URI | undefined {
        return this.uri?.withPath(resourceUri.path);
    }

    get onDispose(): Event<void> {
        return this.toDispose.onDispose;
    }
}
