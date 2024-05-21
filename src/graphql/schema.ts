import { gql } from 'apollo-server';
import { makeExecutableSchema } from "@graphql-tools/schema";
import userResolvers from "./resolvers/user.resolver";
import { merge } from "lodash";



const typeDefs = gql`
  scalar Upload

  type Authentication {
    user: User!
    token: String!
  }
  type User {
    _id: String
    firstname: String
    lastname: String
    email: String
    role:String
    isActive:Boolean
    isVerified:Boolean
    isSubscribed:Boolean
  }
  input UserInput {
    _id: String
    firstname: String
    lastname: String
    email: String
    password:String
    role:String
    isActive:String
    isVerified:Boolean
    verifyEmailCode: String
    isSubscribed:Boolean
  }


  input LoginInput {
    email:String!,
    password:String!
  }

  type File {
    id: ID!
    filePath:String!
    filename: String!
    mimetype: String!
  }

 
#################################### Query & mutation ################################

  type Query {
    getUserProfile: User
    # Upload:Upload
  }

  type Mutation {
    register(user:UserInput): Authentication
    login(user:LoginInput!): Authentication
    updateUser(user:UserInput): User
    uploadSingleFile(file:Upload!): File!
    uploadMultipleFiles(files: [Upload!]!):  [File]!
    # uploadMultipleFiles(files: [Upload!]!): [File!]!
    # uploadSingleFileTest(id:String ): Boolean
  }
`;

export const resolvers = merge(userResolvers);

export const executableSchema = makeExecutableSchema({
  resolvers: {
    ...resolvers
  },
  typeDefs
});

