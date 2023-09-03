from .models import Issue
from .schemas import IssueSchema
from ninja.pagination import paginate

from ninja import NinjaAPI

api = NinjaAPI()


@api.get("/issues/", response={200: list[IssueSchema]})
@paginate
def list_issues(request):
    queryset = Issue.objects.all()
    return queryset
