from ninja import Schema, FilterSchema, Field
from datetime import datetime

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
    labels: list
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
    user: dict

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
    title: str | None = Field(q='title__icontains')
    updated_at: datetime | None
    url: str | None
    user: dict | None


class LabelSchema(Schema):
    color: str
    data_json: dict | None = None
    default: bool
    description: str | None = None
    id: int
    name: str
    node_id: str
    url: str


class LabelFilterSchema(FilterSchema):
    name: str | None = Field(q='name__icontains')