import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from '@apollo/server/express4';
import { executableSchema as schema } from "../graphql/schema";
import {graphqlUploadExpress} from "graphql-upload-ts"

dotenv.config();

interface ApolloContext {
  token?: String;
}

export class Server {
  private app: Application;
  private port: number;
  
  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.configureRoutes();
    this.configureMiddleWare();
    this.initializeApollo()
  }

  private configureRoutes(): void {
    this.app.get('/', (req: Request, res: Response) => {
      res.send("Basic Crud Application!")
    })

  }

  private  async initializeApollo(): Promise<void> {
    const serverApollo = new ApolloServer<ApolloContext>({
      schema,
      csrfPrevention: false 
     })

    await serverApollo.start();


    this.app.use(
      '/graphql',
      cors<cors.CorsRequest>(),
      express.json(),
      graphqlUploadExpress({ maxFileSize: 50000000, maxFiles: 20}),
      // graphqlUploadExpress(),
      expressMiddleware(serverApollo, {
        context: async ({ req }) => ({ token: req.headers.token }),
       
      }),
    );
  }

  private configureMiddleWare(): void {
    this.app.use(cors({
      credentials: true
    }))
    this.app.use(express.json());
    this.app.use(express.static('public'))
  }

  public addMiddleware(middleware: any): void {
    this.app.use(middleware)
  }
 
  public start():void{
    this.app.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`);
    });
  }

  public getApp() {
    return this.app
  }

 

}

