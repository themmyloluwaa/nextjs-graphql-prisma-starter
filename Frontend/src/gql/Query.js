import { gql } from "@apollo/client";

const Query = {
  users: gql`
    query {
      users {
        id
        name
        email
        phone
      }
    }
  `,
  chats: gql`
    query chats($receiverId: Int!, $senderId: Int!) {
      chats(
        where: {
          OR: [
            {
              AND: [
                { receiverId: { equals: $receiverId } }
                { senderId: { equals: $senderId } }
              ]
            }
            {
              AND: [
                { receiverId: { equals: $senderId } }
                { senderId: { equals: $receiverId } }
              ]
            }
          ]
        }
      ) {
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

export default Query;
