from .models import Issue
from .schemas import IssueSchema, IssueFilterSchema
from ninja.pagination import paginate

from ninja import NinjaAPI, Query

api = NinjaAPI()


@api.get("/issues/", response={200: list[IssueSchema]})
@paginate
def list_issues(request, filters: IssueFilterSchema = Query(...)):
    q = filters.get_filter_expression()
    queryset = Issue.objects.filter(q).order_by("-id")
    return queryset

@api.get("/issues/{issue_id}", response={200: IssueSchema})
def get_issue(request, issue_id: int):
    return Issue.objects.get(id=issue_id)
