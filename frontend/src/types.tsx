
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
    assignee: {} | null;
    created_at: Date;
    state_reason: string | null;
    body: string | null;
    locked: boolean;
    labels: [];
    milestone: string | null;
    labels_url: string;
    number: number;
    node_id: string;
    author_association: string;
    pull_request: {} | null;
    user: User;
    active_lock_reason: string | null;
    assignees: [];
    events_url: string;
    url: string;
};

export type IssueAPIResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    items: Issue[];
};

type User = {
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
}
