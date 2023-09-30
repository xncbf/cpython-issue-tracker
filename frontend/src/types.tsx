export type Issue = {
  id: number;
  title: string;
  updated_at: Date;
  draft: boolean | null;
  comments_url: string;
  comments: number;
  html_url: string;
  closed_at: Date | null;
  repository_url: string;
  timeline_url: string;
  state: string;
  reactions: {};
  performed_via_github_app: string | null;
  assignee: User | null;
  created_at: Date;
  state_reason: string | null;
  body: string | null;
  locked: boolean;
  labels: [Label];
  milestone: string | null;
  labels_url: string;
  number: number;
  node_id: string;
  author_association: string;
  pull_request: PullRequest | null;
  user: User;
  active_lock_reason: string | null;
  assignees: [User];
  events_url: string;
  url: string;
};

export type IssueAPIResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  items: Issue[];
};

export type LabelAPIResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  items: Label[];
};

export type Label = {
  id: number;
  node_id: string;
  url: string;
  name: string;
  description: string | null;
  color: string;
  default: boolean;
};

export type User = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
};

type PullRequest = {
  url: string;
  html_url: string;
  diff_url: string;
  patch_url: string;
  merged_at: string | null;
};
