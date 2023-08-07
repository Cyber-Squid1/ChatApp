import { gql } from '@apollo/client';

export const GET_ALL_USERS = gql`
    query getAllUsers {
        users {
            Email
            FirstName
            LastName
            id
        }
    }   
`

export const GET_MSG = gql`
query ShowMessageByUser($receiverId: Int!) {
    showMessageByUser(ReceiverId: $receiverId) {
        CreatedAt
        ReceiverId
        SenderId
        Text
        id
    }
}
`