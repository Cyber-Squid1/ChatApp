import pc from '@prisma/client';
import bcrypt from 'bcrypt';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import { PubSub } from 'graphql-subscriptions'

const pubsub = new PubSub()
const MESSAGE_ADDED = 'MESSAGE_ADDED'

const prisma = new pc.PrismaClient();
const resolvers = {
    Query: {
        users: async (_, args, { userId }) => {
            if (!userId) throw new ForbiddenError("Please login to access these resources.");
            /* The below findMany query returns all users except the user who requested for the resources
            and sorts them by their create time in descending order */
            const getUsers = await prisma.user.findMany({
                orderBy: {
                    CreatedAt: 'desc'
                },
                where: {
                    id: {
                        not: userId
                    }
                }
            });
            return getUsers;
        },
        showMessageByUser: async (_, { ReceiverId }, { userId }) => {
            if (!userId) throw new ForbiddenError("Please login to access these resources.");
            const messages = await prisma.message.findMany({
                where: {
                    OR: [
                        { SenderId: userId, ReceiverId },
                        { SenderId: ReceiverId, ReceiverId: userId }
                    ]
                },
                orderBy: {
                    CreatedAt: "asc"
                }
            })
            return messages;
        }
    },
    Mutation: {
        signUpUser: async (_, { newUser }) => {
            const tempUser = await prisma.user.findUnique({ where: { Email: newUser.Email } });
            if (tempUser) throw new AuthenticationError(`User already exists with email ${newUser.Email}`);
            const hashedPassword = await bcrypt.hash(newUser.Password, 10);
            const newCreatedUser = await prisma.user.create({
                data: {
                    ...newUser,
                    Password: hashedPassword
                }
            })
            return newCreatedUser;
        },
        signInUser: async (_, { userSignIn }) => {
            // Authentication Code
            const tempUser = await prisma.user.findUnique({ where: { Email: userSignIn.Email } });
            if (!tempUser) throw new AuthenticationError(`User with email: ${userSignIn.Email} does't exist. Please create an account to Sign In.`);
            const passMatch = await bcrypt.compare(userSignIn.Password, tempUser.Password);
            if (!passMatch) throw new AuthenticationError('Invalid Sign In credentials. Please check your Email and Password.');
            const token = jwt.sign({ userId: tempUser.id }, process.env.JWT_SECRET);
            return { token }
        },
        createMessage: async (_, { ReceiverId, Text }, { userId }) => {
            if (!userId) throw new ForbiddenError("Please login to access this functionality.");
            const message = await prisma.message.create({
                data: {
                    Text,
                    ReceiverId,
                    SenderId: userId
                }
            });
            pubsub.publish(MESSAGE_ADDED, { messageAdded: message })
            return message;
        }
    },
    Subscription: {
        messageAdded: {
            subscribe: () => pubsub.asyncIterator(MESSAGE_ADDED)
        }
    }
}


export default resolvers;
