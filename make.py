import django
django.setup()

from app.models import Issue
from app.schemas import IssueSchema

issues = Issue.objects.all()


for issue in issues:
    IssueSchema(**issue.data_json)