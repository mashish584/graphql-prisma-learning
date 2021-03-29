import "cross-fetch/polyfill";
import getClient from "./utils/getClient";
import { deleteCommentQuery } from "./utils/operations";
import seedDatabase, { comments, user, user2 } from "./utils/seedDatabase";
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
