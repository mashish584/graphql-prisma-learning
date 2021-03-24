import { getFirstName, isValidPassword } from "../src/utils/user";

test("On passing fullname of user getting firstname in return", () => {
  const value = getFirstName("Ashish Mehra");
  expect(value).toBe("Ashish");
});

test("On passing firstname return firstname", () => {
  const value = getFirstName("Ashish");
  expect(value).toBe("Ashish");
});

test("Password length should be greater than 8", () => {
  const value = isValidPassword("abs212");
  expect(value).toBe(false);
});

test("Password does not include password", () => {
  const value = isValidPassword("avco124password");
  expect(value).toBe(false);
});

test("Password is greater than 8 and not include password", () => {
  const value = isValidPassword("adminpass@1234");
  expect(value).toBe(true);
});
