import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../src/prisma";

const user = {
  input: {
    name: "Ashish",
    email: "am@mailinator.com",
    password: bcrypt.hashSync("adminpass@123", 10),
  },
  userInfo: undefined,
};

const post = {
  input: {
    title: "Sample 2",
    body: "Lorem ipsum doler sit",
    published: false,
  },
  data: undefined,
};

const seedDatabase = async () => {
  await prisma.mutation.deleteManyUsers();
  await prisma.mutation.deleteManyPosts();

  user.userInfo = await prisma.mutation.createUser({
    data: user.input,
  });

  user.token = jwt.sign({ userId: user.userInfo.id }, process.env.JWT_SECRET);

  post.data = await prisma.mutation.createPost({
    data: {
      ...post.input,
      author: { connect: { id: user.userInfo.id } },
    },
  });

  await prisma.mutation.createPost({
    data: {
      title: "Sample 3",
      body: "Lorem ipsum doler sit",
      published: true,
      author: { connect: { id: user.userInfo.id } },
    },
  });
};

export { seedDatabase as default, user, post };
