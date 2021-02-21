import React = require('react');
import debounce = require('lodash.debounce');
import * as fuzzy from 'fuzzy';
import { injectable } from 'inversify';
import { Emitter, Event } from '@theia/core/lib/common/event';
import { ReactWidget, Navigatable } from '@theia/core/lib/browser';
import { SingleTextInputDialog, ConfirmDialog, Message } from '@theia/core/lib/browser';
import { Member, MemberServer, MemberStatus } from '../common';
import URI from '@theia/core/lib/common/uri';
import { AlertMessage } from '@theia/core/lib/browser/widgets/alert-message';
import { LabelProvider, NavigatableWidgetOptions } from '@theia/core/lib/browser';
import { Autorpc } from '@malagu/rpc';
import { Autowired, PostConstruct } from '@malagu/core';
import { FileUri } from '@theia/core/lib/node/file-uri';
import { IntlUtil } from '@cellbang/desktop/lib/browser';
import { MessageService } from '@theia/core';
import { FileRole } from '@cellbang/filesystem-database/lib/node';

export const MEMBERS_MAIN_CONTAINER_CLASS = 'cellbang-MembersMainContainer';
export const MEMBERS_MEMBERS_CONTAINER_CLASS = 'cellbang-MembersMembersContainer';
export const MEMBERS_SEARCH_MEMBERS_CLASS = 'cellbang-MembesSearchMembers';
export const MEMBERS_TABLE_CONTAINER_CLASS = 'cellbang-MembesTableContainer';

export interface CellData {
    /**
     * The cell value.
     */
    value: string,
    /**
     * Indicates if a cell's value is currently highlighted.
     */
    highlighted: boolean,
}

export const MembersWidgetOptions = Symbol('MembersWidgetOptions');

export interface MembersWidgetOptions extends NavigatableWidgetOptions {
}

@injectable()
export class MembersWidget extends ReactWidget implements Navigatable {

    static FACTORY_ID = 'members-opener';

    @Autowired(MembersWidgetOptions)
    protected readonly options: MembersWidgetOptions;

    @Autorpc(MemberServer)
    protected readonly memberServer: MemberServer;

    @Autowired(LabelProvider)
    protected readonly labelProvider: LabelProvider;

    @Autowired(MessageService)
    protected readonly messageService: MessageService;

    uri: URI;

    protected position: { x: number, y: number} | undefined;
    protected current: Member | undefined;

    static readonly LABEL = 'Members';

    /**
     * The list of all available members.
     */
    protected items: Member[] = [];

    /**
     * The current user search query.
     */
    protected query: string = '';

    /**
     * The regular expression used to extract values between fuzzy results.
     */
    protected readonly regexp = /<match>(.*?)<\/match>/g;
    /**
     * The regular expression used to extract values between the keybinding separator.
     */
    protected readonly keybindingSeparator = /<match>\+<\/match>/g;

    /**
     * The fuzzy search options.
     * The `pre` and `post` options are used to wrap fuzzy matches.
     */
    protected readonly fuzzyOptions = {
        pre: '<match>',
        post: '</match>',
    };

    protected readonly onDidUpdateEmitter = new Emitter<void>();
    readonly onDidUpdate: Event<void> = this.onDidUpdateEmitter.event;

    /**
     * Search members.
     */
    protected readonly searchMembers: () => void = debounce(() => this.doSearchMembers(), 50);

    /**
     * Initialize the widget.
     */
    @PostConstruct()
    protected async init(): Promise<void> {
        this.uri = new URI(this.options.uri);

        this.setLabels();
        const labelListener = this.labelProvider.onDidChange(event => {
            if (event.affects(this.uri)) {
                this.setLabels();
            }
        });
        this.onDispose(() => labelListener.dispose());

        this.id = this.id + ':' + this.uri.toString();
        this.title.closable = true;
        this.items = await this.getItems();

        this.update();

    }

