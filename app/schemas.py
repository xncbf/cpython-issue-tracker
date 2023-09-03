from ninja import Schema
from datetime import datetime

class IssueSchema(Schema):
    updated_at: datetime
    draft: dict | bool | None = None
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
