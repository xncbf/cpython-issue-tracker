from ninja import NinjaAPI, Query
from ninja.pagination import paginate

from .models import Issue, Label, User
from .schemas import IssueFilterSchema, IssueSchema, LabelFilterSchema, LabelSchema, UserFilterSchema, UserSchema

api = NinjaAPI()


@api.get("/issues/", response={200: list[IssueSchema]})
@paginate
def list_issues(request, labels: list[int] = Query([]), filters: IssueFilterSchema = Query(...)):
    queryset = Issue.objects.all()
    for label in labels:
        queryset = queryset.filter(labels=label)
    q = filters.get_filter_expression()
    queryset = queryset.filter(q).order_by("-id")
    return queryset


@api.get("/issues/{issue_id}", response={200: IssueSchema})
def get_issue(request, issue_id: int):
    return Issue.objects.get(id=issue_id)


@api.get("/labels/", response={200: list[LabelSchema]})
@paginate
def list_labels(request, filters: LabelFilterSchema = Query(...)):
    q = filters.get_filter_expression()
    queryset = Label.objects.filter(q).order_by("name")
    return queryset


@api.get("/users/", response={200: list[UserSchema]})
@paginate
def list_users(request, filters: UserFilterSchema = Query(...)):
    q = filters.get_filter_expression()
    queryset = User.objects.filter(q).order_by("login")
    return queryset
