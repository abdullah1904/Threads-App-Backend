import { ApolloServer } from "@apollo/server";
import {User} from "./user/index";

export const createApolloServer = async ()=>{
    const gqlServer = new ApolloServer({
        typeDefs: `#graphql
            ${User.typeDefs}
            type Query{
                ${User.queries}
            }
            type Mutation{
                ${User.mutations}
            }
        `,
        resolvers: {
            Query: {
                ...User.resolvers.queries,
            },
            Mutation:{
                ...User.resolvers.mutations,
            } 
        },
    });
    await gqlServer.start();
    return gqlServer;
}