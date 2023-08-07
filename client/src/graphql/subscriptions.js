import { gql } from '@apollo/client';

export const MSG_SUB = gql`
    subscription Subscription {
        messageAdded {
        CreatedAt
        ReceiverId
        SenderId
        Text
        id
    }
}
`