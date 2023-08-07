import { gql } from 'apollo-server-express';
const typeDefs = gql`
    type Query{
        users: [User]
        showMessageByUser(ReceiverId:Int!):[Message]
    }
    type Token{
        token: String!
    }
    type Message{
        id: ID!
        Text: String!
        ReceiverId: Int!
        SenderId: Int!
        CreatedAt:Date!
    }
    scalar Date
    # Creating new input type using input
    input UserInput{
        FirstName:String!
        LastName:String!
        Email:String!
        Password:String!
    }
    input UserSignInInput{
        Email:String!
        Password:String!
    }
    # Here the object type UserInput is the new type that we have defined above
    type Mutation{
        signUpUser(newUser:UserInput):User
        signInUser(userSignIn:UserSignInInput):Token
        createMessage(ReceiverId:Int!,Text:String!):Message
    }

    type User{
        id: ID!
        FirstName: String!
        LastName: String!
        Email: String!
    }

    type Subscription{
        messageAdded:Message
    }
`

export default typeDefs
