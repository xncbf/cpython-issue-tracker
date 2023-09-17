import os

import django
import httpx

django.setup()

from app.models import Issue, Label, User  # noqa

GITHUB_API_URL = "https://api.github.com/repos/python/cpython/issues"
HEADERS = {
    "Accept": "application/json",
    "Authorization": f"Bearer {os.environ['GITHUB_TOKEN']}",
}


def fetch_all_issues():
    page = 1
    with httpx.Client() as client:
        while True:
            response = client.get(
                GITHUB_API_URL + "?filter=all&state=all",
                headers=HEADERS,
                params={"page": page, "per_page": 100},
            )
            if response.status_code != 200:
                print(response.status_code, response.text)
                break

            issues = response.json()
            if not issues:
                break

            print(page)
            for issue_data in issues:
                labels = issue_data.pop("labels")
                assignee = issue_data.pop("assignee", None)
                if assignee:
                    user, _ = User.objects.get_or_create(id=assignee.pop("id"), defaults=assignee)
                    issue_data["assignee"] = user
                assignees = issue_data.pop("assignees", None)
                pull_request = issue_data.pop("pull_request", None)
                if pull_request:
                    issue_data["is_issue"] = False
                user = issue_data.pop("user")
                user, _ = User.objects.get_or_create(id=user.pop("id"), defaults=user)
                issue_data["user"] = user

                issue, _ = Issue.objects.get_or_create(id=issue_data.pop("id"), defaults=issue_data)
                if assignees:
                    issue.assignees.set(
                        [
                            User.objects.get_or_create(id=assignee.pop("id"), defaults=assignee)[0]
                            for assignee in assignees
                        ]
                    )
                labels = [Label.objects.get(id=label["id"]) for label in labels]
                issue.labels.set(labels)
            page += 1


def fetch_all_labels():
    with httpx.Client() as client:
        response = client.get(
            "https://api.github.com/repos/python/cpython/labels",
            headers=HEADERS,
            params={"per_page": 100},
        )
        if response.status_code != 200:
            print(response.status_code, response.text)

        labels = response.json()

        for label_data in labels:
            label, _ = Label.objects.get_or_create(id=label_data.pop("id"), defaults=label_data)


if __name__ == "__main__":
    fetch_all_labels()
    fetch_all_issues()
