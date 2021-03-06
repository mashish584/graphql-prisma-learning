import { getUserId } from "../utils";

const Query = {
  posts(parent, args, { prisma }, info) {
    let operationalArgs = {
      where: {
        published: true,
      },
      skip: args.skip,
      first: args.first,
      after: args.after,
      orderBy: args.orderBy,
    };
    if (args.query) {
      operationalArgs.where.OR = [
        { title_contains: args.query },
        { body_contains: args.query },
      ];
    }
    return prisma.query.posts(operationalArgs, info);
  },

  users(parent, args, { prisma }, info) {
    let operationalArgs = {
      skip: args.skip,
      first: args.first,
      after: args.after,
      orderBy: args.orderBy,
    };
    if (args.query) {
      operationalArgs.where = {
        OR: [{ name_contains: args.query }, { email_contains: args.query }],
      };
    }
    return prisma.query.users(operationalArgs, info);
  },

  comments(parent, args, { prisma }, info) {
    const query = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy,
    };

    return prisma.query.comments(query, info);
  },

  async post(parent, args, { prisma, request }, info) {
    const userId = getUserId(request, false);

    const [post] = await prisma.query.posts({
      where: {
        id: args.id,
        OR: [
          {
            author: {
              id: userId,
            },
          },
          { published: true },
        ],
      },
    });

    if (!post) throw new Error("Post not found...");

    return post;
  },

  async me(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const user = await prisma.query.user({ where: { id: userId } });

    return user;
  },

  async myPosts(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const operationalArgs = {
      where: { author: { id: userId } },
    };

    if (args.query) {
      operationalArgs.where.OR = [
        { title_contains: args.query },
        { body_contains: args.query },
      ];
    }

    const posts = await prisma.query.posts(operationalArgs);

    return posts;
  },
};

export { Query as default };
