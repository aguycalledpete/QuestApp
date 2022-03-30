/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AuthenticationService } from "src/authentication/service/authentication.service";
import { UserI } from "src/user/models/user.interface";
import { UserService } from "src/user/service/user-service/user.service";

export interface RequestModel extends Request {
    user: UserI;
}

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {

    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService
    ) { }

    async use(req: RequestModel, res: Response, next: NextFunction) {
        try {
            const tokenArray: string[] = req.headers['authorization'].split(' ');
            const decodedToken = await this.authenticationService.verifyJwt(tokenArray[1]);

            // check user exists
            // TODO: does this check jwt User against login User?
            const foundUser: UserI = await this.userService.findOneById(decodedToken.user.id);

            if (!foundUser) {
                throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
            }

            // add foundUser to request object
            req.user = foundUser;
            next();
        } catch (error) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    }

}