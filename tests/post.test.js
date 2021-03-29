import "cross-fetch/polyfill";
import { gql } from "apollo-boost";
import prisma from "../src/prisma";

import seedDatabase, { user, post } from "./utils/seedDatabase";
import getClient from "./utils/getClient";
import {
  createPostQuery,
  deletePostQuery,
  myPostsQuery,
  postQuery,
  updatePostQuery,
} from "./utils/operations";

const client = getClient();

jest.setTimeout(30000);

beforeEach(seedDatabase);

test("Should return published posts", async () => {
  const {
    data: { posts },
  } = await client.query({ query: postQuery });

  expect(posts.length).toBe(2);
  expect(posts[0].published).toBe(true);
  expect(posts[0].author.email).toBe(null);
});

test("Should return all my posts", async () => {
  const client = getClient(user.token);

  const { data } = await client.query({ query: myPostsQuery });

  expect(data.myPosts[0].title).toBe("Sample 2");
  expect(data.myPosts[1].title).toBe("Sample 3");
});

test("Should be able to update post 1", async () => {
  const client = getClient(user.token);

  const updateData = {
    published: false,
  };

  const { data } = await client.mutate({
    mutation: updatePostQuery,
    variables: {
      postId: post.data.id,
      data: updateData,
    },
  });
  const exists = await prisma.exists.Post({
    id: post.data.id,
    published: false,
  });
  expect(data.updatePost.published).toBe(false);
  expect(exists).toBe(true);
});

test("Should create post", async () => {
  const client = getClient(user.token);

  const variables = {
    data: { title: "New Post", published: true, body: "Lorem ipsum..." },
  };

  const {
    data: { createPost },
  } = await client.mutate({ mutation: createPostQuery, variables });

  const isPostExist = await prisma.exists.Post({ id: createPost.id });

  expect(isPostExist).toBe(true);
});

test("should be able to delete my post", async () => {
  const client = getClient(user.token);

  await client.mutate({
    mutation: deletePostQuery,
    variables: {
      postId: post.data.id,
    },
  });
  const exists = await prisma.exists.Post({
    id: post.data.id,
  });

  expect(exists).toBe(false);
});
