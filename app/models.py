from django.db import models


class Issue(models.Model):
    active_lock_reason = models.CharField(max_length=200, null=True, blank=True)
    assignee = models.JSONField(null=True, blank=True)
    assignees = models.JSONField()  # JSONField를 이용해서 리스트 저장
    author_association = models.CharField(max_length=50)
    body = models.TextField(null=True, blank=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    comments = models.PositiveIntegerField()
    comments_url = models.URLField(max_length=200)
    created_at = models.DateTimeField()
    data_json = models.JSONField(null=True, blank=True)
    draft = models.BooleanField(null=True)
    events_url = models.URLField(max_length=200)
    html_url = models.URLField(max_length=200)
    id = models.AutoField(primary_key=True)
    labels = models.ManyToManyField('Label', related_name='issues')
    labels_url = models.URLField(max_length=200)
    locked = models.BooleanField()
    milestone = models.CharField(max_length=200, null=True, blank=True)
    node_id = models.CharField(max_length=100)
    number = models.PositiveIntegerField()
    performed_via_github_app = models.CharField(max_length=200, null=True, blank=True)
    pull_request = models.JSONField(null=True, blank=True)
    reactions = models.JSONField()
    repository_url = models.URLField(max_length=200)
    state = models.CharField(max_length=50)
    state_reason = models.CharField(max_length=200, null=True, blank=True)
    timeline_url = models.URLField(max_length=200)
    title = models.CharField(max_length=200)
    updated_at = models.DateTimeField()
    url = models.URLField(max_length=200)
    user = models.JSONField()
    

    def __str__(self):
        return self.title


class Label(models.Model):
    color = models.CharField(max_length=6)
    data_json = models.JSONField(null=True, blank=True)
    default = models.BooleanField()
    description = models.TextField(null=True, blank=True)
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    node_id = models.CharField(max_length=100)
    url = models.URLField(max_length=200)

    def __str__(self):
        return self.name