    protected setLabels(): void {
        this.title.caption = this.labelProvider.getLongName(this.uri);
        // const icon = this.labelProvider.getIcon(this.uri);
        this.title.label = `${IntlUtil.get('Members')} ∈ ${this.labelProvider.getName(this.uri)}`;
        this.title.iconClass = 'fa fa-address-card-o file-icon';
    }

    /**
     * Determine if there currently is a search term.
     * @returns `true` if a search term is present.
     */
    public hasSearch(): boolean {
        return !!this.query.length;
    }

    /**
     * Clear the search and reset the view.
     */
    public clearSearch(): void {
        const search = this.findSearchField();
        if (search) {
            search.value = '';
            this.query = '';
            this.doSearchMembers();
        }
    }

    protected onActivateRequest(msg: Message): void {
        super.onActivateRequest(msg);
        this.focusInputField();
    }

    /**
     * Perform a search based on the user's search query.
     */
    protected async doSearchMembers(): Promise<void> {
        this.onDidUpdateEmitter.fire(undefined);
        this.items = [];
        const searchField = this.findSearchField();
        this.query = searchField ? searchField.value.trim().toLocaleLowerCase() : '';
        const items = await this.getItems();
        items.forEach(item => {
            let matched = false;
            let value = this.getNicknameLabel(item);
            if (value) {
                const fuzzyMatch = fuzzy.match(this.query, value, this.fuzzyOptions);
                if (fuzzyMatch) {
                    item.nickname = fuzzyMatch.rendered;
                    matched = true;
                }
            }

            value = item.username;
            if (value) {
                const fuzzyMatch = fuzzy.match(this.query, value, this.fuzzyOptions);
                if (fuzzyMatch) {
                    item.username = fuzzyMatch.rendered;
                    matched = true;
                }
            }

            value = this.getRoleLabel(item.role);
            if (value) {
                const fuzzyMatch = fuzzy.match(this.query, value, this.fuzzyOptions);
                if (fuzzyMatch) {
                    item.role = fuzzyMatch.rendered;
                    matched = true;
                }
            }

            if (matched) {
                this.items.push(item);
            }
        });
        this.update();
    }

    /**
     * Get the search input if available.
     * @returns the search input if available.
     */
    protected findSearchField(): HTMLInputElement | null {
        return this.node.getElementsByClassName(MEMBERS_SEARCH_MEMBERS_CLASS).item(0) as HTMLInputElement;
    }

    /**
     * Set the focus the search input field if available.
     */
    protected focusInputField(): void {
        const input = this.findSearchField();
        if (input) {
            input.focus();
            input.select();
        }
    }

    /**
     * Render the view.
     */
    protected render(): React.ReactNode {
        return <div className={MEMBERS_MAIN_CONTAINER_CLASS}>
            {this.renderSearch()}
            {(this.items.length > 0) ? this.renderTable() : this.renderMessage()}
            {this.position ? this.renderMemberRoleMenu() : '' }
        </div>;
    }

    /**
     * Render the search container with the search input.
     */
    protected renderSearch(): React.ReactNode {
        return <div>
            <div className={MEMBERS_MEMBERS_CONTAINER_CLASS}>
                <input
                    className={`${MEMBERS_SEARCH_MEMBERS_CLASS} theia-input${(this.items.length > 0) ? '' : ' no-members'}`}
                    type='text'
                    placeholder={IntlUtil.get('Search members')}
                    autoComplete='off'
                    onKeyUp={this.searchMembers}
                />
            </div>
        </div>;
    }

    /**
     * Render the warning message when no search results are found.
     */
    protected renderMessage(): React.ReactNode {
        return <AlertMessage
            type='WARNING'
            header={IntlUtil.get('No results found!')!}
        />;
    }

