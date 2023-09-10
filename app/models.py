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
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    

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


class User(models.Model):
    login = models.CharField(max_length=100)
    id = models.AutoField(primary_key=True)
    node_id = models.CharField(max_length=100, unique=True)
    avatar_url = models.URLField()
    gravatar_id = models.CharField(max_length=100, blank=True)  # 고유한 값이라고 지정되지 않았으므로 unique=False
    url = models.URLField()
    html_url = models.URLField()
    followers_url = models.URLField()
    following_url = models.URLField()
    gists_url = models.URLField()
    starred_url = models.URLField()
    subscriptions_url = models.URLField()
    organizations_url = models.URLField()
    repos_url = models.URLField()
    events_url = models.URLField()
    received_events_url = models.URLField()
    user_type = models.CharField(max_length=100)  # `type`은 Python의 예약어이므로 다른 이름을 사용
    site_admin = models.BooleanField()
    
    def __str__(self):
        return self.login