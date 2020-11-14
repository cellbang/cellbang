export const UserService = Symbol('UserService');

export interface UserService {
    get(request: GetUserRequest): Promise<GetUserResponse | undefined>;

    get(request: UpdateUserRequest): Promise<UpdateUserResponse | undefined>;

}

export interface Response {
    requestId: string;
}

export interface User {
    id: string;
    email: string;
    emailVerified: boolean;
    username?: string;
    phoneNumber?: string;
    createdAt: Date;
    updatedAt: Date;
    appMetadata: { [key: string]: any };
    userMetadata: { [key: string]: any };
    picture: string;
    nickname: string;
    multifactor: string[];
    lastIp?: string;
    lastLogin?: Date;
    loginsCount: number;
    blocked: boolean;
}

export class GetUserRequest {
    id: string;
}

export interface GetUserResponse extends User, Response {

}

export class UpdateUserRequest {
    id: string;
    email?: string;
    emailVerified?: boolean;
    username?: string;
    phoneNumber?: string;
    appMetadata?: { [key: string]: any };
    userMetadata?: { [key: string]: any };
    picture?: string;
    nickname?: string;
    multifactor?: string[];
    lastIp?: string;
    lastLogin?: Date;
    loginsCount?: number;
    blocked?: boolean;
    password?: string;
}

export interface UpdateUserResponse extends Response {

}

export class CreateUserRequest {
    id: string;
    email: string;
    emailVerified?: boolean;
    username?: string;
    phoneNumber?: string;
    phoneVerified: boolean;
    appMetadata: { [key: string]: any };
    userMetadata: { [key: string]: any };
    picture: string;
    nickname: string;
    multifactor: string[];
    loginsCount: number;
    blocked: boolean;
    password?: string;
}

export interface CreateUserResponse extends Response {

}
