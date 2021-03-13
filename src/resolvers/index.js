import { extractFragmentReplacements } from "prisma-binding";

import Query from "./Query";
import Mutation from "./Mutations";
import Post from "./Post";
import User from "./User";
import Comment from "./Comments";
import Subscription from "./Subscription";

const resolvers = { Query, Mutation, Post, User, Comment, Subscription };

const fragmentReplacements = extractFragmentReplacements(resolvers);

export { resolvers, fragmentReplacements };
