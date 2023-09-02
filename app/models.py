from django.db import models


class Issue(models.Model):
    data_json = models.JSONField(null=True, blank=True)
