import { CustomError } from '@malagu/core';

export class CollaborationError extends CustomError {

}

export class CollaborationDisabledError extends CollaborationError {

}

export class CollaborationNotFoundError extends CollaborationError {

}
