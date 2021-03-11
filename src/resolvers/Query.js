const Query = {
  posts(parent, args, { prisma }, info) {
    let operationalArgs = {};
    if (args.query) {
      operationalArgs.where = {
        OR: [{ title_contains: args.query }, { body_contains: args.query }],
      };
    }
    return prisma.query.posts(operationalArgs, info);
  },
  users(parent, args, { prisma }, info) {
    let operationalArgs = {};
    if (args.query) {
      operationalArgs.where = {
        OR: [{ name_contains: args.query }, { email_contains: args.query }],
      };
    }
    return prisma.query.users(operationalArgs, info);
  },
  comments(parent, args, { prisma }, info) {
    return prisma.query.comments(null, info);
  },
};

export { Query as default };
