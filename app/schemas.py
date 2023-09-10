from ninja import Schema, FilterSchema
from datetime import datetime

class IssueSchema(Schema):
    updated_at: datetime
    draft: bool | None = None
    comments_url: str
    comments: int
    html_url: str
    closed_at: datetime | None = None
    repository_url: str
    timeline_url: str
    state: str
    reactions: dict
    performed_via_github_app: str | None = None
    title: str
    assignee: dict | None = None
    created_at: datetime
    state_reason: str | None = None
    body: str | None = None
    locked: bool
    labels: list
    milestone: str | None
    labels_url: str
    id: int
    number: int
    node_id: str
    author_association: str
    pull_request: dict | None = None
    user: dict
    active_lock_reason: str | None = None
    assignees: list
    events_url: str
    url: str


class IssueFilterSchema(FilterSchema):
    updated_at: datetime | None
    draft: bool | None
    comments_url: str | None
    comments: int | None
    html_url: str | None
    closed_at: datetime | None
    repository_url: str | None
    timeline_url: str | None
    state: str | None
    reactions: dict | None
    performed_via_github_app: str | None
    title: str | None
    assignee: dict | None
    created_at: datetime | None
    state_reason: str | None
    body: str | None
    locked: bool | None
    labels: list | None
    milestone: str | None
    labels_url: str | None
    id: int | None
    number: int | None
    node_id: str | None
    author_association: str | None
    pull_request: dict | None
    user: dict | None
    active_lock_reason: str | None
    assignees: list | None
    events_url: str | None
    url: str | None
