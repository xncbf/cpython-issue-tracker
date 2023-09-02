from django.db import models


class User(models.Model):
    data_json = models.JSONField(null=True, blank=True)


class Label(models.Model):
    data_json = models.JSONField(null=True, blank=True)


class Issue(models.Model):
    data_json = models.JSONField(null=True, blank=True)
