from .models import Issue, Label
from .schemas import IssueSchema, IssueFilterSchema, LabelSchema, LabelFilterSchema
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

@api.get("/labels/", response={200: list[LabelSchema]})
@paginate
def list_labels(request, filters: LabelFilterSchema = Query(...)):
    q = filters.get_filter_expression()
    queryset = Label.objects.filter(q).order_by("name")
    return queryset
