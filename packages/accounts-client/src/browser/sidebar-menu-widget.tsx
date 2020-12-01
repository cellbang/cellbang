import { SidebarBottomMenuWidget, SidebarBottomMenu } from '@theia/core/lib/browser/shell';
import { MenuPath, ACCOUNTS_MENU } from '@theia/core';
import { Component, Value, Scope } from '@malagu/core';
import * as React from 'react';

export const accountsMenu = {
    id: 'accounts-menu',
    iconClass: 'fa fa-user-circle-o',
    title: 'Accounts',
    menuPath: ACCOUNTS_MENU,
    order: 1,
};

@Component()
export class SidebarMenuWidget extends SidebarBottomMenuWidget {

    @Value('cellbang["accounts-client"].showSidebarAccountMenus')
    protected readonly showSidebarAccountMenus: boolean;

    addMenu(menu: SidebarBottomMenu): void {
        const m = this.supportMenu(menu);
        if (!m) {
            return;
        }
        super.addMenu(m);
    }

    protected supportMenu(menu: SidebarBottomMenu) {
        if (menu.id === 'accounts-menu') {
            if (this.showSidebarAccountMenus) {
                return;
            }
            return accountsMenu;
        }
        return menu;
    }

    protected onClick(e: React.MouseEvent<HTMLElement, MouseEvent>, menuPath: MenuPath): void {
        this.contextMenuRenderer.render({
            menuPath,
            anchor: {
                x: e.clientX,
                y: e.currentTarget.clientHeight + 6,
            }
        });
    }

    protected render(): React.ReactNode {
        return <React.Fragment>
            {this.menus.sort((a, b) => a.order - b.order).map((menu: any) =>
                menu.src ? <img
                    src={menu.src}
                    key={menu.id}
                    title={menu.title}
                    onClick={e => this.onClick(e, menu.menuPath)}
                /> : <i
                        key={menu.id}
                        className={menu.iconClass}
                        title={menu.title}
                        onClick={e => this.onClick(e, menu.menuPath)}
                    />)}
        </React.Fragment>;
    }
}

@Component({ id: SidebarBottomMenuWidget, scope: Scope.Request, rebind: true })
export class SidebarRightMenuWidgetImpl extends SidebarMenuWidget {

    protected supportMenu(menu: SidebarBottomMenu) {
        if (menu.id === 'accounts-menu') {
            if (this.showSidebarAccountMenus) {
                return accountsMenu;
            }
            return;
        }
        return menu;
    }

    protected onClick(e: React.MouseEvent<HTMLElement, MouseEvent>, menuPath: MenuPath): void {
        this.contextMenuRenderer.render({
            menuPath,
            anchor: {
                x: 50,
                y: e.clientY
            }
        });
    }
}
