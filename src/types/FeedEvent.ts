import { GitHubEvent } from "./GitHubEvent";

export type FeedEvent = GitHubEvent & { bookmarked: boolean };
