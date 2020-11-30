type GitHubEventActor = {
  id: number,
  login: string,
  display_login: string,
  avatar_url: string,
};

type GitHubEventRepo = {
  id: number,
  name: string,
};

export type GitHubForkEventPayload = {
  forkee: any,
};

export type GitHubPushEventCommit = {
  sha: string,
  message: string,
  author: { name: string, email: string },
};

export type GitHubPushEventPayload = {
  push_id: number,
  size: number,
  distinct_size: number,
  ref: string,
  head: string,
  before: string,
  commits: GitHubPushEventCommit[],
};

export type GitHubWatchEventPayload = {
  action: string,
};

export type GitHubEvent = {
  id: string,
  type: string,
  actor: GitHubEventActor,
  repo: GitHubEventRepo,
  payload: GitHubForkEventPayload | GitHubPushEventPayload | GitHubWatchEventPayload,
  created_at: string,
};