    protected renderMemberRoleMenu(): React.ReactNode {
        document.addEventListener('click', () => {
            this.current = undefined;
            this.position = undefined;
            this.update();
        }, { once: true });
        const items = [
            { role: FileRole.admin, desc: 'Highest permissions of workspace' },
            { role: FileRole.member, desc: 'Management permissions of workspace' },
            { role: FileRole.guest, desc: 'Only read access' }
        ];
        return (<div className='member-role-menu' style={{ top: this.position!.y, left: this.position!.x }} onClick={e => e.stopPropagation()}>
            <ul>
                {
                    items.map(item => (
                        <li key={item.role} onClick={() => this.updateRole(this.current!, item.role)}>
                            <i className='fa fa-check icon' style={{ visibility: this.current!.role === item.role ? 'visible' : 'hidden' }}></i>
                            <div className='title'>{IntlUtil.get(item.role)}</div>
                            <div className='desc'>{IntlUtil.get(item.desc)}</div>
                        </li>
                    ))
                }
            </ul>

        </div>);
    }

    /**
     * Render the members table.
     */
    protected renderTable(): React.ReactNode {
        return <div className={MEMBERS_TABLE_CONTAINER_CLASS}>
            <div className='members'>
                <table>
                    <thead>
                        <tr>
                            <th className='th-placeholder'></th>
                            <th className='th-label'>{IntlUtil.get('Nickname')}</th>
                            <th className='th-label'>{IntlUtil.get('Username')}</th>
                            <th className='th-label'>{IntlUtil.get('Role')}</th>
                            <th className='th-action'>{IntlUtil.get('Operation')}</th>
                            <th className='th-placeholder'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderRows()}
                    </tbody>
                </table>
            </div>
        </div>;
    }

    /**
     * Render the table rows.
     */
    protected renderRows(): React.ReactNode {
        return <React.Fragment>
            {this.items.map((item, index) => this.renderRow(item, index))}
        </React.Fragment>;
    }

    protected renderRow(item: Member, index: number): React.ReactNode {
        return <tr className='members-item-row' key={index} onDoubleClick={() => this.editNickname(item)}>
            <td></td>
            <td className='members-label monaco-keybinding' title={item.nickname}>
                {this.renderAvatar(item)}
                {this.renderMatchedData(item.nickname)}
                {this.renderStatus(item)}
                {this.renderEdit(item)}
            </td>
            <td title={this.getNicknameLabel(item)} className='members-label'>
                {this.renderMatchedData(this.getNicknameLabel(item))}
            </td>
            <td className='members-role' title={this.getRoleLabel(item.role)}>
                <code>{this.renderMatchedData(this.getRoleLabel(item.role)!)}</code>
                {this.renderEditRole(item)}
            </td>
            <td className='members-actions'>
                {this.renderActions(item)}
            </td>
            <td></td>
        </tr>;
    }

    protected renderActions(item: Member): React.ReactNode {
        return <span>{this.renderApply(item)}{this.renderRemove(item)}</span>;
    }

    protected renderAvatar(item: Member): React.ReactNode {
        return item.avatar ? <img
            src={item.avatar}
            key={item.id}
        /> : <i
                key={item.id}
                className='fa fa-user-circle-o'
            />;
    }

    protected renderEditRole(item: Member): React.ReactNode {
        return <a title={IntlUtil.get('Modify nickname')} href='#' onClick={e => {
            e.preventDefault();
            this.position = { x: e.clientX, y: e.clientY };
            this.current = item;
            this.update();
        }}><i className='fa fa-angle-down members-action-item members-action-nickname'></i></a>;
    }

    protected renderEdit(item: Member): React.ReactNode {
        return <a title={IntlUtil.get('Modify nickname')} href='#' onClick={e => {
            e.preventDefault();
            this.editNickname(item);
        }}><i className='fa fa-pencil members-action-item members-action-nickname'></i></a>;
    }

    protected renderApply(item: Member): React.ReactNode {
        return item.status === MemberStatus.applying ? <a title={IntlUtil.get('Agree')} href='#' onClick={e => {
            e.preventDefault();
            this.agreeToJoin(item);
        }}><span className='members-action-item'>{IntlUtil.get('Agree')}</span></a> : '';
    }

    protected renderStatus(item: Member): React.ReactNode {
        return item.status === MemberStatus.applying ? <span className='monaco-keybinding-key' style={{ marginLeft: '5px' }}>{IntlUtil.get(item.status)}</span> : '';
    }

    protected renderRemove(item: Member): React.ReactNode {
        return <a title={IntlUtil.get('Delete member')} href='#' onClick={e => {
                e.preventDefault();
                this.removeMember(item);
            }}><span className='members-action-item'>{IntlUtil.get('Delete')}</span></a>;
    }

    /**
     * Get the list of member items.
     *
     * @returns the list of member items.
     */
    protected getItems(): Promise<Member[]> {
        return this.memberServer.list(FileUri.fsPath(this.uri));
    }

    protected getRoleLabel(role: string): string {
        return IntlUtil.get(role)!;
    }

    protected getNicknameLabel(item: Member): string {
        if (item.userId === 'anonymousUser') {
            return IntlUtil.get('Anonymous User')!;
        }
        return item.nickname;
    }

    protected async agreeToJoin(item: Member): Promise<void> {
        await this.memberServer.agree(item.fileId, item.userId);
        this.items = await this.getItems();
        this.update();
    }

    protected editNickname(item: Member): void {
        const dialog = new SingleTextInputDialog({
            title: `${IntlUtil.get('Modify Nickname For')} ${item.username}`,
            initialValue: item.nickname,
            validate: nickname => this.validateNickname(nickname),
        });
        dialog.open().then(async nickname => {
            if (nickname && nickname.trim() !== item.nickname) {
                await this.memberServer.updateNickname(item.id, nickname.trim());
                this.items = await this.getItems();
                this.update();
            }
        });
    }

    protected async confirmRemoveMember(item: Member): Promise<boolean> {
        const dialog = new ConfirmDialog({
            title: `${IntlUtil.get('Delete member')} '${item.nickname}'`,
            msg: 'Do you really want to delete this member?'
        });
        return !!await dialog.open();
    }

    protected async removeMember(item: Member): Promise<void> {
        const confirmed = await this.confirmRemoveMember(item);
        if (confirmed) {
            await this.memberServer.delete(item.id);
            this.items = await this.getItems();
            this.update();
        }
    }

    protected async updateRole(item: Member, role: string): Promise<void> {
        await this.memberServer.updateRole(item.id, role);
        this.items = await this.getItems();
        this.update();
    }

    protected validateNickname(nickname: string): string {
        if (!nickname) {
            return IntlUtil.get('nickname value is required')!;
        }
        return '';
    }

    /**
     * Build the cell data with highlights if applicable.
     * @param raw the raw cell value.
     *
     * @returns the list of cell data.
     */
    protected buildCellData(raw: string): CellData[] {
        const data: CellData[] = [];

        if (this.query === '') {
            return data;
        }

        let following = raw;
        let leading;
        let result;

        const regexp = new RegExp(this.regexp);

        while (result = regexp.exec(raw)) {
            const splitLeftIndex = following.indexOf(result[0]);
            const splitRightIndex = splitLeftIndex + result[0].length;

            leading = following.slice(0, splitLeftIndex);
            following = following.slice(splitRightIndex);

            if (leading) {
                data.push({ value: leading, highlighted: false });
            }
            data.push({ value: result[1], highlighted: true });
        }

        if (following) {
            data.push({ value: following, highlighted: false });
        }

        return data;
    }

    protected renderMatchedData(property: string): React.ReactNode {
        if (this.query !== '') {
            const cellData = this.buildCellData(property);
            return <React.Fragment>
                {
                    cellData.map((data, index) => (data.highlighted) ? <span key={index} className='fuzzy-match'>{data.value}</span> : <span key={index}>{data.value}</span>)
                }
            </React.Fragment>;
        } else {
            return property;
        }
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
