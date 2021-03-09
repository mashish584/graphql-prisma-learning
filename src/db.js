const posts = [
	{
		id: 1,
		title: "Intro to react",
		body: "A class by Max",
		published: true,
		author: "1",
	},
	{
		id: 2,
		title: "Intro to apollo",
		body: "A class by Andrew Mead",
		published: true,
		author: "2",
	},
	{
		id: 3,
		title: "Intro to Data Structures and Algorithm",
		body: "A class by Andrew Nagoei",
		published: true,
		author: "3",
	},
];

const users = [
	{
		id: 1,
		name: "Maxmillian",
		email: "max@acedmind.com",
	},
	{
		id: 2,
		name: "Andrew Mead",
		email: "mead@andrew.com",
	},
	{
		id: 3,
		name: "Andrew Nagoei",
		email: "zero@io.com",
	},
];

const comments = [
	{
		id: 1,
		text: "Nice post",
		author: 1,
		post: 1,
	},
	{
		id: 2,
		text: "Very Informative",
		author: 2,
		post: 2,
	},
	{
		id: 3,
		text: "Good one",
		author: 1,
		post: 2,
	},
	{
		id: 4,
		text: "Very Informative really",
		author: 1,
		post: 1,
	},
];

const db = { users, posts, comments };

export { db as default };
