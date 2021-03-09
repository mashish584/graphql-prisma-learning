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
		subscribe(parent, { id }, { db, pubSub }, info) {
			const comment = db.comments.find((comment) => comment.post == id);

			if (!comment) throw new Error("Comment not found.");

			return pubSub.asyncIterator(`Comment ${id}`);
		},
	},

	post: {
		subscribe(parent, args, { pubSub }, info) {
			return pubSub.asyncIterator("POST");
		},
	},
};

export { Subscription as default };
