from datetime import datetime

from ninja import Field, FilterSchema, Schema


class UserSchema(Schema):
    avatar_url: str
    events_url: str
    followers_url: str
    following_url: str
    gists_url: str
    gravatar_id: str
    html_url: str
    id: int
    login: str
    node_id: str
    organizations_url: str
    received_events_url: str
    repos_url: str
    site_admin: bool
    starred_url: str
    subscriptions_url: str
    type: str
    url: str


class LabelSchema(Schema):
    color: str
    default: bool
    description: str | None = None
    id: int
    name: str
    node_id: str
    url: str


class LabelFilterSchema(FilterSchema):
    name: str | None = Field(q="name__icontains")


class IssueSchema(Schema):
    active_lock_reason: str | None = None
    assignee: dict | None = None
    assignees: list
    author_association: str
    body: str | None = None
    closed_at: datetime | None = None
    comments: int
    comments_url: str
    created_at: datetime
    draft: bool | None = None
    events_url: str
    html_url: str
    id: int
    labels: list[LabelSchema]
    labels_url: str
    locked: bool
    milestone: str | None = None
    node_id: str
    number: int
    performed_via_github_app: str | None = None
    pull_request: dict | None = None
    reactions: dict
    repository_url: str
    state: str
    state_reason: str | None = None
    timeline_url: str
    title: str
    updated_at: datetime
    url: str
    user: UserSchema


class IssueFilterSchema(FilterSchema):
    active_lock_reason: str | None
    assignee: dict | None
    assignees: list | None
    author_association: str | None
    body: str | None
    closed_at: datetime | None
    comments: int | None
    comments_url: str | None
    created_at: datetime | None
    draft: bool | None
    events_url: str | None
    html_url: str | None
    id: int | None
    labels: list | None
    labels_url: str | None
    locked: bool | None
    milestone: str | None
    node_id: str | None
    number: int | None
    performed_via_github_app: str | None
    pull_request: dict | None
    reactions: dict | None
    repository_url: str | None
    state: str | None
    state_reason: str | None
    timeline_url: str | None
    title: str | None = Field(q="title__icontains")
    updated_at: datetime | None
    url: str | None
    user: dict | None
