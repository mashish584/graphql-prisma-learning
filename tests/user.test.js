import "cross-fetch/polyfill";
import { gql } from "apollo-boost";

import prisma from "../src/prisma";
import seedDatabase from "./utils/seedDatabase";
import getClient from "./utils/getClient";

const client = getClient();

jest.setTimeout(30000);

beforeEach(seedDatabase);

test("Create new user", async () => {
  const createUser = gql`
    mutation {
      createUser(
        data: {
          name: "Amit"
          email: "amit5@mailinaoe.com"
          password: "adminpass@123"
        }
      ) {
        user {
          id
          name
          email
        }
      }
    }
  `;

  const response = await client.mutate({ mutation: createUser });
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

  expect(users.length).toBe(1);
  expect(users[0].email).toBe(null);
  expect(users[0].name).toBe("Ashish");
});

test("Should throw error for bad credentials", async () => {
  const loginMutation = gql`
    mutation {
      login(data: { email: "adm@mailinator.com", password: "adminpass@12" }) {
        token
      }
    }
  `;

  await expect(client.mutate({ mutation: loginMutation })).rejects.toThrow();
});

test("Should throw error for signup with wrong password", async () => {
  const registerMutation = gql`
    mutation {
      createUser(
        data: { name: "Ashu", email: "am22@mailinator.com", password: "123" }
      ) {
        token
      }
    }
  `;

  await expect(client.mutate({ mutation: registerMutation })).rejects.toThrow();
});
