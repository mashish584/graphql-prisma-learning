import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getUserId } from "../utils";

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    if (args.data.password.length < 7)
      throw new Error("Password should be 7 characters long.");

    const password = await bcrypt.hash(args.data.password, 10);

    const emailTaken = await prisma.exists.User({ email: args.data.email });

    if (emailTaken) throw new Error("Email already taken.");

    const user = prisma.mutation.createUser({
      data: {
        ...args.data,
        password,
      },
    });

    return {
      user,
      token: jwt.sign({ userId: user.id }, "mySecret"),
    };
  },
  async loginUser(parent, { data }, { prisma }, info) {
    const user = await prisma.query.user({
      where: { email: data.email },
    });

    if (!user) throw new Error("Invalid credentials");

    const isPasswordMatch = await bcrypt.compare(data.password, user.password);

    if (!isPasswordMatch) throw new Error("Invalid credentials");

    return {
      user,
      token: jwt.sign({ userId: user.id }, "mySecret"),
    };
  },
  updateUser(parent, { id, data }, { db }, info) {
    return prisma.mutation.updateUser(
      { where: { id: args.id }, data: args.data },
      info
    );
  },
  deleteUser(parent, args, { prisma }, info) {
    // const userExist = prisma.exists.User({ email: args.id });

    // if (!userExist) throw new Error("User not found.");

    return prisma.mutation.deleteUser({ where: { id: args.id } }, info);
  },
  createPost(parent, args, { prisma, pubSub, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.createPost(
      {
        data: {
          title: args.data.title,
          body: args.data.body,
          published: args.data.published || false,
          author: {
            connect: {
              id: userId,
            },
          },
        },
      },
      info
    );
  },
  updatePost(parent, { id, data }, { prisma }, info) {
    const post = prisma.query.post({ where: { id: id } });

    if (!post) throw new Error("Post not exist");

    if (
      (data.title && typeof data.title !== "string") ||
      (data.body && typeof data.body !== "string") ||
      (data.published && typeof data.published !== "boolean")
    ) {
      throw new Error("Please check data");
    }

    return prisma.mutation.updatePost({ where: { id: id }, data: data }, info);
  },
  deletePost(parent, args, { prisma }, info) {
    return prisma.mutation.deletePost({ where: { id: args.id } }, info);
    // const postIndex = db.posts.findIndex((post) => post.id == args.id);

    // if (postIndex === -1) throw new Error("Post not found.");

    // const [deletedPost] = db.posts.splice(postIndex, 1);

    // db.comments = db.comments.filter((comment) => comment.post != args.id);
    // if (deletedPost.published) {
    //   pubSub.publish("POST", {
    //     post: {
    //       mutation: "DELETED",
    //       data: deletedPost,
    //     },
    //   });
    // }

    // return deletedPost;
  },
  createComment(parent, args, { prisma }, info) {
    // const userExist = db.users.find((user) => user.id == args.data.author);
    // const postExist = db.posts.find((post) => post.id == args.data.post);

    // if (!userExist) throw new Error("Author not recognized.");
    // if (!postExist) throw new Error("Post not exist.");

    // const comment = {
    //   id: uuidV4(),
    //   ...args.data,
    // };

    // db.comments.push(comment);
    // pubSub.publish(`Comment ${args.data.post}`, {
    //   comment: {
    //     mutation: "CREATED",
    //     data: comment,
    //   },
    // });

    return prisma.mutation.createComment(
      {
        data: {
          ...args.data,
          author: {
            connect: {
              id: args.data.author,
            },
          },
          post: {
            connect: {
              id: args.data.post,
            },
          },
        },
      },
      info
    );
  },
  updateComment(parent, { id, data }, { prisma }, info) {
    // const comment = db.comments.find((comment) => comment.id == id);

    // if (!comment) throw new Error("Comment not exist.");

    // if (typeof data.text === "string") {
    //   comment.text = data.text;
    // }

    // pubSub.publish(`Comment ${comment.post}`, {
    //   comment: {
    //     mutation: "UPDATED",
    //     data: comment,
    //   },
    // });

    return prisma.mutation.updateComment({ where: { id: id }, data }, info);
  },
  deleteComment(parent, args, { db, pubSub }, info) {
    const commentIndex = db.comments.findIndex((comment) => {
      return comment.id == args.id;
    });

    if (commentIndex === -1) {
      throw new Error("Comment not found");
    }

    const [deleteComment] = db.comments.splice(commentIndex, 1);

    pubSub.publish(`Comment ${deleteComment.post}`, {
      comment: {
        mutation: "DELETED",
        data: deleteComment,
      },
    });

    return deleteComment;
  },
};

export { Mutation as default };
