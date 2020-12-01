
import { FrontendApplication, FrontendApplicationContribution } from '@theia/core/lib/browser';
import { Component } from '@malagu/core';
import { MaybePromise } from '@theia/core';

@Component(FrontendApplicationContribution)
export class AccountsContribution implements FrontendApplicationContribution {

    onStart(app: FrontendApplication): MaybePromise<void> {
    }
}

