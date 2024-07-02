import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import { createApolloServer } from "./graphql";
import { verify } from "jsonwebtoken";

const app = express();
const PORT = Number(process.env.PORT) || 8080;


app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

createApolloServer().then((gqlServer) => {
    app.use('/graphql', expressMiddleware(gqlServer, {
        context: async ({ req }) => {
            const token = req.headers.authorization;
            try{
                const user = verify(token as string, 'B@tm@n');
                return {user};
            }
            catch(err){
                return {}
            }
        }
    }));
    app.listen(PORT, () => {
        console.log('App is running on port', PORT);
    });
})
