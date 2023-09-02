from pydantic import BaseModel, HttpUrl, AnyUrl
from enum import Enum
from datetime import datetime

class User(BaseModel):
    name: str | None
    email: str | None
    login: str
    id: int
    node_id: str
    avatar_url: HttpUrl
    gravatar_id: str | None
    url: HttpUrl
    html_url: HttpUrl
    followers_url: HttpUrl
    following_url: AnyUrl
    gists_url: AnyUrl
    starred_url: AnyUrl
    subscriptions_url: HttpUrl
    organizations_url: HttpUrl
    repos_url: HttpUrl
    events_url: AnyUrl
    received_events_url: HttpUrl
    type: str
    site_admin: bool
    starred_at: str | None


class Label(BaseModel):
    id: int
    node_id: str
    url: HttpUrl
    name: str
    description: str | None
    color: str | None
    default: bool


class StateEnum(str, Enum):
    open = "open"
    closed = "closed"

class Milestone(BaseModel):
    url: HttpUrl
    html_url: HttpUrl
    labels_url: HttpUrl
    id: int
    node_id: str
    number: int
    state: StateEnum
    title: str
    description: str  = None
    creator: User | None
    open_issues: int
    closed_issues: int
    created_at: datetime
    updated_at: datetime
    closed_at: datetime | None
    due_on: datetime | None

user: User
labels: list[Label]
assignee: User | None
assignees: list[User]
milestone: Milestone | None