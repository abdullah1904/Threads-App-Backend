import { prismaClient } from "../../lib/db";
import UserService, { CreateUserPayload, GetUserTokenPayload } from "../../services/user.service";

const queries = {
    getUserToken: async (_:any,payload:GetUserTokenPayload)=>{
        return await UserService.getUserToken({email: payload.email, password: payload.password});
    },
    getCurrentLoggedInUser: async (_:any, params:any, context:any)=>{
        if(context && context.user){
            return await prismaClient.user.findUnique({where: {id: context.user.id}});
        }
        else{
            throw new Error('Invalid User');
        }
    }
}

const mutations = {
    createUser: async (_:any,payload:CreateUserPayload)=>{
        return (await UserService.createUser(payload)).id;
    }
}

export const resolvers = {queries, mutations}