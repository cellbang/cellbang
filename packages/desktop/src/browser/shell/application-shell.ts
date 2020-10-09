import { Component } from '@malagu/core';
import { ApplicationShell } from '@malagu/core/lib/browser';

@Component({ id: ApplicationShell, rebind: true })
export class EmptyApplicationShell implements ApplicationShell {
    attach(host: HTMLElement): void {
        // NoOp
    }

}
