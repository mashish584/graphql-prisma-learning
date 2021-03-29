import "cross-fetch/polyfill";
import { gql } from "apollo-boost";

import prisma from "../src/prisma";
import seedDatabase, { user } from "./utils/seedDatabase";
import getClient from "./utils/getClient";
import { createUser, loginMutation, myProfile } from "./utils/operations";

const client = getClient();

jest.setTimeout(30000);

beforeEach(seedDatabase);

test("Create new user", async () => {
  const variables = {
    data: {
      name: "Amit",
      email: "amit5@mailinaoe.com",
      password: "adminpass@123",
    },
  };

  const response = await client.mutate({
    mutation: createUser,
    variables,
  });
  const isExist = await prisma.exists.User({
    id: response.data.createUser.user.id,
  });

  expect(isExist).toBe(true);
});

test("Should return public author profiles", async () => {
  const userQuery = gql`
    query {
      users {
        id
        name
        email
      }
    }
  `;

  const {
    data: { users },
  } = await client.query({
    query: userQuery,
  });

  expect(users.length).toBe(2);
  expect(users[0].email).toBe(null);
  expect(users[0].name).toBe("Ashish");
});

test("Should throw error for bad credentials", async () => {
  const variables = {
    data: { email: "adm@mailinator.com", password: "adminpass@12" },
  };

  await expect(
    client.mutate({ mutation: loginMutation, variables })
  ).rejects.toThrow();
});

test("Should throw error for signup with wrong password", async () => {
  const variables = {
    data: {
      name: "Amit",
      email: "amit5@mailinaoe.com",
      password: "adm",
    },
  };

  await expect(
    client.mutate({ mutation: createUser, variables })
  ).rejects.toThrow();
});

test("Should return my profile", async () => {
  const client = getClient(user.token);

  const { data } = await client.query({ query: myProfile });

  expect(data.me.id).toBe(user.userInfo.id);
});
