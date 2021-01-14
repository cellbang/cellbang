import { CustomError } from '@malagu/core';

export class NotFoundError extends CustomError {

    constructor(public identity: number, public provider: string) {
        super(`No identity found: ${provider}(${identity})`);
    }
}
