import bcrypt from "bcryptjs";
import { generateToken, getUserId, validateAndHashPassword } from "../utils";

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const password = await validateAndHashPassword(args.data.password);
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
      token: generateToken(user.id),
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
      token: generateToken(user.id),
    };
  },

  async updateUser(parent, { id, data }, { prisma, request }, info) {
    const userId = getUserId(request);

    if (data.password) {
      data.password = await validateAndHashPassword(data.password);
    }

    return prisma.mutation.updateUser(
      { where: { id: userId }, data: data },
      info
    );
  },

  deleteUser(parent, args, { prisma }, info) {
    const userId = getUserId();
    // const userExist = prisma.exists.User({ email: args.id });

    // if (!userExist) throw new Error("User not found.");

    return prisma.mutation.deleteUser({ where: { id: userId } }, info);
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
  async updatePost(parent, { id, data }, { prisma, request }, info) {
    const userId = getUserId(request);

    const isUserPost = await prisma.exists.Post({
      id,
      author: {
        id: userId,
      },
    });

    if (!isUserPost) throw new Error("Authorization required");

    if (
      (data.title && typeof data.title !== "string") ||
      (data.body && typeof data.body !== "string") ||
      (data.published && typeof data.published !== "boolean")
    ) {
      throw new Error("Please check data");
    }

    const isPublishedPosts = await prisma.exists.Post({ id, published: true });

    if (isPublishedPosts && data.published === false) {
      await prisma.mutation.deleteManyComments({
        where: {
          post: {
            id,
          },
        },
      });
    }

    return prisma.mutation.updatePost({ where: { id: id }, data: data }, info);
  },
  async deletePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const isUserPost = await prisma.exists.Post({
      id: args.id,
      where: { author: userId },
    });

    if (!isUserPost) throw new Error("Authorization required");

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
  async createComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const isPublishedPost = await prisma.exists.Post({
      id: args.data.post,
      published: true,
    });

    if (!isPublishedPost) throw new Error("Unable to comment...");

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
              id: userId,
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
  updateComment(parent, { id, data }, { prisma, request }, info) {
    const userId = getUserId(request);

    const isUserComment = prisma.exists.Comment({ id, author: { id: userId } });

    if (!isUserComment) throw new Error("Authorization required");

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
  async deleteComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const commentExist = await prisma.exists.Comment({
      where: { id: args.id },
    });

    if (!commentExist) throw new Error("Comment not exist");

    const isUserComment = await prisma.exists.Comment({
      where: { author: userId },
    });

    if (!isUserComment) throw new Error("Authorization required");

    return prisma.mutation.deleteComment({ where: { id: args.id } });
  },
};

export { Mutation as default };
