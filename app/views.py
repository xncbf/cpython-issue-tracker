from .models import Issue
from .schemas import IssueSchema
from ninja.pagination import paginate

from ninja import NinjaAPI

api = NinjaAPI()


@api.get("/issues/", response={200: list[IssueSchema]})
@paginate
def list_issues(request):
    queryset = Issue.objects.all().order_by("-id")
    return queryset

@api.get("/issues/{issue_id}", response={200: IssueSchema})
def get_issue(request, issue_id: int):
    return Issue.objects.get(id=issue_id)
