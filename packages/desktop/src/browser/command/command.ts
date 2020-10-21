import { Component, Autowired } from '@malagu/core';
import { Command, CommandHandler, CommandRegistry, Disposable } from '@theia/core';
import { LocaleService } from '../locale';

@Component({ id: CommandRegistry, rebind: true })
export class CommandRegistryImpl extends CommandRegistry {

    @Autowired(LocaleService)
    protected readonly localeService: LocaleService;


    registerCommand(command: Command, handler?: CommandHandler): Disposable {
        const intl = this.localeService.tryGetIntl();
        if (command.label && intl) {
            const id = `${command.id}.label`;
            command.label = intl.messages[id] ? intl.formatMessage({ id }) : intl.messages[command.label] ? intl.formatMessage({ id: command.label }) : command.label;
        }
        return super.registerCommand(command, handler)
    }

}
