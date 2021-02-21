import { Component, PostConstruct } from '@malagu/core';
import URI from '@theia/core/lib/common/uri';
import { Emitter, Event } from '@theia/core/lib/common';
import { WidgetOpenerOptions, NavigatableWidgetOpenHandler, OpenHandler } from '@theia/core/lib/browser';
import { MembersWidget } from './members-widget';

@Component([MembersWidgetManager, OpenHandler])
export class MembersWidgetManager extends NavigatableWidgetOpenHandler<MembersWidget> {

    readonly id = MembersWidget.FACTORY_ID;

    readonly label = 'Members';

    protected readonly onActiveMembersWidgetChangedEmitter = new Emitter<MembersWidget | undefined>();
    /**
     * Emit when the active page is changed.
     */
    readonly onActiveMembersWidgetChanged: Event<MembersWidget | undefined> = this.onActiveMembersWidgetChangedEmitter.event;

    protected readonly onCurrentMembersWidgetChangedEmitter = new Emitter<MembersWidget | undefined>();
    /**
     * Emit when the current page is changed.
     */
    readonly onCurrentMembersWidgetChanged: Event<MembersWidget | undefined> = this.onCurrentMembersWidgetChangedEmitter.event;

    @PostConstruct()
    protected init(): void {
        super.init();
        this.shell.onDidChangeActiveWidget(() => this.updateActiveEditor());
        this.shell.onDidChangeCurrentWidget(() => this.updateCurrentMembersWidget());
        this.onCreated(widget => {
            widget.onDidChangeVisibility(() => {
                if (widget.isVisible) {
                    this.addRecentlyVisible(widget);
                } else {
                    this.removeRecentlyVisible(widget);
                }
                this.updateCurrentMembersWidget();
            });
            widget.disposed.connect(() => {
                this.removeRecentlyVisible(widget);
                this.updateCurrentMembersWidget();
            });
        });
        for (const widget of this.all) {
            if (widget.isVisible) {
                this.addRecentlyVisible(widget);
            }
        }
        this.updateCurrentMembersWidget();

    }

    protected readonly recentlyVisibleIds: string[] = [];
    protected get recentlyVisible(): MembersWidget | undefined {
        const id = this.recentlyVisibleIds[0];
        return id && this.all.find(w => w.id === id) || undefined;
    }
    protected addRecentlyVisible(widget: MembersWidget): void {
        this.removeRecentlyVisible(widget);
        this.recentlyVisibleIds.unshift(widget.id);
    }
    protected removeRecentlyVisible(widget: MembersWidget): void {
        const index = this.recentlyVisibleIds.indexOf(widget.id);
        if (index !== -1) {
            this.recentlyVisibleIds.splice(index, 1);
        }
    }

    protected _activeMembersWidget: MembersWidget | undefined;
    /**
     * The active page.
     * If there is an active page (one that has focus), active and current are the same.
     */
    get activeMembersWidget(): MembersWidget | undefined {
        return this._activeMembersWidget;
    }
    protected setActiveMembersWidget(active: MembersWidget | undefined): void {
        if (this._activeMembersWidget !== active) {
            this._activeMembersWidget = active;
            this.onActiveMembersWidgetChangedEmitter.fire(this._activeMembersWidget);
        }
    }
    protected updateActiveEditor(): void {
        const widget = this.shell.activeWidget;
        this.setActiveMembersWidget(widget instanceof MembersWidget ? widget : undefined);
    }

    protected _currentMembersWidget: MembersWidget | undefined;
    /**
     * The most recently activated page (which might not have the focus anymore, hence it is not active).
     * If no page has focus, e.g. when a context menu is shown, the active page is `undefined`, but current might be the page that was active before the menu popped up.
     */
    get currentMembersWidget(): MembersWidget | undefined {
        return this._currentMembersWidget;
    }
    protected setCurrentEditor(current: MembersWidget | undefined): void {
        if (this._currentMembersWidget !== current) {
            this._currentMembersWidget = current;
            this.onCurrentMembersWidgetChangedEmitter.fire(this._currentMembersWidget);
        }
    }
    protected updateCurrentMembersWidget(): void {
        const widget = this.shell.currentWidget;
        if (widget instanceof MembersWidget) {
            this.setCurrentEditor(widget);
        } else if (!this._currentMembersWidget || !this._currentMembersWidget.isVisible || this.currentMembersWidget !== this.recentlyVisible) {
            this.setCurrentEditor(this.recentlyVisible);
        }
    }

    canHandle(uri: URI, options?: WidgetOpenerOptions): number {
        if (uri.scheme !== 'members') {
            return 0;
        }
        return 200;
    }

    async open(uri: URI, options?: WidgetOpenerOptions): Promise<MembersWidget> {
        const mmbersWidget = await super.open(uri, options);
        return mmbersWidget;
    }

}

