from django.db import models


class Issue(models.Model):
    data_json = models.JSONField(null=True, blank=True)
    updated_at = models.DateTimeField()
    draft = models.JSONField(null=True, blank=True) # JSONField 사용 시, dict | bool | None의 경우 고려
    comments_url = models.URLField(max_length=200)
    comments = models.PositiveIntegerField()
    html_url = models.URLField(max_length=200)
    closed_at = models.DateTimeField(null=True, blank=True)
    repository_url = models.URLField(max_length=200)
    timeline_url = models.URLField(max_length=200)
    state = models.CharField(max_length=50)
    reactions = models.JSONField()
    performed_via_github_app = models.CharField(max_length=200, null=True, blank=True)
    title = models.CharField(max_length=200)
    assignee = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField()
    state_reason = models.CharField(max_length=200, null=True, blank=True)
    body = models.TextField(null=True, blank=True)
    locked = models.BooleanField()
    labels = models.JSONField()  # JSONField를 이용해서 리스트 저장
    milestone = models.CharField(max_length=200, null=True, blank=True)
    labels_url = models.URLField(max_length=200)
    id = models.AutoField(primary_key=True)
    number = models.PositiveIntegerField()
    node_id = models.CharField(max_length=100)
    author_association = models.CharField(max_length=50)
    pull_request = models.JSONField(null=True, blank=True)
    user = models.JSONField()
    active_lock_reason = models.CharField(max_length=200, null=True, blank=True)
    assignees = models.JSONField()  # JSONField를 이용해서 리스트 저장
    events_url = models.URLField(max_length=200)
    url = models.URLField(max_length=200)

    def __str__(self):
        return self.title
