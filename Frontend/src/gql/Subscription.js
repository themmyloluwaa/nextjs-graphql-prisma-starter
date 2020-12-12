import { gql } from "@apollo/client";

const Subscription = {
  chats: gql`
    subscription chats($receiverId: Int!) {
      Chat(receiverId: $receiverId) {
        message {
          message
          createdAt
        }
        mutation
      }
    }
  `,
};

export default Subscription;
