import { CustomError } from '@malagu/core';

export class UserNotFoundError extends CustomError {
    constructor(public userId: string) {
        super(`No user found: ${userId}`);
    }
}
