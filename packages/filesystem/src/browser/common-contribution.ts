
import { CommonFrontendContribution } from '@theia/core/lib/browser';
import { Component } from '@malagu/core';

@Component({ id: CommonFrontendContribution, rebind: true })
export class CommonFrontendContributionImpl extends CommonFrontendContribution {

}
