import { gql } from '@apollo/client';

export const SIGNUP_USER = gql`
    mutation SignUpUser($newUser: UserInput) {
      signUpUser(newUser: $newUser) {
      id
      Email
      FirstName
      LastName
      }
    }
`

export const LOGIN_USER = gql`
mutation SignInUser($userSignIn: UserSignInInput) {
  signInUser(userSignIn: $userSignIn) {
    token
  }
}
`

export const SEND_MESSAGE=gql`
mutation CreateMessage($receiverId: Int!, $text: String!) {
  createMessage(ReceiverId: $receiverId, Text: $text) {
    CreatedAt
    ReceiverId
    SenderId
    Text
    id
  }
}
`