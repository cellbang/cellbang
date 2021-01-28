
import { Component, Autowired, PostConstruct } from '@malagu/core';
import { RestOperations, HttpStatus } from '@malagu/web';
import { UserManager } from '@malagu/security/lib/browser';
import { MessageService } from '@theia/core';
import { FrontendApplication, FrontendApplicationContribution } from '@theia/core/lib/browser';
import { AuthenticationProvider, AuthenticationSession, AuthenticationSessionsChangeEvent, AuthenticationService } from '@theia/core/lib/browser/authentication-service';
import { Widget } from '@phosphor/widgets';
import { SidebarMenuWidget, accountsMenu } from '../sidebar-menu-widget';
import { IntlUtil, LocaleService } from '@cellbang/desktop/lib/browser';

@Component(FrontendApplicationContribution)
export class AuthenticationProviderImpl implements AuthenticationProvider, FrontendApplicationContribution {

    @Autowired(UserManager)
    protected readonly userManager: UserManager;

    @Autowired(AuthenticationService)
    protected readonly authenticationService: AuthenticationService;

    @Autowired(SidebarMenuWidget)
    protected readonly sidebarMenuWidget: SidebarMenuWidget;

    @Autowired(RestOperations)
    protected restOperations: RestOperations;

    @Autowired(LocaleService)
    protected readonly localeService: LocaleService;

    @Autowired(MessageService)
    protected messageService: MessageService;

    protected sessions: AuthenticationSession[] = [];

    id: string = 'cellbang';
    supportsMultipleAccounts: boolean = false;
    label: string = 'Cellbang';

    @PostConstruct()
    protected async init() {

        this.restOperations.interceptors.response.use(response => response, error => {
            if (error.response) {
                if (error.response.status === HttpStatus.FORBIDDEN) {
                    this.messageService.warn(IntlUtil.get(error.response.data, HttpStatus.FORBIDDEN_REASON_PHRASE)!);
                }
            }
            return Promise.reject(error);
        });

    }

    onStart(app: FrontendApplication): void {
        const widget = new Widget();
        widget.id = 'growing';
        app.shell.addWidget(widget, { area: 'top' });
        widget.node.style.flexGrow = '1';
        this.sidebarMenuWidget.id = 'SidebarRightMenuWidget';
        this.sidebarMenuWidget.addClass('cellbang-sidebar-right-menu');
        app.shell.addWidget(this.sidebarMenuWidget, { area: 'top' });

        this.authenticationService.onDidRegisterAuthenticationProvider(() => {
            this.sidebarMenuWidget.addMenu(accountsMenu);
        });
        this.authenticationService.onDidUnregisterAuthenticationProvider(() => {
            if (this.authenticationService.getProviderIds().length === 0) {
                this.sidebarMenuWidget.removeMenu(accountsMenu.id);
            }
        });
        this.authenticationService.registerAuthenticationProvider(this.id, this);
        this.authenticationService.requestNewSession(this.id, [], this.id, this.label);
        this.userManager.userInfoSubject.subscribe(user => {
            if (user) {
                const session = {
                    id: user.username,
                    accessToken: '',
                    scopes: [],
                    account: {
                        id: user.username,
                        label: user.nickname
                    }
                };
                this.sessions = [ session ];
                (accountsMenu as any).src = user.avatar;
                accountsMenu.title = user.nickname;
                this.authenticationService.updateSessions(this.id, { added: [ session.id ], removed: [], changed: [] });
            } else {
                if (this.sessions.length > 0) {
                    const session = this.sessions[0];
                    this.sessions = [];
                    delete (accountsMenu as any).src;
                    this.authenticationService.updateSessions(this.id, { added: [ ], removed: [ session.id ], changed: [] });
                    this.authenticationService.requestNewSession(this.id, [], this.id, this.label);
                }
            }
            this.sidebarMenuWidget.update();
            app.shell.leftPanelHandler.bottomMenu.update();
        });
    }

    hasSessions(): boolean {
        return this.sessions.length > 0;
    }
    signOut(accountName: string): Promise<void> {
        return this.userManager.logout();
    }
    async getSessions(): Promise<readonly AuthenticationSession[]> {
        return this.sessions;

    }
    async updateSessionItems(event: AuthenticationSessionsChangeEvent): Promise<void> {

    }
    async login(scopes: string[]): Promise<AuthenticationSession> {
        this.userManager.openLoginPage();
        throw Error('Need login');
    }

    logout(sessionId: string): Promise<void> {
        return this.userManager.logout();
    }

}
