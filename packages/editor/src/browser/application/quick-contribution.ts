import { Component } from '@malagu/core';
import { QuickCommandFrontendContribution } from '@theia/core/lib/browser';

@Component({ id: QuickCommandFrontendContribution, rebind: true })
export class QuickCommandFrontendContributionImpl extends QuickCommandFrontendContribution {

}
