const Query = {
	posts(parent, args, { db }, info) {
		if (!args.query) {
			return db.posts;
		}

		return db.posts.filter(
			(post) =>
				post.title.toLowerCase().includes(args.query.toLowerCase()) ||
				post.body.toLowerCase().includes(args.query.toLowerCase())
		);
	},
	users(parent, args, { db }, info) {
		if (!args.query) {
			return db.users;
		}
	},
	comments(parent, args, { db }, info) {
		return db.comments;
	},
};

export { Query as default };
