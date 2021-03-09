import { v4 as uuidV4 } from "uuid";

const Mutation = {
	createUser(parent, args, { db }, info) {
		const emailTaken = db.users.some((user) => user.email === args.data.email);

		if (emailTaken) throw new Error("Email already taken.");

		const user = {
			id: uuidV4(),
			...args.data,
		};

		db.users.push(user);

		return user;
	},
	updateUser(parent, { id, data }, { db }, info) {
		const user = db.users.find((user) => user.id == id);

		if (!user) throw new Error("User not exist.");

		if (typeof data.email === "string") {
			const emailExist = db.users.find((user) => user.email === data.email);

			if (emailExist) throw new Error("Email already exist.");

			user.email = data.email;
		}

		if (typeof data.name === "string") {
			user.name = data.name;
		}

		return user;
	},
	deleteUser(parent, args, { db }, info) {
		const userIndex = db.users.findIndex((user) => user.id == args.id);

		if (userIndex === -1) throw new Error("User not found.");

		const [deletedUser] = db.users.splice(userIndex, 1);

		db.posts = db.posts.filter((post) => {
			const match = post.author == args.id;

			if (match) {
				db.comments = db.comments.filter((comment) => comment.post != post.id);
			}

			return !match;
		});

		db.comments = db.comments.filter((comment) => comment.author != args.id);

		return deletedUser;
	},
	createPost(parent, args, { db, pubSub }, info) {
		const userExist = db.users.find((user) => user.id == args.data.author);

		if (!userExist) throw new Error("Author is not recongnized.");

		const post = {
			id: uuidV4(),
			...args.data,
		};

		db.posts.push(post);
		pubSub.publish("POST", {
			post: {
				mutation: "CREATED",
				data: post,
			},
		});

		return post;
	},
	updatePost(parent, { id, data }, { db, pubSub }, info) {
		const post = db.posts.find((post) => post.id == id);
		const originalPost = { ...post };

		if (!post) throw new Error("POst not exist");

		if (typeof data.title === "string") {
			post.title = data.title;
		}

		if (typeof data.body === "string") {
			post.body = data.body;
		}

		if (typeof data.published === "boolean") {
			post.published = data.published;

			if (originalPost.published && !post.published) {
				pubSub.publish("POST", {
					post: {
						mutation: "DELETED",
						data: post,
					},
				});
			} else if (!originalPost.published && post.published) {
				pubSub.publish("POST", {
					post: {
						mutation: "CREATED",
						data: post,
					},
				});
			}
		} else {
			pubSub.publish("POST", {
				post: {
					mutation: "UPDATE",
					data: post,
				},
			});
		}

		return post;
	},
	deletePost(parent, args, { db, pubSub }, info) {
		const postIndex = db.posts.findIndex((post) => post.id == args.id);

		if (postIndex === -1) throw new Error("Post not found.");

		const [deletedPost] = db.posts.splice(postIndex, 1);

		db.comments = db.comments.filter((comment) => comment.post != args.id);
		if (deletedPost.published) {
			pubSub.publish("POST", {
				post: {
					mutation: "DELETED",
					data: deletedPost,
				},
			});
		}

		return deletedPost;
	},
	createComment(parent, args, { db, pubSub }, info) {
		const userExist = db.users.find((user) => user.id == args.data.author);
		const postExist = db.posts.find((post) => post.id == args.data.post);

		if (!userExist) throw new Error("Author not recognized.");
		if (!postExist) throw new Error("Post not exist.");

		const comment = {
			id: uuidV4(),
			...args.data,
		};

		db.comments.push(comment);
		pubSub.publish(`Comment ${args.data.post}`, {
			comment: {
				mutation: "CREATED",
				data: comment,
			},
		});

		return comment;
	},
	updateComment(parent, { id, data }, { db, pubSub }, info) {
		const comment = db.comments.find((comment) => comment.id == id);

		if (!comment) throw new Error("Comment not exist.");

		if (typeof data.text === "string") {
			comment.text = data.text;
		}

		pubSub.publish(`Comment ${comment.post}`, {
			comment: {
				mutation: "UPDATED",
				data: comment,
			},
		});

		return comment;
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
