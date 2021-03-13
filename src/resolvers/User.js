import { getUserId } from "../utils";

const User = {
  posts: {
    fragment: "fragment userId on User {id}",
    resolve(parent, args, { prisma }, info) {
      return prisma.query.posts({
        where: {
          published: true,
          author: {
            id: parent.id,
          },
        },
      });
    },
  },
  email: {
    fragment: "fragment userId on User {id}",
    resolve(parent, args, { request }, info) {
      const userId = getUserId(request, false);
      if (userId && parent.id === userId) {
        return parent.email;
      } else {
        return null;
      }
    },
  },
};

export { User as default };
