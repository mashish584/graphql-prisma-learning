import bcrypt from "bcryptjs";
import prisma from "../../src/prisma";

export default async () => {
  await prisma.mutation.deleteManyUsers();
  await prisma.mutation.deleteManyPosts();
  const user = await prisma.mutation.createUser({
    data: {
      name: "Ashish",
      email: "am@mailinator.com",
      password: bcrypt.hashSync("adminpass@123", 10),
    },
  });
  await prisma.mutation.createPost({
    data: {
      title: "Sample 2",
      body: "Lorem ipsum doler sit",
      published: false,
      author: { connect: { id: user.id } },
    },
  });
  await prisma.mutation.createPost({
    data: {
      title: "Sample 3",
      body: "Lorem ipsum doler sit",
      published: true,
      author: { connect: { id: user.id } },
    },
  });
};
