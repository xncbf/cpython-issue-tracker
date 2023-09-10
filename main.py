import httpx
import os
import django
django.setup()

from app.models import Issue

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
                issue, _ = Issue.objects.get_or_create(
                    id=issue_data.pop("id"),
                    defaults=issue_data
                )
            page += 1


if __name__ == "__main__":
    fetch_all_issues()
