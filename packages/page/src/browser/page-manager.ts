import { Component, PostConstruct } from '@malagu/core';
import URI from '@theia/core/lib/common/uri';
import { Emitter, Event } from '@theia/core/lib/common';
import { WidgetOpenerOptions, NavigatableWidgetOpenHandler, OpenHandler } from '@theia/core/lib/browser';
import { PageWidget } from './page-widget';

@Component([PageManager, OpenHandler])
export class PageManager extends NavigatableWidgetOpenHandler<PageWidget> {

    readonly id = PageWidget.FACTORY_ID;

    readonly label = 'Page';

    protected readonly onActivePageChangedEmitter = new Emitter<PageWidget | undefined>();
    /**
     * Emit when the active page is changed.
     */
    readonly onActivePageChanged: Event<PageWidget | undefined> = this.onActivePageChangedEmitter.event;

    protected readonly onCurrentPageChangedEmitter = new Emitter<PageWidget | undefined>();
    /**
     * Emit when the current page is changed.
     */
    readonly onCurrentPageChanged: Event<PageWidget | undefined> = this.onCurrentPageChangedEmitter.event;

    @PostConstruct()
    protected init(): void {
        super.init();
        this.shell.onDidChangeActiveWidget(() => this.updateActiveEditor());
        this.shell.onDidChangeCurrentWidget(() => this.updateCurrentPage());
        this.onCreated(widget => {
            widget.onDidChangeVisibility(() => {
                if (widget.isVisible) {
                    this.addRecentlyVisible(widget);
                } else {
                    this.removeRecentlyVisible(widget);
                }
                this.updateCurrentPage();
            });
            widget.disposed.connect(() => {
                this.removeRecentlyVisible(widget);
                this.updateCurrentPage();
            });
        });
        for (const widget of this.all) {
            if (widget.isVisible) {
                this.addRecentlyVisible(widget);
            }
        }
        this.updateCurrentPage();

    }

    protected readonly recentlyVisibleIds: string[] = [];
    protected get recentlyVisible(): PageWidget | undefined {
        const id = this.recentlyVisibleIds[0];
        return id && this.all.find(w => w.id === id) || undefined;
    }
    protected addRecentlyVisible(widget: PageWidget): void {
        this.removeRecentlyVisible(widget);
        this.recentlyVisibleIds.unshift(widget.id);
    }
    protected removeRecentlyVisible(widget: PageWidget): void {
        const index = this.recentlyVisibleIds.indexOf(widget.id);
        if (index !== -1) {
            this.recentlyVisibleIds.splice(index, 1);
        }
    }

    protected _activePage: PageWidget | undefined;
    /**
     * The active page.
     * If there is an active page (one that has focus), active and current are the same.
     */
    get activePage(): PageWidget | undefined {
        return this._activePage;
    }
    protected setActivePage(active: PageWidget | undefined): void {
        if (this._activePage !== active) {
            this._activePage = active;
            this.onActivePageChangedEmitter.fire(this._activePage);
        }
    }
    protected updateActiveEditor(): void {
        const widget = this.shell.activeWidget;
        this.setActivePage(widget instanceof PageWidget ? widget : undefined);
    }

    protected _currentPage: PageWidget | undefined;
    /**
     * The most recently activated page (which might not have the focus anymore, hence it is not active).
     * If no page has focus, e.g. when a context menu is shown, the active page is `undefined`, but current might be the page that was active before the menu popped up.
     */
    get currentPage(): PageWidget | undefined {
        return this._currentPage;
    }
    protected setCurrentEditor(current: PageWidget | undefined): void {
        if (this._currentPage !== current) {
            this._currentPage = current;
            this.onCurrentPageChangedEmitter.fire(this._currentPage);
        }
    }
    protected updateCurrentPage(): void {
        const widget = this.shell.currentWidget;
        if (widget instanceof PageWidget) {
            this.setCurrentEditor(widget);
        } else if (!this._currentPage || !this._currentPage.isVisible || this.currentPage !== this.recentlyVisible) {
            this.setCurrentEditor(this.recentlyVisible);
        }
    }

    canHandle(uri: URI, options?: WidgetOpenerOptions): number {
        if (uri.path.ext.toLowerCase() !== '.url') {
            return 0;
        }
        return 200;
    }

    async open(uri: URI, options?: WidgetOpenerOptions): Promise<PageWidget> {
        const page = await super.open(uri, options);
        return page;
    }

}

