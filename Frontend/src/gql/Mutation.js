import { gql } from "@apollo/client";

const Mutation = {
  login: gql`
    mutation login($password: String!, $username: String!) {
      login(password: $password, username: $username) {
        token
        user {
          id
          name
          email
        }
      }
    }
  `,
  signup: gql`
    mutation signup(
      $password: String!
      $phone: String!
      $name: String!
      $email: String
    ) {
      signup(password: $password, phone: $phone, email: $email, name: $name) {
        token
        user {
          id
          name
          email
        }
      }
    }
  `,
  createChat: gql`
    mutation createChat($receiverId: Int!, $message: String!) {
      createChat(receiverId: $receiverId, message: $message) {
        id
        receiver {
          name
          phone
          id
        }
        sender {
          name
          email
          id
        }
        message
        createdAt
      }
    }
  `,
};

export default Mutation;
