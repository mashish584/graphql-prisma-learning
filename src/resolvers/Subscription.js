const Subscription = {
  count: {
    subscribe(parent, ctx, { pubSub }, info) {
      let count = 0;

      setInterval(() => {
        count++;
        pubSub.publish("count", {
          count,
        });
      }, 1000);

      return pubSub.asyncIterator("count");
    },
  },
  comment: {
    subscribe(parent, { id }, { prisma }, info) {
      return prisma.subscription.comment(
        {
          where: {
            node: {
              post: {
                id: id,
              },
            },
          },
        },
        info
      );
    },
  },

  post: {
    subscribe(parent, args, { prisma }, info) {
      return prisma.subscription.post(
        {
          where: {
            node: {
              id: args.id,
            },
          },
        },
        info
      );
    },
  },
};

export { Subscription as default };
