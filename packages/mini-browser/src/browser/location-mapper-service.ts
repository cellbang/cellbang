
import URI from '@theia/core/lib/common/uri';
import { Endpoint } from '@theia/core/lib/browser';
import { MaybePromise } from '@theia/core/lib/common/types';
import { LocationMapper } from '@theia/mini-browser/lib/browser/location-mapper-service';
import { Component } from '@malagu/core';

/**
 * `file` URI location mapper.
 */
@Component(LocationMapper)
export class FileLocationMapper implements LocationMapper {

    canHandle(location: string): MaybePromise<number> {
        return location.startsWith('file://') ? 2 : 0;
    }

    map(location: string): MaybePromise<string> {
        const uri = new URI(location);
        if (uri.scheme !== 'file') {
            throw new Error(`Only URIs with 'file' scheme can be mapped to an URL. URI was: ${uri}.`);
        }
        let rawLocation = uri.path.toString();
        if (rawLocation.charAt(0) === '/') {
            rawLocation = rawLocation.substr(1);
        }
        return new MiniBrowserEndpoint().getRestUrl().resolve(rawLocation).toString();
    }

}

export class MiniBrowserEndpoint extends Endpoint {
    constructor() {
        super({ path: 'mini-browser' });
    }
}
