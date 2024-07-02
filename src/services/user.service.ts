import {randomBytes, createHmac} from "node:crypto"
import { prismaClient } from "../lib/db";
import { sign } from "jsonwebtoken";

export interface CreateUserPayload{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface GetUserTokenPayload{
    email: string;
    password: string;
}

export default class UserService{
    public static createUser(payload: CreateUserPayload){
        const {firstName, lastName, email, password} = payload;
        const salt = randomBytes(32).toString("hex");
        const hashedPassword = createHmac('sha256',salt).update(password).digest('hex');
        return prismaClient.user.create({
            data: {firstName, lastName, email, password: hashedPassword, salt},
        });
    }

    public static async getUserToken(payload: GetUserTokenPayload){
        const {email, password} = payload;
        const user = await prismaClient.user.findUnique({where: {email}});
        if(!user){
            throw new Error('User not found');
        }
        const userHashedPassword = createHmac('sha256',user.salt).update(password).digest('hex');
        if(userHashedPassword !== user.password){
            throw new Error('Incorrect password');
        }
        return sign({id: user.id,email: user.email},"B@tm@n");
    }
}