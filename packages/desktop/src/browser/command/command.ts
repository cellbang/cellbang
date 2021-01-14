import { Component, Autowired, Logger } from '@malagu/core';
import { Command, CommandHandler, CommandRegistry, Disposable } from '@theia/core';
import { IntlUtil } from '../utils';

@Component({ id: CommandRegistry, rebind: true })
export class CommandRegistryImpl extends CommandRegistry {

    @Autowired(Logger)
    protected logger: Logger;

    registerCommand(command: Command, handler?: CommandHandler): Disposable {
        const id = `${command.id}.label`;
        command.label = IntlUtil.get(id, command.label);
        command.category = IntlUtil.get(id, command.category);
        return super.registerCommand(command, handler);
    }

}
