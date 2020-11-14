import { Rpc } from '@malagu/rpc';
import { Context } from '@malagu/web/lib/node';
import { Transactional, OrmContext } from '@malagu/typeorm/lib/node';
import { GetUserRequest, GetUserResponse, UpdateUserRequest, UpdateUserResponse, UserService } from '../common';
import { User } from './entity';
import { UserNotFoundError } from './error';
import { plainToClassFromExist, plainToClass, classToPlain } from 'class-transformer';

@Rpc(UserService)
export class UserServiceImpl implements UserService {

    @Transactional({ readOnly: true })
    async get(request: GetUserRequest): Promise<GetUserResponse> {
        const repo = OrmContext.getRepository(User);
        const user = await repo.findOne(request.id);
        if (user) {
            return <GetUserResponse>{
                ...classToPlain(user),
                requestId: Context.getTraceId()
            };
        }
        throw new UserNotFoundError(request.id);
    }

    @Transactional()
    async update(request: UpdateUserRequest): Promise<UpdateUserResponse> {
        const repo = OrmContext.getRepository(User);
        const user = await repo.findOne(request.id);
        if (user) {
            const newUser = plainToClassFromExist(user, classToPlain(request));
            await repo.save(newUser);
            return {
                requestId: Context.getTraceId()
            };
        }
        throw new UserNotFoundError(request.id);
    }

    @Transactional()
    async create(request: UpdateUserRequest): Promise<UpdateUserResponse> {
        const repo = OrmContext.getRepository(User);
        const user = plainToClass(User, classToPlain(request));
        await repo.save(user);
        return {
            requestId: Context.getTraceId()
        };
    }

}
