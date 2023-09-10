import httpx
import os
import django
django.setup()
import copy

from app.models import Issue, Label

GITHUB_API_URL = "https://api.github.com/repos/python/cpython/issues"
HEADERS = {
    "Accept": "application/json",
    "Authorization": f"Bearer {os.environ['GITHUB_TOKEN']}"
}

def fetch_all_issues():
    page = 1
    with httpx.Client() as client:
        while True:
            response = client.get(GITHUB_API_URL + "?filter=all&state=all", headers=HEADERS, params={'page': page, 'per_page': 100})
            if response.status_code != 200:
                print(response.status_code, response.text)
                break

            issues = response.json()
            if not issues:
                break

            print(page)
            for issue_data in issues:
                issue_data['data_json'] = copy.deepcopy(issue_data)
                labels = issue_data.pop("labels")
                issue, _ = Issue.objects.get_or_create(
                    id=issue_data.pop("id"),
                    defaults=issue_data
                )
                issue.labels.set(labels)
            page += 1

def fetch_all_labels():
    with httpx.Client() as client:
        response = client.get("https://api.github.com/repos/python/cpython/labels", headers=HEADERS, params={'per_page': 100})
        if response.status_code != 200:
            print(response.status_code, response.text)

        labels = response.json()

        for label_data in labels:
            label_data['data_json'] = copy.deepcopy(label_data)
            label, _ = Label.objects.get_or_create(
                id=label_data.pop("id"),
                defaults=label_data
            )

if __name__ == "__main__":
    fetch_all_labels()
    fetch_all_issues()
