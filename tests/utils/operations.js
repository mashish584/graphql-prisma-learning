import { gql } from "apollo-boost";

export const createUser = gql`
  mutation($data: CreateUserInput!) {
    createUser(data: $data) {
      user {
        id
        name
        email
      }
    }
  }
`;

export const loginMutation = gql`
  mutation($data: LoginUserInput!) {
    login(data: $data) {
      token
    }
  }
`;

export const myProfile = gql`
  query {
    me {
      id
      name
      email
    }
  }
`;

export const postQuery = gql`
  query {
    posts {
      id
      title
      published
      author {
        email
      }
    }
  }
`;

export const myPostsQuery = gql`
  query {
    myPosts {
      id
      title
    }
  }
`;

export const updatePostQuery = gql`
  mutation($postId: ID!, $data: UpdatePostInput!) {
    updatePost(id: $postId, data: $data) {
      id
      title
      body
      published
    }
  }
`;

export const createPostQuery = gql`
  mutation($data: CreatePostInput!) {
    createPost(data: $data) {
      id
    }
  }
`;

export const deletePostQuery = gql`
  mutation($postId: ID!) {
    deletePost(id: $postId) {
      id
    }
  }
`;
