import "cross-fetch/polyfill";
import { gql } from "apollo-boost";

import seedDatabase, { user } from "./utils/seedDatabase";
import getClient from "./utils/getClient";

const client = getClient();

jest.setTimeout(30000);

beforeEach(seedDatabase);

test("Should return published posts", async () => {
  const postQuery = gql`
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

  const {
    data: { posts },
  } = await client.query({ query: postQuery });

  expect(posts.length).toBe(1);
  expect(posts[0].published).toBe(true);
  expect(posts[0].author.email).toBe(null);
});

test("Should return all my posts", async () => {
  const client = getClient(user.token);
  const postQuery = gql`
    query {
      myPosts {
        id
        title
      }
    }
  `;

  const { data } = await client.query({ query: postQuery });

  expect(data.myPosts[0].title).toBe("Sample 2");
  expect(data.myPosts[1].title).toBe("Sample 3");
});
