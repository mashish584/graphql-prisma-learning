import "cross-fetch/polyfill";
import getClient from "./utils/getClient";
import {
  commentsSubscriptionQuery,
  deleteCommentQuery,
} from "./utils/operations";
import seedDatabase, {
  comments,
  post,
  user,
  user2,
} from "./utils/seedDatabase";
import prisma from "../src/prisma";

const client = getClient();

jest.setTimeout(30000);

beforeEach(seedDatabase);

test("Should delete own comment", async () => {
  const client = getClient(user.token);
  await client.mutate({
    mutation: deleteCommentQuery,
    variables: {
      commentId: comments[0].data.id,
    },
  });

  const isExist = await prisma.exists.Comment({ id: comments[0].data.id });

  expect(isExist).toBe(false);
});

test("Should not delete other comments", async () => {
  const client = getClient(user2.token);

  await expect(
    client.mutate({
      mutation: deleteCommentQuery,
      variables: {
        commentId: comments[0].data.id,
      },
    })
  ).rejects.toThrow();
});

test("Should subscribe to comments for a post", async (done) => {
  const variables = {
    postId: post.data.id,
  };

  client.subscribe({ query: commentsSubscriptionQuery, variables }).subscribe({
    next(response) {
      expect(response.data.comment.mutation).toBe("DELETED");
      done();
    },
  });

  await prisma.mutation.deleteComment({ where: { id: comments[1].data.id } });
});
