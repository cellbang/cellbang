import { CustomError } from '@malagu/core';

export class ResourceNotFoundError extends CustomError {

    constructor(public resouce: number | string) {
        super(`Resource not found: ${resouce}`);
    }
}

export class ResourceAlreadyExistsError extends CustomError {

    constructor(public resouce: number | string) {
        super(`Resource already exists: ${resouce}`);
    }
}
