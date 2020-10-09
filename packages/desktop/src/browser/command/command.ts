import { Component } from '@malagu/core';
import { CommandRegistry } from '@theia/core';

@Component({ id: CommandRegistry, rebind: true })
export class CommandRegistryImpl extends CommandRegistry {}
