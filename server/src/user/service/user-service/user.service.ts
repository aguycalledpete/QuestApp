import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { AuthenticationService } from 'src/authentication/service/authentication.service';
import { UserEntity } from 'src/user/models/user.entity';
import { UserI } from 'src/user/models/user.interface';
import { Like, Repository } from 'typeorm';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly authenticationService: AuthenticationService
    ) { }

    async create(newUser: UserI): Promise<UserI> {
        const emailExists = await this.mailExists(newUser.email);
        if (emailExists) {
            throw new HttpException('Email is already in use', HttpStatus.CONFLICT);
        }

        const userExists = await this.userExists(newUser.username);
        if (userExists) {
            throw new HttpException('Username is already in use', HttpStatus.CONFLICT);
        }

        // hash password
        const passwordHash = await this.createHash(newUser.password);
        newUser.password = passwordHash;
        // hash security answer
        const securityAnswerHash = await this.createHash(newUser.securityAnswer);
        newUser.securityAnswer = securityAnswerHash;

        const userToCreate = this.userRepository.create(newUser);
        const createdUser = await this.userRepository.save(userToCreate);
        const foundCreatedUser = await this.findOneById(createdUser.id);
        if (!foundCreatedUser) {
            throw new HttpException('Unable to find user', HttpStatus.NOT_FOUND);
        }
        return foundCreatedUser;
    }

    async login(user: UserI): Promise<string> {
        const email = user.email.toLowerCase();
        const foundUserByEmail = await this.userRepository.findOne({ email }, {
            select: ['id', 'email', 'username', 'password']
        });
        if (!foundUserByEmail) {
            throw new HttpException('Login was not successful. Wrong credentials.', HttpStatus.UNAUTHORIZED);
        }

        const matches = await this.validateHash(user.password, foundUserByEmail.password);
        if (!matches) {
            throw new HttpException('Login was not successful. Wrong credentials.', HttpStatus.UNAUTHORIZED);
        }

        const foundUser = await this.findOneById(foundUserByEmail.id);
        if (!foundUser) {
            throw new HttpException('Unable to find user', HttpStatus.NOT_FOUND);
        }

        const jwt = this.authenticationService.generateJwt(foundUser);
        return jwt;
    }

    async findAll(options: IPaginationOptions): Promise<Pagination<UserI>> {
        return paginate<UserEntity>(this.userRepository, options)
    }

    async findOneByEmail(email: string): Promise<UserI> {
        let user = {} as UserI;
        if (!email) {
            return user;
        }

        user = await this.userRepository.findOne({
            where: { email },
            select: ['id', 'email', 'username', 'securityQuestion']
        });
        if (!user) {
            throw new HttpException('Unable to find user', HttpStatus.NOT_FOUND);
        }

        return user;
    }

    async findAllByUsername(username: string): Promise<UserI[]> {
        let users = new Array<UserI>();
        if (!username) {
            return users;
        }
        users = await this.userRepository.find({
            where: {
                username: Like(`%${username.toLowerCase()}%`)
            }
        });
        return users
    }

    async findOneByUsername(username: string): Promise<UserI> {
        let user = {} as UserI;
        if (!username) {
            return user;
        }
        user = await this.userRepository.findOne({
            where: { username }
        })
        if (!user) {
            throw new HttpException('Unable to find user', HttpStatus.NOT_FOUND);
        }
        return user;
    }

    async answerQuestion(user: UserI): Promise<boolean> {
        const email = user.email.toLowerCase();
        const foundUserByEmail = await this.userRepository.findOne({ email }, {
            select: ['id', 'email', 'username', 'securityAnswer']
        });
        if (!foundUserByEmail) {
            throw new HttpException('Unable to find user', HttpStatus.NOT_FOUND);
        }

        const matches = await this.validateHash(user.securityAnswer, foundUserByEmail.securityAnswer);
        if (!matches) {
            throw new HttpException('Answer is not valid.', HttpStatus.UNAUTHORIZED);
        }

        return matches;
    }

    async resetPassword(newUser: UserI): Promise<boolean> {
        const email = newUser.email;
        const userToUpdate = await this.userRepository.findOne({ email });
        if (!userToUpdate) {
            throw new HttpException('Unable to find user', HttpStatus.NOT_FOUND);
        }

        // hash password
        const passwordHash = await this.createHash(newUser.password);

        const result = await this.userRepository.update({ id: userToUpdate.id }, { password: passwordHash });
        const isUpdated = result.affected > 0;
        return isUpdated;
    }

    async findOneById(id: number): Promise<UserI> {
        const user = await this.userRepository.findOne({ id });
        return user;
    }

    private async createHash(original: string): Promise<string> {
        const hash = await this.authenticationService.createHash(original);
        return hash;
    }

    private async validateHash(original: string, storedHash: string): Promise<boolean> {
        const isValid = await this.authenticationService.compareHash(original, storedHash);
        return isValid;
    }

    private async mailExists(email: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ email });
        const userExists = user != null;
        return userExists;
    }

    private async userExists(username: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ username });
        const userExists = user != null;
        return userExists;
    }

}
