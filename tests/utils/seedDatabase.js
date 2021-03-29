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

const user2 = {
  input: {
    name: "Siddhant",
    email: "sd@mailinator.com",
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

const comments = [
  {
    input: {
      text: "First comment by first user",
    },
    data: undefined,
  },
  {
    input: {
      text: "Second comment by second user",
    },
    data: undefined,
  },
];

const seedDatabase = async () => {
  await prisma.mutation.deleteManyComments();
  await prisma.mutation.deleteManyUsers();
  await prisma.mutation.deleteManyPosts();

  user.userInfo = await prisma.mutation.createUser({
    data: user.input,
  });

  user.token = jwt.sign({ userId: user.userInfo.id }, process.env.JWT_SECRET);

  user2.userInfo = await prisma.mutation.createUser({
    data: user2.input,
  });

  user2.token = jwt.sign({ userId: user2.userInfo.id }, process.env.JWT_SECRET);

  post.data = await prisma.mutation.createPost({
    data: {
      ...post.input,
      author: { connect: { id: user.userInfo.id } },
      published: true,
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

  comments[0].data = await prisma.mutation.createComment({
    data: {
      ...comments[0].input,
      author: {
        connect: {
          id: user.userInfo.id,
        },
      },
      post: {
        connect: {
          id: post.data.id,
        },
      },
    },
  });

  comments[1].data = await prisma.mutation.createComment({
    data: {
      ...comments[1].input,
      author: {
        connect: {
          id: user2.userInfo.id,
        },
      },
      post: {
        connect: {
          id: post.data.id,
        },
      },
    },
  });
};

export { seedDatabase as default, user, user2, post, comments };
